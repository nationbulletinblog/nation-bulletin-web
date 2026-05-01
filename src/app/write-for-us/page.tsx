import { SubmissionForm } from "@/components/SubmissionForm";
import React from "react";
import { PenTool, Zap, Lock, LogIn, UserPlus, Globe } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getStaticPageBySlug } from "@/lib/staticPage";
import { PortableBody } from "@/components/PortableBody";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Write for Us – Nation Bulletin',
  description: 'Become a contributor and share your stories with a global audience.',
}

export default async function WriteForUsPage() {
  const session = await getServerSession(authOptions);
  const cms = await getStaticPageBySlug("write-for-us");

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Editorial Header */}
      <header className="pt-20 pb-16 masthead-line mb-16 bg-zinc-50/50">
        <div className="container mx-auto px-4 text-center">
           <div className="flex items-center justify-center gap-3 text-primary mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <PenTool className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                {cms?.tag || "Become a Contributor"}
              </span>
           </div>
           
           <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700 mx-auto max-w-4xl">
             {cms?.title ? (
                <>
                  {cms.title.includes('.') ? cms.title.split('.').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}{i < arr.length - 1 ? <span className="text-primary">.</span> : ''}
                    </React.Fragment>
                  )) : cms.title}
                </>
             ) : (
                <>Shape the <span className="text-primary italic">Global</span> Narrative<span className="text-primary">.</span></>
             )}
           </h1>
           
           <p className="max-w-2xl mx-auto text-base md:text-xl font-medium text-zinc-500 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000">
             {cms?.subtitle || "We are looking for bold perspectives, investigative insights, and stories that move the needle. Join our global network of professional authors."}
           </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pb-24 text-center">
        {cms?.body?.length ? (
          <div className="prose prose-lg prose-zinc max-w-none dark:prose-invert prose-headings:font-black prose-headings:tracking-tighter mb-16 text-left">
            <PortableBody value={cms.body} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
