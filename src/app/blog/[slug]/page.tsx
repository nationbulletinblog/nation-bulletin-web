import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Clock, MessageSquare, Bookmark, Send, Globe, Share2, User, ArrowRight, Eye, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export default async function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Placeholder data
  const post = {
    title: "The Impact of Spatial Computing on Modern Journalism",
    category: "Technology",
    author: "Eleanor Vance",
    date: "Nov 18, 2023",
    readingTime: "12 min read",
    views: "14.2k",
    content: `
      <p className="lead font-bold text-2xl text-zinc-800 mb-12 border-l-4 border-primary pl-8 leading-normal">
        The boundaries between the physical and the digital are dissolving at an unprecedented rate. For journalists, this shift represents both the greatest challenge and the most significant opportunity since the advent of the printing press.
      </p>
      <p className="mb-8">
        Artificial intelligence and spatial computing are no longer futuristic concepts reserved for high-budget research laboratories. They are actively reshaping how we perceive information, how we verify truth, and how we deliver narratives to a distracted global audience. In this investigative report, we dive deep into the protocols that will define the next decade of editorial integrity.
      </p>
      <h2 className="text-3xl font-black uppercase tracking-tighter mt-16 mb-8">The Verification Crisis</h2>
      <p className="mb-8">
        As generative models become increasingly capable of creating indistinguishable deepfakes, the role of the journalist shifts from "content creator" to "authenticity guarantor." We explore the blockchain-based watermarking technologies currently being trialed by major newsrooms across the European Union.
      </p>
      <blockquote className="my-16 py-8 border-y-2 border-primary">
        <p className="text-2xl font-black uppercase tracking-tighter text-foreground text-center">
          "Truth is not just about the facts; it is about the provenance of the narrative in an age of infinite digital duplication."
        </p>
        <cite className="text-[10px] font-black uppercase tracking-widest text-primary mt-6 block text-center">— Dr. Helena Varkas, Media Ethicist</cite>
      </blockquote>
      <p>
        The integration of these systems into the daily workflow of investigative units ensures that every dispatch published under the Nation Bulletin masthead meets the highest standards of verifiable precision.
      </p>
    `
  }

  return (
    <article className="bg-background min-h-screen pb-24">
      {/* Article Header */}
      <header className="pt-20 pb-16 border-b border-border mb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-8">
             <Link href="/" className="hover:text-primary transition-colors">Home</Link>
             <span className="w-4 h-px bg-zinc-200"></span>
             <Link href="/blog" className="hover:text-primary transition-colors">Archive</Link>
             <span className="w-4 h-px bg-zinc-200"></span>
             <span className="text-primary">{post.category}</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-12">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-border mt-12">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted border border-border flex items-center justify-center rounded-lg">
                   <User className="w-6 h-6 text-zinc-300" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Written By</p>
                   <p className="text-xs font-black uppercase tracking-tighter text-foreground">{post.author}</p>
                </div>
             </div>
             
             <div className="hidden md:block h-10 w-px bg-border"></div>

             <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {post.date}</span>
                <span className="flex items-center gap-2 font-bold text-foreground italic"><Clock className="w-4 h-4 text-primary" /> 12 MIN READ</span>
                <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> {post.views} VIEWS</span>
             </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Main Content Area */}
          <div className="lg:w-2/3">
             {/* Main Image */}
             <div className="aspect-[21/9] bg-zinc-800 mb-16 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-zinc-700 animate-pulse group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute bottom-6 left-6 text-white text-[10px] font-black uppercase tracking-widest z-20">
                   Image: Digital Stratosphere / International Edition
                </div>
             </div>

             {/* Prose Content */}
             <div className="max-w-2xl mx-auto">
                <div className="prose prose-xl prose-zinc dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:font-sans prose-p:text-zinc-600 prose-p:leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Article Tags */}
                <div className="mt-20 pt-12 border-t border-border flex flex-wrap gap-3">
                   {['Modernism', 'Journalism', 'AI Ethics', 'Future'].map((tag) => (
                      <span key={tag} className="px-4 py-2 bg-muted text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary hover:text-white transition-all cursor-pointer">
                         #{tag}
                      </span>
                   ))}
                </div>

                {/* Article Footer Interface */}
                <div className="mt-20 p-10 bg-muted border border-border flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Share Briefing</span>
                      <div className="flex items-center gap-3">
                         <button className="p-3 bg-white border border-border hover:text-primary transition-colors"><Send className="w-4 h-4" /></button>
                         <button className="p-3 bg-white border border-border hover:text-primary transition-colors"><Globe className="w-4 h-4" /></button>
                         <button className="p-3 bg-white border border-border hover:text-primary transition-colors"><Share2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                   <button className="flex items-center gap-3 px-8 py-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
                      <Bookmark className="w-4 h-4" /> Save Article
                   </button>
                </div>

                {/* Author Card Footer */}
                <div className="mt-20 pt-20 border-t border-border flex gap-10">
                   <div className="w-24 h-24 bg-muted border border-border flex-shrink-0" />
                   <div>
                      <h4 className="text-xl font-black uppercase tracking-widest mb-4">About Eleanor Vance</h4>
                      <p className="text-sm font-medium text-zinc-500 leading-relaxed mb-6">
                         Eleanor Vance is a senior investigative reporter focusing on the intersection of emerging technology and global legislative frameworks.
                      </p>
                      <Link href="/profile" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 group">
                         View Author <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-1/3">
             <div className="sticky top-32">
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </article>
  )
}
