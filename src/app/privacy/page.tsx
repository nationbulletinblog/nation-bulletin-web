import React from 'react';
import { PortableBody } from '@/components/PortableBody';
import { getStaticPageBySlug } from '@/lib/staticPage';

export default async function PrivacyPage() {
  const page = await getStaticPageBySlug('privacy');

  return (
    <div className="bg-background min-h-screen pt-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center space-x-4">
            <div className="h-px flex-grow bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Data Privacy</span>
            <div className="h-px flex-grow bg-primary"></div>
          </div>

          <h1 className="mb-12 text-center text-5xl font-black tracking-tighter md:text-7xl">
            {page?.title ?? 'Privacy Policy'}
          </h1>

          <div className="prose prose-xl prose-zinc max-w-none dark:prose-invert prose-headings:font-black prose-headings:tracking-tighter">
            {page?.body?.length ? (
              <PortableBody value={page.body} />
            ) : (
              <>
                <p className="lead mb-12 text-xl font-bold text-zinc-500">
                  Your privacy matters. This policy explains how we handle your information on Nation Bulletin.
                </p>
                <section className="mb-12">
                  <h2 className="mb-6 text-3xl font-black capitalize tracking-tight">1. Information We Collect</h2>
                  <p className="text-sm font-medium leading-relaxed text-zinc-600">
                    We collect information you provide when you create an account, post an article, or contact us.
                    This includes your name and email address.
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
