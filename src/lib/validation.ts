import { z } from 'zod'

export const blogSubmissionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  authorName: z.string().min(2, 'Name is required'),
  authorEmail: z.string().email('Invalid email address'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  mainImage: z.any().optional(),
})

export type BlogSubmission = z.infer<typeof blogSubmissionSchema>
