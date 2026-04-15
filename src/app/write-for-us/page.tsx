import { SubmissionForm } from "@/components/SubmissionForm";
import React from "react";
import { PenTool, Zap, Lock } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getStaticPageBySlug } from "@/lib/staticPage";
import { PortableBody } from "@/components/PortableBody";

export default async function WriteForUsPage() {
  const session = await getServerSession(authOptions);
  const cms = await getStaticPageBySlug("write-for-us");

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Editorial Header */}
      <header className="pt-20 pb-16 masthead-line mb-16">
        <div className="container mx-auto px-4">
           <div className="flex items-center gap-3 text-primary mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <PenTool className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Become a Contributor</span>
           </div>
           
           <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             Shape the <span className="text-primary">Global</span> Narrative<span className="text-primary">.</span>
           </h1>
           
           <p className="max-w-2xl text-lg font-medium text-zinc-500 uppercase tracking-tight leading-snug animate-in fade-in slide-in-from-bottom-6 duration-1000">
             We are looking for bold perspectives, investigative insights, and stories that move the needle. Join our network of international authors.
           </p>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-20">
           {/* Form Section */}
           <div className="lg:w-2/3 space-y-16">
              {cms?.body?.length ? (
                <div className="prose prose-lg prose-zinc max-w-none dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
                  <PortableBody value={cms.body} />
                </div>
              ) : null}
              {session ? (
                <SubmissionForm session={session} />
              ) : (
                <div className="bg-white border-2 border-primary p-20 text-center space-y-8 shadow-[20px_20px_0px_0px_rgba(145,10,10,0.1)]">
                   <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
                      <Lock className="w-10 h-10 text-primary" />
                   </div>
                   <h2 className="text-3xl font-black uppercase tracking-tighter italic">Intelligence Access Required</h2>
                   <p className="text-xs font-black uppercase tracking-widest text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      To maintain our editorial integrity and security protocols, you must identify yourself before submitting a dispatch.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                      <Link href="/login" className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all">
                         Login
                      </Link>
                      <Link href="/register" className="px-10 py-5 border-2 border-primary text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                         Register
                      </Link>
                   </div>
                </div>
              )}
           </div>

           {/* Guidelines Sidebar */}
           <div className="lg:w-1/3 space-y-12">
              <section className="bg-secondary p-10 text-white shadow-2xl">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 border-b border-zinc-700 pb-4">
                   Submission Stats
                 </h2>
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Monthly Reach</span>
                       <span className="text-xl font-black italic text-primary">120K+</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Authors</span>
                       <span className="text-xl font-black italic text-primary">85</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Review Speed</span>
                       <span className="text-xl font-black italic text-primary">&lt; 24H</span>
                    </div>
                 </div>
              </section>

              <section className="p-10 border-2 border-primary bg-muted">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary fill-primary" /> Rapid Guidelines
                 </h3>
                 <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed">
                    <li className="flex gap-3"><span className="text-primary">01</span> Original investigative content only</li>
                    <li className="flex gap-3"><span className="text-primary">02</span> Length: 800 - 1500 words</li>
                    <li className="flex gap-3"><span className="text-primary">03</span> Include high-res featured image</li>
                    <li className="flex gap-3"><span className="text-primary">04</span> Professional tone and formatting</li>
                 </ul>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
}
