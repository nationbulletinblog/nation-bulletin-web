import { client } from '@/lib/sanity.client';

export type StaticPageDoc = {
  title: string | null;
  tag: string | null;
  subtitle: string | null;
  body: unknown[] | null;
  seoTitle?: string;
  seoDescription?: string;
} | null;

export async function getStaticPageBySlug(slug: string): Promise<StaticPageDoc> {
  return client.fetch(
    `*[_type == "staticPage" && slug.current == $slug][0]{ title, tag, subtitle, body, seoTitle, seoDescription }`,
    { slug }
  );
}
