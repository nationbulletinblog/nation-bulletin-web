'use server'
import { writeClient } from '@/lib/sanity.client'
import { blogSubmissionSchema, BlogSubmission } from '@/lib/validation'
import { revalidatePath } from 'next/cache'

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

    // 4. Resolve Author (Always publish as 'Admin')
    let author = await writeClient.fetch(`*[_type == "author" && name == "Admin"][0]`)
    
    // If the Admin author doesn't exist yet, we can create it to prevent errors
    if (!author) {
      author = await writeClient.create({
        _type: 'author',
        name: 'Admin',
        slug: { _type: 'slug', current: 'admin' },
        bio: [{ _type: 'block', children: [{ _type: 'span', text: 'Platform Administrator' }] }]
      })
    }

    // 5. Resolve Category
    let categoryRef = undefined;
    if (validatedData.category) {
      const categoryDoc = await writeClient.fetch(`*[_type == "category" && title == $title][0]`, { title: validatedData.category });
      if (categoryDoc) {
        categoryRef = { _key: `cat-${crypto.randomUUID()}`, _type: 'reference', _ref: categoryDoc._id };
      } else {
        const newCat = await writeClient.create({ _type: 'category', title: validatedData.category, slug: { _type: 'slug', current: validatedData.category.toLowerCase().replace(/\s+/g, '-') } });
        categoryRef = { _key: `cat-${crypto.randomUUID()}`, _type: 'reference', _ref: newCat._id };
      }
    }

    // 6. Resolve Tags
    const tagRefs = [];
    if (validatedData.tags && validatedData.tags.length > 0) {
      for (const tagTitle of validatedData.tags) {
        let tagDoc = await writeClient.fetch(`*[_type == "tag" && title == $title][0]`, { title: tagTitle });
        if (!tagDoc) {
          tagDoc = await writeClient.create({ _type: 'tag', title: tagTitle, slug: { _type: 'slug', current: tagTitle.toLowerCase().replace(/\s+/g, '-') } });
        }
        tagRefs.push({ _key: `tag-${crypto.randomUUID()}`, _type: 'reference', _ref: tagDoc._id });
      }
    }

    // 7. Create the post in Sanity as a draft
    const newPost = {
      _type: 'post',
      title: validatedData.title,
      slug: {
        _type: 'slug',
        current: validatedData.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 96),
      },
      body: [
        {
          _key: `block-${crypto.randomUUID()}`,
          _type: 'block',
          children: [
            {
              _key: `span-${crypto.randomUUID()}`,
              _type: 'span',
              text: validatedData.content,
            },
          ],
        },
      ],
      author: author ? { _type: 'reference', _ref: author._id } : undefined,
      authorInfo: {
        name: validatedData.authorName,
        email: validatedData.authorEmail,
      },
      categories: categoryRef ? [categoryRef] : undefined,
      tags: tagRefs.length > 0 ? tagRefs : undefined,
      mainImage: mainImageAssetId ? {
        _type: 'image',
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
    return { success: true, message: 'Your blog post has been submitted for review!' }
  } catch (error) {
    console.error('Submission error:', error)
    return { success: false, message: 'Something went wrong. Please try again later.' }
  }
}
