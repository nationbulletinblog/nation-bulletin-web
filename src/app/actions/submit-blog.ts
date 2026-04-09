'use server'
import { writeClient } from '@/lib/sanity.client'
import { blogSubmissionSchema, BlogSubmission } from '@/lib/validation'
import { revalidatePath } from 'next/cache'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function submitBlogPost(data: BlogSubmission) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, message: 'Unauthorized. Please login to submit.' }
    }

    // 1. Validate the data server-side
    const validatedData = blogSubmissionSchema.parse(data)

    // 2. Fetch the author ID from Sanity to ensure it's linked properly
    const author = await writeClient.fetch(
      `*[_type == "author" && email == $email][0]`,
      { email: session.user?.email }
    )

    // 3. Create the post in Sanity as a draft
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
      // Link to the actual author document
      author: author ? { _type: 'reference', _ref: author._id } : undefined,
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
