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

export async function fetchCategories() {
  const query = `*[_type == "category"] { "value": title, "label": title }`;
  const categories = await client.fetch(query);
  return categories;
}

export async function fetchTags() {
  const query = `*[_type == "tag"] { "value": title, "label": title }`;
  const tags = await client.fetch(query);
  return tags;
}

export async function fetchAuthorByEmail(email: string) {
  const query = `*[_type == "author" && email == $email][0] {
    _id,
    name,
    email,
    bio,
    image
  }`;
  const author = await client.fetch(query, { email });
  return author;
}
export async function fetchSiteSettings() {
  const query = `*[_type == "siteSettings"][0] {
    title,
    description,
    seoTitle,
    seoDescription,
    footerAbout,
    paidContentTitle,
    paidContentDescription,
    contactEmail
  }`;
  const settings = await client.fetch(query);
  return settings;
}
export async function fetchUserPosts(email: string) {
  const query = `*[_type == "post" && (author->email == $email || authorInfo.email == $email)] | order(_createdAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    mainImage,
    categories[]->{
      title
    },
    "status": select(
      _id in path("drafts.**") => "Draft",
      "Published"
    )
  }`;
  const posts = await client.fetch(query, { email });
  return posts;
}
