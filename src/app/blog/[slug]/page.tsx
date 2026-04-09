import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Calendar, User, Eye, Clock, Send, Globe, Share2, Bookmark, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity.client'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    publishedAt,
    mainImage,
    body,
    author->{
      name,
      image,
      bio
    },
    categories[]->{
      title,
      "slug": slug.current
    },
    tags[]->{
      title,
      "slug": slug.current
    }
  }`;
  const post = await client.fetch(query, { slug });
  return post;
}

export default async function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

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
             <span className="text-primary">{post.categories?.[0]?.title || 'General'}</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-12">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-border mt-12">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted border border-border flex items-center justify-center rounded-lg overflow-hidden relative">
                   {post.author?.image ? (
                     <Image src={urlFor(post.author.image).url()} alt={post.author.name} fill className="object-cover" />
                   ) : (
                     <User className="w-6 h-6 text-zinc-300" />
                   )}
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Written By</p>
                   <p className="text-xs font-black uppercase tracking-tighter text-foreground">{post.author?.name || 'Anonymous'}</p>
                </div>
             </div>
             
             <div className="hidden md:block h-10 w-px bg-border"></div>

             <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {date}</span>
                <span className="flex items-center gap-2 font-bold text-foreground italic"><Clock className="w-4 h-4 text-primary" /> 12 MIN READ</span>
                <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> {post.views || '1.2k'} VIEWS</span>
             </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Main Content Area */}
          <div className="lg:w-2/3">
             {/* Main Image */}
             {post.mainImage && (
               <div className="aspect-[21/9] bg-zinc-800 mb-16 relative overflow-hidden group">
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 text-white text-[10px] font-black uppercase tracking-widest z-20">
                    Lead Editorial Dispatch
                  </div>
               </div>
             )}

             {/* Prose Content */}
             <div className="max-w-2xl mx-auto">
                <div className="prose prose-xl prose-zinc dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:font-sans prose-p:text-zinc-600 prose-p:leading-relaxed">
                   <PortableText value={post.body} />
                </div>

                {/* Article Tags */}
                <div className="mt-20 pt-12 border-t border-border flex flex-wrap gap-3">
                   {post.tags?.map((tag: any) => (
                      <Link href={`/tag/${tag.slug}`} key={tag.slug} className="px-4 py-2 bg-muted text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary hover:text-white transition-all cursor-pointer">
                         #{tag.title}
                      </Link>
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
                {post.author && (
                  <div className="mt-20 pt-20 border-t border-border flex gap-10">
                    <div className="w-24 h-24 bg-muted border border-border flex-shrink-0 relative overflow-hidden">
                       {post.author.image && (
                         <Image src={urlFor(post.author.image).url()} alt={post.author.name} fill className="object-cover" />
                       )}
                    </div>
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-widest mb-4">About {post.author.name}</h4>
                        <div className="text-sm font-medium text-zinc-500 leading-relaxed mb-6">
                           <PortableText value={post.author.bio} />
                        </div>
                        <Link href="/profile" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 group">
                           View Author <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-1/3">
             <div className="sticky top-32">
                {/* @ts-expect-error Server Component */}
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </article>
  )
}
