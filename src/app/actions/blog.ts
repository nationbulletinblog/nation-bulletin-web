'use server'

import { client } from '@/lib/sanity.client'

export async function fetchPosts(offset: number, limit: number, categorySlug?: string, searchQuery?: string) {
  let filter = `*[_type == "post"`
  
  if (categorySlug) {
    filter += ` && references(*[_type == "category" && slug.current == "${categorySlug}"]._id)`
  }
  
  if (searchQuery) {
    filter += ` && (title match "*${searchQuery}*" || excerpt match "*${searchQuery}*" || categories[]->title match "*${searchQuery}*")`
  }
  
  filter += `]`

  const query = `${filter} | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author->{
      name,
      image
    },
    categories[]->{
      title
    }
  }`;

  const posts = await client.fetch(query);
  return posts;
}
