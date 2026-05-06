'use server'
import { writeClient } from '@/lib/sanity.client'
import { blogSubmissionSchema, BlogSubmission } from '@/lib/validation'
import { revalidatePath } from 'next/cache'
import { htmlToPortableText } from '@/lib/portableText'

const slugify = (text: string) => 
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 96)

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function submitBlogPost(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, message: 'Unauthorized. Please login to submit.' }
    }

    // 1. Reconstruct data from FormData
    const data: any = {
      title: formData.get('title'),
      content: formData.get('content'),
      authorName: formData.get('authorName'),
      authorEmail: formData.get('authorEmail'),
      category: formData.get('category'),
      imageAlt: formData.get('imageAlt') || '',
      seoTitle: formData.get('seoTitle') || '',
      seoDescription: formData.get('seoDescription') || '',
      tags: formData.getAll('tags'),
    }

    // 2. Validate the data server-side
    const validatedData = blogSubmissionSchema.parse(data)

    // 3. Handle Image Upload if present
    let mainImageAssetId = undefined;
    const mainImageFile = formData.get('mainImage') as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      const buffer = Buffer.from(await mainImageFile.arrayBuffer());
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: mainImageFile.name,
      });
      mainImageAssetId = asset._id;
    }

    // 4. Resolve Author (Real author in backend, masked on frontend)
    const authorEmail = session.user?.email!
    const authorName = session.user?.name || 'Contributor'
    
    let author = await writeClient.fetch(`*[_type == "author" && email == $email][0]`, { email: authorEmail })
    
    // If the author document doesn't exist for this user, create it
    if (!author) {
      author = await writeClient.create({
        _type: 'author',
        name: authorName,
        email: authorEmail,
        slug: { _type: 'slug', current: slugify(authorName) },
        bio: [{ _type: 'block', children: [{ _type: 'span', text: 'Contributor to Nation Bulletin' }] }]
      })
    }

    // 5. Resolve Category
    let categoryRef = undefined;
    if (validatedData.category) {
      const categoryDoc = await writeClient.fetch(`*[_type == "category" && title == $title][0]`, { title: validatedData.category });
      if (categoryDoc) {
        categoryRef = { _key: `cat-${crypto.randomUUID()}`, _type: 'reference', _ref: categoryDoc._id };
      } else {
        const newCat = await writeClient.create({ _type: 'category', title: validatedData.category, slug: { _type: 'slug', current: slugify(validatedData.category) } });
        categoryRef = { _key: `cat-${crypto.randomUUID()}`, _type: 'reference', _ref: newCat._id };
      }
    }

    // 6. Resolve Tags
    const tagRefs = [];
    if (validatedData.tags && validatedData.tags.length > 0) {
      for (const tagTitle of validatedData.tags) {
        let tagDoc = await writeClient.fetch(`*[_type == "tag" && title == $title][0]`, { title: tagTitle });
        if (!tagDoc) {
          tagDoc = await writeClient.create({ _type: 'tag', title: tagTitle, slug: { _type: 'slug', current: slugify(tagTitle) } });
        }
        tagRefs.push({ _key: `tag-${crypto.randomUUID()}`, _type: 'reference', _ref: tagDoc._id });
      }
    }

    // 7. Parse HTML content to basic Portable Text blocks
    const bodyBlocks = htmlToPortableText(validatedData.content);

    // 8. Create the post in Sanity as a draft
    const newPost = {
      _type: 'post',
      title: validatedData.title,
      slug: {
        _type: 'slug',
        current: slugify(validatedData.title),
      },
      publishedAt: new Date().toISOString(),
      body: bodyBlocks,
      author: author ? { _type: 'reference', _ref: author._id } : undefined,
      authorInfo: author ? { _type: 'reference', _ref: author._id } : undefined,
      categories: categoryRef ? [categoryRef] : undefined,
      tags: tagRefs.length > 0 ? tagRefs : undefined,
      mainImage: mainImageAssetId ? {
        _type: 'image',
        alt: validatedData.imageAlt || validatedData.title,
        asset: {
          _type: 'reference',
          _ref: mainImageAssetId
        }
      } : undefined,
      seoTitle: validatedData.seoTitle,
      seoDescription: validatedData.seoDescription,
    }

    // Use drafts. prefix to ensure it doesn't appear on the site until published
    const result = await writeClient.create({
      ...newPost,
      _id: `drafts.${crypto.randomUUID()}`,
    })

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/category/[slug]', 'page')
    return { success: true, message: 'Your blog post has been submitted for review!' }
  } catch (error) {
    console.error('Submission error:', error)
    return { success: false, message: 'Something went wrong. Please try again later.' }
  }
}
