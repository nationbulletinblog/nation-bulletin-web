import React from 'react';
import { PortableBody } from '@/components/PortableBody';
import { getStaticPageBySlug } from '@/lib/staticPage';

export default async function ContentPolicyPage() {
  const page = await getStaticPageBySlug('content-policy');

  return (
    <div className="bg-background min-h-screen pt-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center space-x-4">
            <div className="h-px flex-grow bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Editorial</span>
            <div className="h-px flex-grow bg-primary"></div>
          </div>

          <h1 className="mb-12 text-center text-5xl font-black uppercase tracking-tighter md:text-7xl">
            {page?.title ?? 'Content Policy'}
          </h1>

          <div className="prose prose-xl prose-zinc max-w-none dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
            {page?.body?.length ? (
              <PortableBody value={page.body} />
            ) : (
              <p className="text-sm font-medium text-zinc-600">Content is being updated. Please check back soon.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
