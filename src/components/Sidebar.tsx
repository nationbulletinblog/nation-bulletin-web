'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUp, Globe, Send, Share2, Search, ArrowRight, Bookmark, ChevronDown, ChevronUp } from 'lucide-react'

export const Sidebar = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { name: 'Technology', count: 42 },
    { name: 'Lifestyle', count: 18 },
    { name: 'Business', count: 24 },
    { name: 'Politics', count: 31 },
    { name: 'Culture', count: 12 },
    { name: 'Strategy', count: 22 },
    { name: 'Marketing', count: 15 },
    { name: 'Economy', count: 28 },
    { name: 'Science', count: 10 },
    { name: 'Education', count: 14 },
    { name: 'Health', count: 20 },
    { name: 'Sports', count: 8 },
    { name: 'Entertainment', count: 19 },
    { name: 'Fashion', count: 11 },
  ]

  const popularPosts = [
    { id: 1, title: 'The Impact of Quantum Computing on Financial Security', category: 'Tech' },
    { id: 2, title: 'Reimagining Urban Spaces: The Rise of Vertical Forests', category: 'Culture' },
    { id: 3, title: 'The Silent Revolution of Renewable Energy Investment', category: 'Business' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <aside className="space-y-12">
      {/* Search Widget */}
      <section className="bg-muted p-8">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 border-b border-zinc-200 pb-4">Search Articles</h3>
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type and hit enter..." 
            className="w-full bg-white border border-border py-4 px-4 text-xs font-medium focus:border-primary outline-none transition-all placeholder:text-zinc-300"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-zinc-300 hover:text-primary transition-colors" />
          </button>
        </form>
      </section>

      {/* Stay Connected */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b-2 border-primary pb-4">Follow Us</h3>
        <div className="grid grid-cols-2 gap-2">
           <button className="flex items-center justify-center gap-3 py-4 bg-[#1877F2] text-white hover:opacity-90 transition-opacity font-bold">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Global</span>
           </button>
           <button className="flex items-center justify-center gap-3 py-4 bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity font-bold">
              <Send className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Connect</span>
           </button>
           <button className="flex items-center justify-center gap-3 py-4 bg-[#6366f1] text-white hover:opacity-90 transition-opacity font-bold">
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Viral</span>
           </button>
           <button className="flex items-center justify-center gap-3 py-4 bg-[#BD081C] text-white hover:opacity-90 transition-opacity font-bold">
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Viral</span>
           </button>
        </div>
      </section>

      {/* Popular Posts */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-border pb-4">Popular Posts</h3>
        <div className="space-y-6">
          {popularPosts.map((post, i) => (
            <div key={post.id} className="group flex gap-4 items-start">
               <div className="text-4xl font-black italic tracking-tighter text-zinc-100 group-hover:text-primary/10 transition-colors leading-none">
                  {i + 1}
               </div>
               <div>
                  <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">{post.category}</Link>
                  <Link href={`/blog/${post.id}`} className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modern Newsletter */}
      <section className="bg-secondary p-8 text-white shadow-2xl">
        <h4 className="text-xl font-black italic tracking-tight uppercase mb-4 leading-none">
          The <span className="text-primary italic">Latest</span> Blog
        </h4>
        <p className="text-zinc-500 text-[10px] font-medium mb-6 leading-relaxed">Join 42,000+ readers for our weekly blog updates.</p>
        <div className="flex flex-col gap-2">
           <input 
             type="email" 
             placeholder="YOUR@EMAIL.COM" 
             className="w-full bg-zinc-800 border-none py-4 px-4 text-white text-[10px] font-black tracking-widest outline-none"
           />
           <button className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-secondary transition-all">
              Join Force
           </button>
        </div>
      </section>

      {/* Scrollable Categories with Visible Scrollbar */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-border pb-4">Categories</h3>
        <div className="max-h-[350px] overflow-y-scroll pr-2 custom-scrollbar border border-border">
           <div className="flex flex-col gap-px bg-border">
              {categories.map((cat) => (
                <Link 
                  key={cat.name} 
                  href={`/category/${cat.name.toLowerCase()}`}
                  className="flex items-center justify-between p-4 bg-white hover:bg-zinc-50 group transition-colors"
                >
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-primary transition-colors">{cat.name}</span>
                  <span className="px-2 py-1 bg-muted text-[10px] font-black text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all">{cat.count}</span>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Popular Tags */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-border pb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
           {['#Strategy', '#Technology', '#Finance', '#Marketing', '#Startups', '#Web3', '#Ethics', '#Sustainability'].map((tag) => (
             <Link 
               key={tag} 
               href={`/tag/${tag.replace('#', '').toLowerCase()}`}
               className="px-3 py-1.5 bg-muted text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary hover:text-white transition-all border border-transparent hover:border-primary/20"
             >
               {tag}
             </Link>
           ))}
        </div>
      </section>
    </aside>
  )
}
