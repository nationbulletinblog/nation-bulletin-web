import React from 'react'
import Link from 'next/link'
import { User, Calendar, Folder, Eye, ArrowRight } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string | number
    title: string
    excerpt: string
    author: string
    date: string
    category: string
    readingTime?: string
    image?: string
    views?: string | number
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="group flex flex-col bg-card border border-border hover:border-primary/30 transition-all duration-300">
      {/* Image Container */}
      <Link href={`/blog/${post.id}`} className="block relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
        <div className="w-full h-full bg-zinc-100 transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
        
        {/* Category Overlay */}
        <div className="absolute top-4 left-4 z-20">
           <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-xl">
              {post.category}
           </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        {/* Metadata Top */}
        <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-6">
           <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-primary" /> {post.author}</span>
           <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" /> {post.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-[1.1] mb-5 group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-8">
          {post.excerpt}
        </p>

        {/* Bottom Bar */}
        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-400">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-zinc-300" /> {post.views || '1.2k'} VIEWS</span>
           </div>
           <Link href={`/blog/${post.id}`} className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:translate-x-1 transition-transform">
             READ MORE <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>
    </article>
  )
}
