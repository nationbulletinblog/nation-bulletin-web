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
  
  const popularPostsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    categories[0]->{ title, "slug": slug.current }
  }`;

  const [categories, popularPosts] = await Promise.all([
    client.fetch(categoriesQuery),
    client.fetch(popularPostsQuery)
  ]);

  return { categories, popularPosts };
}

export const Sidebar = async () => {
  const { categories, popularPosts } = await getSidebarData();

  return (
    <aside className="space-y-12">
      {/* Categories - Now First */}
      <section>
        <h3 className="text-xs font-black capitalize tracking-[0.2em] mb-8 border-b border-border pb-4">Categories</h3>
        <div className="border border-border">
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

      {/* Latest Posts - Renamed and Reordered */}
      <section>
        <h3 className="text-xs font-black capitalize tracking-[0.2em] mb-8 border-b border-border pb-4">Latest Posts</h3>
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
    </aside>

  )
}
