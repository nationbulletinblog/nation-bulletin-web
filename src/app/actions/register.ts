'use server'
import { writeClient } from '@/lib/sanity.client'
import bcrypt from 'bcryptjs'

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { success: false, message: 'Missing fields' }
  }

  try {
    // 1. Check if user already exists
    const existingUser = await writeClient.fetch(
      `*[_type == "author" && email == $email][0]`,
      { email }
    )

    if (existingUser) {
      return { success: false, message: 'User already exists' }
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // 3. Create author in Sanity
    await writeClient.create({
      _type: 'author',
      name,
      email,
      passwordHash,
      slug: {
        _type: 'slug',
        current: name.toLowerCase().replace(/\s+/g, '-'),
      },
    })

    return { success: true, message: 'Account created successfully! You can now login.' }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, message: 'Error creating account' }
  }
}
