'use server'
import { writeClient } from '@/lib/sanity.client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { success: false, message: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const file = formData.get('image') as File | null

  try {
    // 1. Find the author document
    const author = await writeClient.fetch(
      `*[_type == "author" && email == $email][0]`,
      { email: session.user.email }
    )

    if (!author) {
      return { success: false, message: 'Author not found' }
    }

    const updateData: any = {
      name,
    }

    // 2. Handle Bio (Convert string to Portable Text block if needed, or just plain text if schema allows)
    // The schema says bio is an array of blocks.
    if (bio) {
      updateData.bio = [
        {
          _type: 'block',
          _key: Math.random().toString(36).substring(7),
          children: [
            {
              _type: 'span',
              _key: Math.random().toString(36).substring(7),
              text: bio,
              marks: [],
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ]
    }

    // 3. Handle Image Upload
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: file.name,
      })
      updateData.image = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      }
    }

    // 4. Update Sanity
    await writeClient.patch(author._id).set(updateData).commit()

    revalidatePath('/profile')
    return { success: true, message: 'Profile updated successfully!' }
  } catch (error) {
    console.error('Profile update error:', error)
    return { success: false, message: 'Error updating profile' }
  }
}
