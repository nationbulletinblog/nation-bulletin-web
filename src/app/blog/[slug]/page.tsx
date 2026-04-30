import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Calendar, User, Eye, Clock, Send, Globe, Share2, Bookmark, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity.client'
import { PortableText } from '@portabletext/react'
import { PortableBody } from '@/components/PortableBody'
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
    <article className="bg-background min-h-screen pb-12">
      {/* Article Header */}
      <header className="pt-8 pb-4 border-b border-border mb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4">
             <Link href="/" className="hover:text-primary transition-colors">Home</Link>
             <span className="w-4 h-px bg-zinc-200"></span>
             <Link href="/blog" className="hover:text-primary transition-colors">Archive</Link>
             <span className="w-4 h-px bg-zinc-200"></span>
             <span className="text-primary">{post.categories?.[0]?.title || 'General'}</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-[1.1] mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-10 pt-4 border-t border-border mt-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center rounded-lg overflow-hidden relative">
                   {post.author?.image ? (
                     <Image src={urlFor(post.author.image).url()} alt={post.author.name} fill className="object-cover" />
                   ) : (
                     <User className="w-6 h-6 text-zinc-300" />
                   )}
                </div>
                <div>
                   <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Written By</p>
                   <p className="text-[10px] font-black uppercase tracking-tighter text-foreground">Admin</p>
                </div>
             </div>
             
             <div className="hidden md:block h-8 w-px bg-border"></div>

             <div className="flex items-center gap-8 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {date}</span>
                <span className="flex items-center gap-2 font-bold text-foreground italic"><Clock className="w-4 h-4 text-primary" /> 12 MIN READ</span>
                <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> {post.views || '1.2k'} VIEWS</span>
             </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content Area */}
          <div className="lg:w-3/4">
             {/* Main Image */}
             {post.mainImage && (
               <div className="aspect-[21/9] bg-zinc-800 mb-8 relative overflow-hidden group">
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 text-white text-[10px] font-black uppercase tracking-widest z-20">
                    Lead Editorial Dispatch
                  </div>
               </div>
             )}

             {/* Prose Content */}
             <div className="max-w-3xl mx-auto">
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                   <PortableBody value={post.body} />
                </div>

                {/* Article Tags */}
                <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-2">
                   {post.tags?.map((tag: any) => (
                      <span key={tag.slug} className="px-3 py-1.5 bg-muted text-[9px] font-black uppercase tracking-widest text-zinc-500 transition-all cursor-default">
                         #{tag.title}
                      </span>
                   ))}
                </div>
             </div>

          </div>

          {/* Sidebar Area */}
          <div className="lg:w-1/4">
             <div className="sticky top-24">
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </article>
  )
}
