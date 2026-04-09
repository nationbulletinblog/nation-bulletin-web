import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2023-05-03',
});

async function uploadImage(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: url.split('/').pop(),
    });
    return asset._id;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function seed() {
  console.log('Starting seeding process...');

  // 1. Create Author
  const passwordHash = await bcrypt.hash('1234', 10);
  const author = {
    _type: 'author',
    _id: 'author-pratik',
    name: 'Pratik',
    slug: { _type: 'slug', current: 'pratik' },
    email: 'pratik@gmail.com',
    passwordHash: passwordHash,
    bio: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Lead developer and editor at Nation Bulletin.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
  };

  console.log('Creating author...');
  await client.createOrReplace(author);

  // 2. Create Categories
  const categories = [
    { title: 'Technology', slug: 'technology' },
    { title: 'Lifestyle', slug: 'lifestyle' },
    { title: 'Business', slug: 'business' },
    { title: 'Travel', slug: 'travel' },
    { title: 'Health', slug: 'health' },
  ];

  const categoryIds: string[] = [];
  for (const cat of categories) {
    console.log(`Creating category: ${cat.title}`);
    const res = await client.createOrReplace({
      _type: 'category',
      _id: `cat-${cat.slug}`,
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      description: `All about ${cat.title}`,
    });
    categoryIds.push(res._id);
  }

  // 3. Create Tags
  const tags = ['Next.js', 'React', 'Web Dev', 'AI', 'Marketing', 'SEO', 'Fitness', 'Cooking', 'Finance', 'Startup'];
  const tagIds: string[] = [];
  for (const tag of tags) {
    console.log(`Creating tag: ${tag}`);
    const res = await client.createOrReplace({
      _type: 'tag',
      _id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
      title: tag,
      slug: { _type: 'slug', current: tag.toLowerCase().replace(/\s+/g, '-') },
    });
    tagIds.push(res._id);
  }

  // 4. Create 20 Posts
  for (let i = 1; i <= 20; i++) {
    const title = `The Future of ${tags[i % tags.length]} in 2026 - Part ${i}`;
    const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    const imageUrl = `https://picsum.photos/seed/${slug}/1200/800`;
    
    console.log(`Creating post ${i}: ${title}`);
    const imageAssetId = await uploadImage(imageUrl);

    const post = {
      _type: 'post',
      _id: `post-${i}`,
      title,
      slug: { _type: 'slug', current: slug },
      author: { _type: 'reference', _ref: 'author-pratik' },
      mainImage: imageAssetId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAssetId },
      } : undefined,
      categories: [
        { _type: 'reference', _ref: categoryIds[i % categoryIds.length], _key: `cat-${i}` },
      ],
      tags: [
        { _type: 'reference', _ref: tagIds[i % tagIds.length], _key: `tag1-${i}` },
        { _type: 'reference', _ref: tagIds[(i + 1) % tagIds.length], _key: `tag2-${i}` },
      ],
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(), // Spread out dates
      body: [
        {
          _key: `block1-${i}`,
          _type: 'block',
          children: [{ _key: `span1-${i}`, _type: 'span', text: `In the rapidly shifting landscape of ${tags[i % tags.length]}, we are witnessing a paradigm shift that redefines our understanding of efficiency and scale.` }],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: `block2-${i}`,
          _type: 'block',
          children: [{ _key: `span2-${i}`, _type: 'span', text: 'Recent developments have shown that the convergence of decentralized systems and algorithmic oversight is creating new opportunities for sustainable growth. This intelligence dispatch dives deep into the metrics that matter for professionals in this sector.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: `block3-${i}`,
          _type: 'block',
          children: [{ _key: `span3-${i}`, _type: 'span', text: 'Traditional frameworks are increasingly becoming obsolete as we transition into an era where real-time data analysis drives every strategic decision. The ability to pivot quickly based on predictive modeling is no longer a luxury but a fundamental necessity for survival in the global market.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: `block4-${i}`,
          _type: 'block',
          children: [{ _key: `span4-${i}`, _type: 'span', text: 'Furthermore, the ethical implications of these advancements cannot be overlooked. As we push the boundaries of what is technically possible, we must also refine our legislative structures to ensure that innovation serves the broader public interest without compromising individual security.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: `block5-${i}`,
          _type: 'block',
          children: [{ _key: `span5-${i}`, _type: 'span', text: 'Our investigation into the core components of this evolution reveals three key pillars: scalability, transparency, and interoperability. By focusing on these areas, stakeholders can navigate the complexities of the current ecosystem with greater confidence and precision.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: `block6-${i}`,
          _type: 'block',
          children: [{ _key: `span6-${i}`, _type: 'span', text: 'In conclusion, the path forward requires a balanced approach that combines aggressive technological integration with a cautious appraisal of potential risks. The future of the industry depends on our collective ability to maintain this equilibrium.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
    };

    await client.createOrReplace(post);
  }

  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
