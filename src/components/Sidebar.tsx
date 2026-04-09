import React from 'react'
import Link from 'next/link'
import { Globe, Send, Share2 } from 'lucide-react'
import { client } from '@/lib/sanity.client'
import { SidebarSearch } from './SidebarSearch'

async function getSidebarData() {
  const categoriesQuery = `*[_type == "category"] {
    title,
    "slug": slug.current,
    "count": count(*[_type == "post" && references(^._id)])
  }`;
  
  const tagsQuery = `*[_type == "tag"][0...15] {
    title,
    "slug": slug.current
  }`;

  const popularPostsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    categories[0]->{ title, "slug": slug.current }
  }`;

  const [categories, tags, popularPosts] = await Promise.all([
    client.fetch(categoriesQuery),
    client.fetch(tagsQuery),
    client.fetch(popularPostsQuery)
  ]);

  return { categories, tags, popularPosts };
}

export const Sidebar = async () => {
  const { categories, tags, popularPosts } = await getSidebarData();

  return (
    <aside className="space-y-12">
      {/* Search Widget */}
      <SidebarSearch />

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
              <span className="text-[10px] font-black uppercase tracking-widest">Insight</span>
           </button>
        </div>
      </section>

      {/* Popular Posts */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-border pb-4">Popular Posts</h3>
        <div className="space-y-6">
          {popularPosts.map((post: any, i: number) => (
            <div key={post._id} className="group flex gap-4 items-start">
               <div className="text-4xl font-black italic tracking-tighter text-zinc-100 group-hover:text-primary/10 transition-colors leading-none">
                  {i + 1}
               </div>
               <div>
                  <Link href={`/category/${post.categories?.[0]?.slug || 'general'}`} className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">
                    {post.categories?.[0]?.title}
                  </Link>
                  <Link href={`/blog/${post.slug}`} className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
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

      {/* Scrollable Categories */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-border pb-4">Categories</h3>
        <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar border border-border">
           <div className="flex flex-col gap-px bg-border">
              {categories.map((cat: any) => (
                <Link 
                  key={cat.slug} 
                  href={`/category/${cat.slug}`}
                  className="flex items-center justify-between p-4 bg-white hover:bg-zinc-50 group transition-colors"
                >
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-primary transition-colors">{cat.title}</span>
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
           {tags.map((tag: any) => (
             <Link 
               key={tag.slug} 
               href={`/tag/${tag.slug}`}
               className="px-3 py-1.5 bg-muted text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary hover:text-white transition-all border border-transparent hover:border-primary/20"
             >
               #{tag.title}
             </Link>
           ))}
        </div>
      </section>
    </aside>
  )
}
