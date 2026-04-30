import React from "react";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { client } from "@/lib/sanity.client";

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author->{
      name,
      image
    },
    categories[]->{
      title
    }
  }`;
  return await client.fetch(query);
}

export default async function BlogArchive() {
  const posts = await getPosts();

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="border-b-2 border-primary pb-8 mb-12">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
              All <span className="text-primary italic">Articles</span>
            </h1>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               Browsing through <span className="text-foreground font-black underline decoration-primary decoration-2 underline-offset-4">{posts.length}</span> insightful articles
            </p>
        </div>

        {/* Search & Utility Bar */}
        <div className="flex flex-col lg:flex-row gap-8 mb-20 items-center justify-between">
           <div className="w-full lg:max-w-2xl relative">
              <input 
                type="text" 
                placeholder="SEARCH ALL ARTICLES..."
                className="w-full bg-muted border border-border py-6 px-12 text-xs font-black tracking-widest focus:border-primary outline-none uppercase"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
           </div>
           
           <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <span className="text-primary border-b border-primary cursor-pointer pb-1">All Topics</span>
              <span className="hover:text-primary cursor-pointer transition-colors pb-1">Verified</span>
              <span className="hover:text-primary cursor-pointer transition-colors pb-1">Top Access</span>
              <SlidersHorizontal className="w-4 h-4 text-zinc-300 ml-4 cursor-pointer hover:text-primary transition-colors" />
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Grid Feed */}
          <div className="lg:w-3/4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                   <PostCard key={post._id} post={post} />
                ))}
             </div>

             {posts.length === 0 && (
               <div className="py-24 text-center">
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No intelligence dispatches found in this sector.</p>
               </div>
             )}

             {/* Modern Pagination */}
             <div className="mt-20 pt-12 border-t border-border flex items-center justify-between">
                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors group">
                   <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Previous Page
                </button>
                <div className="flex items-center gap-6">
                   {[1, 2, 3, 4].map((num) => (
                      <button key={num} className={`text-xs font-black uppercase transition-all ${num === 1 ? 'text-primary scale-125 underline decoration-2 underline-offset-4' : 'text-zinc-300 hover:text-foreground'}`}>
                        0{num}
                      </button>
                   ))}
                </div>
                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors group">
                   Next Page <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-1/4">
             <div className="sticky top-32">
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
