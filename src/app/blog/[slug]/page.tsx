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
    slug,
    excerpt,
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
    },
    seoTitle,
    seoDescription
  }`;
  const post = await client.fetch(query, { slug });
  return post;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug.current}`,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      url: `${baseUrl}/blog/${post.slug.current}`,
      siteName: 'Nation Bulletin',
      images: post.mainImage ? [
        {
          url: urlFor(post.mainImage).url(),
          width: 1200,
          height: 630,
          alt: post.mainImage.alt || post.title,
        }
      ] : [],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'Admin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.mainImage ? [urlFor(post.mainImage).url()] : [],
    },
  };
}

export default async function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
      <header className="pt-8 pb-4 border-b border-border mb-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-4">
             <Link href="/" className="hover:text-primary transition-colors">Home</Link>
             <span className="w-4 h-px bg-zinc-200"></span>
             <span className="text-primary">{post.categories?.[0]?.title || 'General'}</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-[1.1] mb-6">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 pt-4 border-t border-border mt-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center rounded-lg overflow-hidden relative">
                   {post.author?.image ? (
                     <Image src={urlFor(post.author.image).url()} alt={post.author.name} fill sizes="40px" className="object-cover" />
                   ) : (
                     <User className="w-6 h-6 text-zinc-300" />
                   )}
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Written By</p>
                   <p className="text-[12px] font-black normal-case tracking-tight text-foreground">Admin</p>
                </div>
             </div>
             
             <div className="hidden sm:block h-8 w-px bg-border"></div>
 
             <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {date}</span>
                <span className="flex items-center gap-2 font-bold text-foreground italic"><Clock className="w-4 h-4 text-primary" /> 12 MIN READ</span>
                <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> {post.views || '1.2k'} VIEWS</span>
             </div>
          </div>
        </div>
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "image": post.mainImage ? [urlFor(post.mainImage).url()] : [],
              "datePublished": post.publishedAt,
              "dateModified": post._updatedAt || post.publishedAt,
              "author": [{
                "@type": "Person",
                "name": post.author?.name || "Admin",
                "url": baseUrl
              }],
              "description": post.seoDescription || post.excerpt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${baseUrl}/blog/${post.slug.current}`
              }
            })
          }}
        />
      </header>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="lg:w-3/4">
             <div className="w-full">
                {/* Main Image - Now aligned with content */}
                {post.mainImage && (
                  <div className="aspect-video bg-zinc-800 mb-12 relative overflow-hidden group rounded-sm shadow-2xl">
                     <Image
                       src={urlFor(post.mainImage).url()}
                       alt={post.mainImage.alt || post.title}
                       fill
                       priority
                       className="object-cover group-hover:scale-105 transition-transform duration-1000"
                       sizes="(max-width: 1024px) 100vw, 800px"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

                  </div>
                )}

                {/* Prose Content */}
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
