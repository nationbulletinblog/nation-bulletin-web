import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity.client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Fetch all dynamic routes from Sanity
  const query = `*[_type in ["post", "category", "staticPage"]]{
    "slug": slug.current,
    _type,
    _updatedAt
  }`;
  
  const data = await client.fetch(query);

  const routes = data.map((item: any) => {
    let path = '';
    if (item._type === 'post') path = `/blog/${item.slug}`;
    else if (item._type === 'category') path = `/category/${item.slug}`;
    else path = `/${item.slug}`;

    return {
      url: `${baseUrl}${path}`,
      lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
      changeFrequency: item._type === 'post' ? 'daily' : 'weekly',
      priority: item._type === 'post' ? 0.8 : 0.5,
    };
  });

  // Static routes
  const staticRoutes = [
    '',
    '/login',
    '/register',
    '/write-for-us',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  return [...staticRoutes, ...routes];
}
