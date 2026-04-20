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
           
           <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700 mx-auto max-w-4xl">
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

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
           {/* Form Section */}
           <div className="lg:w-2/3 space-y-12">
              {cms?.body?.length ? (
                <div className="prose prose-lg prose-zinc max-w-none dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter mb-16">
                  <PortableBody value={cms.body} />
                </div>
              ) : null}
              
              {session ? (
                <SubmissionForm session={session} />
              ) : (
                <div className="bg-white rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-zinc-100 p-8 md:p-16 text-center space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                   <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-50 rounded-2xl mb-4 shadow-inner">
                      <Lock className="w-10 h-10 text-primary" />
                   </div>
                   <h2 className="text-3xl font-black tracking-tight text-zinc-900">Join our Editorial Community</h2>
                   <p className="text-sm font-medium text-zinc-500 max-w-md mx-auto leading-relaxed">
                      To maintain our high editorial standards, you must be a registered contributor to submit articles. Sign in or create an account to get started.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                      <Link href="/login" className="flex items-center justify-center gap-2 px-10 py-4 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary transition-all shadow-xl hover:shadow-primary/20">
                         <LogIn className="w-4 h-4" /> Login
                      </Link>
                      <Link href="/register" className="flex items-center justify-center gap-2 px-10 py-4 bg-white border border-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl hover:border-primary hover:text-primary transition-all">
                         <UserPlus className="w-4 h-4" /> Create Account
                      </Link>
                   </div>
                </div>
              )}
           </div>

           {/* Guidelines Sidebar */}
           <div className="lg:w-1/3 space-y-8">
              <section className="bg-zinc-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                 <h2 className="text-xl font-black uppercase tracking-tight mb-8 border-b border-zinc-800 pb-4 flex items-center gap-3">
                   <Globe className="w-5 h-5 text-primary" /> Submission Stats
                 </h2>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Monthly Reach</span>
                       <span className="text-xl font-black text-white">120K+</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Active Authors</span>
                       <span className="text-xl font-black text-white">85</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Review Speed</span>
                       <span className="text-xl font-black text-primary">&lt; 24H</span>
                    </div>
                 </div>
              </section>

              <section className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
                 <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 mb-6 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary fill-primary" /> Writing Guidelines
                 </h3>
                 <ul className="space-y-5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 leading-relaxed">
                    <li className="flex gap-4">
                       <span className="w-5 h-5 bg-white border border-zinc-200 rounded-md flex items-center justify-center text-[8px] text-primary shrink-0">01</span>
                       <span>Original investigative content only</span>
                    </li>
                    <li className="flex gap-4">
                       <span className="w-5 h-5 bg-white border border-zinc-200 rounded-md flex items-center justify-center text-[8px] text-primary shrink-0">02</span>
                       <span>Length: 800 - 1500 words</span>
                    </li>
                    <li className="flex gap-4">
                       <span className="w-5 h-5 bg-white border border-zinc-200 rounded-md flex items-center justify-center text-[8px] text-primary shrink-0">03</span>
                       <span>Include high-res featured image</span>
                    </li>
                    <li className="flex gap-4">
                       <span className="w-5 h-5 bg-white border border-zinc-200 rounded-md flex items-center justify-center text-[8px] text-primary shrink-0">04</span>
                       <span>Professional tone and formatting</span>
                    </li>
                 </ul>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
}
