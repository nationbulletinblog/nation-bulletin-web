import * as fs from 'fs';
import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { markdownToPortableText, type ImageRefMap } from './lib/mdToPortableText';
import { loadMarkdownAndImages, parseArticles, sliceStaticSection } from './lib/parseNationBulletin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const repoRoot = join(__dirname, '../..', '..');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2023-05-03',
});

const CATEGORIES: { title: string; slug: string }[] = [
  { title: 'Business', slug: 'business' },
  { title: 'Health', slug: 'health' },
  { title: 'Services', slug: 'services' },
  { title: 'Education', slug: 'education' },
  { title: 'Technology', slug: 'technology' },
  { title: 'Shopping', slug: 'shopping' },
  { title: 'Home', slug: 'home' },
  { title: 'General', slug: 'general' },
  { title: 'SEO', slug: 'seo' },
  { title: 'Travel', slug: 'travel' },
];

function postDocId(slug: string): string {
  const safe = slug.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `post-${safe}`.slice(0, 128);
}

function excerptFromMarkdown(md: string): string {
  const blocks = md.split(/\n\n+/);
  for (const b of blocks) {
    const t = b.trim();
    if (!t || t.startsWith('#') || t.startsWith('![') || t.startsWith('* ') || t.startsWith('- ')) continue;
    return t
      .replace(/\*\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .slice(0, 280)
      .trim();
  }
  return '';
}

async function wipeSeededContent() {
  const [postIds, staticIds, tagIds, catIds] = await Promise.all([
    client.fetch<string[]>('*[_type == "post"]._id'),
    client.fetch<string[]>('*[_type == "staticPage"]._id'),
    client.fetch<string[]>('*[_type == "tag"]._id'),
    client.fetch<string[]>('*[_type == "category"]._id'),
  ]);

  const runDeletes = async (ids: string[]) => {
    const chunk = 50;
    for (let i = 0; i < ids.length; i += chunk) {
      const trx = client.transaction();
      for (const id of ids.slice(i, i + chunk)) trx.delete(id);
      await trx.commit();
    }
  };

  await runDeletes(postIds);
  await runDeletes(staticIds);
  await runDeletes(tagIds);
  await runDeletes(catIds);
}

async function uploadImageBuffer(buf: Buffer, filename: string): Promise<string | null> {
  try {
    const asset = await client.assets.upload('image', buf, { filename });
    return asset._id;
  } catch (e) {
    console.error('Image upload failed:', filename, e);
    return null;
  }
}

async function seed() {
  console.log('Loading Nation Bulletin Blogs Full.md …');
  const { textPart } = await loadMarkdownAndImages(repoRoot);

  console.log('Removing existing posts, static pages, tags, and categories …');
  await wipeSeededContent();

  const passwordHash = await bcrypt.hash('1234', 10);
  const author = {
    _type: 'author',
    _id: 'author-pratik',
    name: 'Pratik',
    slug: { _type: 'slug', current: 'pratik' },
    email: 'pratik@gmail.com',
    passwordHash,
    bio: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Lead developer and editor at Nation Bulletin.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
  };
  await client.createOrReplace(author);

  const categoryRefs: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const _id = `cat-${cat.slug}`;
    await client.createOrReplace({
      _type: 'category',
      _id,
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      description: `${cat.title} news and analysis from Nation Bulletin.`,
    });
    categoryRefs[cat.slug] = _id;
  }

  const tagRefs: Record<string, string> = {};
  const extraTags = ['Nation Bulletin', ...CATEGORIES.map((c) => c.title)];
  for (const title of extraTags) {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const _id = `tag-${slug}`;
    await client.createOrReplace({
      _type: 'tag',
      _id,
      title,
      slug: { _type: 'slug', current: slug },
    });
    tagRefs[slug] = _id;
  }

  const imageAssetIds: Record<number, string> = {};
  const mediaDir = join(__dirname, 'assets', 'seed', 'media');
  
  console.log('Uploading images from Docx …');
  for (let n = 1; n <= 19; n++) {
    // Try .png then .jpg
    let buf: Buffer | null = null;
    let ext = 'png';
    let p = join(mediaDir, `image${n}.png`);
    if (!fs.existsSync(p)) {
      p = join(mediaDir, `image${n}.jpg`);
      ext = 'jpg';
    }

    if (fs.existsSync(p)) {
      buf = fs.readFileSync(p);
      const id = await uploadImageBuffer(buf, `image${n}.${ext}`);
      if (id) {
        imageAssetIds[n] = id;
        process.stdout.write('.');
      }
    } else {
      console.warn(`\nMissing image${n}`);
    }
  }
  console.log('\nImages uploaded.');

  const imageRefs: ImageRefMap = {};
  for (const [n, ref] of Object.entries(imageAssetIds)) {
    imageRefs[`image${n}`] = { _type: 'reference', _ref: ref };
  }

  const articles = parseArticles(textPart);
  console.log(`Parsed ${articles.length} articles`);

  let publishedOffset = 0;
  for (const a of articles) {
    const pid = postDocId(a.slug);
    const catId = categoryRefs[a.categorySlug];
    if (!catId) {
      console.warn('Unknown category', a.categorySlug, a.title);
      continue;
    }
    const mainAsset = imageAssetIds[a.imageIndex];
    const body = markdownToPortableText(a.bodyMarkdown, imageRefs);
    const excerpt = excerptFromMarkdown(a.bodyMarkdown) || a.title;

    await client.createOrReplace({
      _type: 'post',
      _id: pid,
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      excerpt,
      author: { _type: 'reference', _ref: 'author-pratik' },
      mainImage: mainAsset
        ? { _type: 'image', asset: { _type: 'reference', _ref: mainAsset } }
        : undefined,
      categories: [{ _type: 'reference', _ref: catId, _key: `c-${pid}` }],
      tags: [
        { _type: 'reference', _ref: tagRefs[a.categorySlug] || tagRefs['nation-bulletin'], _key: `t1-${pid}` },
        { _type: 'reference', _ref: tagRefs['nation-bulletin'], _key: `t2-${pid}` },
      ],
      publishedAt: new Date(Date.now() - publishedOffset * 86400000).toISOString(),
      body,
    });
    publishedOffset++;
    console.log('Post:', a.title);
  }

  const staticSpecs: { _id: string; slug: string; title: string; start: string; end: string | null }[] = [
    {
      _id: 'static-page-write-for-us',
      slug: 'write-for-us',
      title: 'Write for Us',
      start: '# Write for us Content',
      end: '# Privacy Policy',
    },
    {
      _id: 'static-page-privacy',
      slug: 'privacy',
      title: 'Privacy Policy',
      start: '# Privacy Policy',
      end: '# Terms & Condition',
    },
    {
      _id: 'static-page-terms',
      slug: 'terms',
      title: 'Terms and Conditions',
      start: '# Terms & Condition',
      end: '# Content Policy',
    },
    {
      _id: 'static-page-content-policy',
      slug: 'content-policy',
      title: 'Content Policy',
      start: '# Content Policy',
      end: null,
    },
  ];

  for (const spec of staticSpecs) {
    const md = sliceStaticSection(textPart, spec.start, spec.end);
    const body = markdownToPortableText(md, imageRefs);
    await client.createOrReplace({
      _type: 'staticPage',
      _id: spec._id,
      title: spec.title,
      slug: { _type: 'slug', current: spec.slug },
      body,
    });
    console.log('Static page:', spec.slug);
  }

  console.log('Seeding completed successfully.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
