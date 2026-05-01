import React from 'react'
import Link from 'next/link'
import { User, Calendar, Eye, ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity.client'
import Image from 'next/image'

interface PostCardProps {
  post: {
    _id: string
    title: string
    slug: { current: string }
    excerpt?: string
    author?: { name: string; image?: any }
    publishedAt: string
    categories?: { title: string }[]
    mainImage?: any
    views?: string | number
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const category = post.categories?.[0]?.title || 'General'
  const authorName = 'Admin'
  const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  // Generate consistent pseudo-random views based on post ID if views aren't provided
  const getRandomViews = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash) % 50000 + 1200;
    return (num / 1000).toFixed(1) + 'k';
  };
  const viewsToDisplay = post.views || getRandomViews(post._id);

  return (
    <article className="group flex flex-col bg-card border border-border hover:border-primary/30 transition-all duration-300">
      {/* Image Container */}
      <Link href={`/blog/${post.slug.current}`} className="block group">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              fill
              className="object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">No Document Image</div>
          )}
          
          {/* Category Overlay */}
          <div className="absolute top-4 left-4 z-20">
             <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-xl">
                {category}
             </span>
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        {/* Metadata Top */}
        <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-6">
           <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-primary" /> {authorName}</span>
           <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" /> {date}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-black capitalize tracking-tighter leading-[1.1] mb-5 group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug.current}`}>{post.title}</Link>
        </h3>

        {/* Excerpt - Fallback to title if no excerpt */}
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-8">
          {post.excerpt || post.title}
        </p>

        {/* Bottom Bar */}
        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-400">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-zinc-300" /> {viewsToDisplay} VIEWS</span>
           </div>
           <Link href={`/blog/${post.slug.current}`} className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:translate-x-1 transition-transform">
             READ MORE <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>
    </article>
  )
}
