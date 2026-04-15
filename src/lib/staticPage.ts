import { client } from '@/lib/sanity.client';

export type StaticPageDoc = {
  title: string | null;
  body: unknown[] | null;
} | null;

export async function getStaticPageBySlug(slug: string): Promise<StaticPageDoc> {
  return client.fetch(
    `*[_type == "staticPage" && slug.current == $slug][0]{ title, body }`,
    { slug }
  );
}
