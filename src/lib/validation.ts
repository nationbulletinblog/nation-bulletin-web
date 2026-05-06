import { z } from 'zod'

const PROHIBITED_KEYWORDS = [
  'casino', 'gambling', 'betting', 'poker', 'slot', 'adult', 'porn', 'xxx', 'sex', 'nude',
  'bet', 'wager', 'jackpot', 'roulette'
];

export const blogSubmissionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string()
    .min(100, 'Content is too short')
    .refine((html) => {
      // Strip HTML tags and handle common entities
      const text = html
        .replace(/<[^>]*>/g, ' ') // Replace tags with spaces
        .replace(/&nbsp;/g, ' ')  // Handle non-breaking spaces
        .replace(/&[a-z0-9]+;/gi, ' ') // Handle other entities
        .replace(/\s+/g, ' ')      // Collapse all whitespace
        .trim();
      
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      return wordCount >= 800;
    }, {
      message: 'Article must be at least 800 words to meet our editorial standards'
    })
    .refine((html) => {
      // Check for number of links
      const linkCount = (html.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi) || []).length;
      return linkCount <= 1;
    }, {
      message: 'Only one do-follow link is allowed per article'
    })
    .refine((html) => {
      // Check for prohibited keywords
      const text = html.toLowerCase();
      const hasProhibited = PROHIBITED_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
      return !hasProhibited;
    }, {
      message: 'Adult, gambling, or betting-related content is strictly prohibited'
    }),
  authorName: z.string().min(2, 'Name is required'),
  authorEmail: z.string().email('Invalid email address'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  mainImage: z.any().optional(),
  imageAlt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export type BlogSubmission = z.infer<typeof blogSubmissionSchema>
