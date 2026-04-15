import React from 'react';
import { PortableBody } from '@/components/PortableBody';
import { getStaticPageBySlug } from '@/lib/staticPage';

export default async function TermsPage() {
  const page = await getStaticPageBySlug('terms');

  return (
    <div className="bg-background min-h-screen pt-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center space-x-4">
            <div className="h-px flex-grow bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Usage Rules</span>
            <div className="h-px flex-grow bg-primary"></div>
          </div>

          <h1 className="mb-12 text-center text-5xl font-black uppercase tracking-tighter md:text-7xl">
            {page?.title ?? 'Terms of Service'}
          </h1>

          <div className="prose prose-xl prose-zinc max-w-none dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
            {page?.body?.length ? (
              <PortableBody value={page.body} />
            ) : (
              <>
                <p className="lead mb-12 text-xl font-bold text-zinc-500">
                  By using Nation Bulletin, you agree to follow these simple rules.
                </p>
                <section className="mb-12">
                  <h2 className="mb-6 text-3xl font-black uppercase tracking-tight">1. Content Ownership</h2>
                  <p className="text-sm font-medium leading-relaxed text-zinc-600">
                    All articles, images, and tools on this site are the property of Nation Bulletin or its members.
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
