'use server'
import { writeClient } from '@/lib/sanity.client'
import { blogSubmissionSchema, BlogSubmission } from '@/lib/validation'
import { revalidatePath } from 'next/cache'

export async function submitBlogPost(data: BlogSubmission) {
  try {
    // 1. Validate the data server-side
    const validatedData = blogSubmissionSchema.parse(data)

    // 2. Create the post in Sanity as a draft
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
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: validatedData.content,
            },
          ],
        },
      ],
      // We can also store the contributor's info in metadata or custom fields
      authorInfo: {
        name: validatedData.authorName,
        email: validatedData.authorEmail,
      },
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
