'use client'

import React, { useState } from "react";
import Link from "next/link";
import { User, Calendar, Clock, Eye, ArrowRight, TrendingUp } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  const [visibleCount, setVisibleCount] = useState(12);

  const initialPosts = [
    {
      id: 1,
      title: "The Rapid Evolution of Generative AI in Creative Industries",
      excerpt: "How artists and designers are leveraging next-generation machine learning models to push the boundaries of digital creativity.",
      author: "Julius Caesar",
      date: "Oct 24, 2023",
      category: "Technology",
      views: "14k",
    },
    {
      id: 2,
      title: "Finding Balance: The Zen Guide to Remote Professionalism",
      excerpt: "Discover the essential habits that separate highly productive remote workers from the rest of the pack in 2024.",
      author: "Marcus Aurelius",
      date: "Oct 22, 2023",
      category: "Lifestyle",
      views: "8.2k",
    },
    {
      id: 3,
      title: "Market Shift: Why Venture Capital is Moving Towards Green Tech",
      excerpt: "An in-depth look at the investment trends shaping the next decade of sustainable innovation and renewable energy.",
      author: "Seneca",
      date: "Oct 20, 2023",
      category: "Business",
      views: "11k",
    },
    {
       id: 4,
       title: "The Silent Revolution: How Micro-Investing is Changing Wealth",
       excerpt: "Exploring the rise of fractional shares and automated portfolios in the modern retail investment landscape.",
       author: "Cicero",
       date: "Oct 18, 2023",
       category: "Economy",
       views: "5.6k",
    },
    {
       id: 5,
       title: "Urban Renaissance: Why Cities are Returning to Traditional Art",
       excerpt: "Tracing the resurgence of mural culture and community-driven street art in global metropolitan centers.",
       author: "Ovid",
       date: "Oct 16, 2023",
       category: "Culture",
       views: "9.1k",
    },
    {
       id: 6,
       title: "Deep Sea Exploration: The Final Frontier of Climate Science",
       excerpt: "New discoveries in the abyss are providing critical data for our understanding of global ocean currents.",
       author: "Pliny",
       date: "Oct 14, 2023",
       category: "Science",
       views: "12k",
    }
  ];

  // Mocking more posts to demonstrate 'Load More'
  const posts = [
    ...initialPosts,
    ...initialPosts.map(p => ({ ...p, id: p.id + 6, title: `${p.title} (Volume II)` })),
    ...initialPosts.map(p => ({ ...p, id: p.id + 12, title: `${p.title} (Volume III)` })),
    ...initialPosts.map(p => ({ ...p, id: p.id + 18, title: `${p.title} (Current Analysis)` })),
  ];

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Bento Feature Grid */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* Primary Feature (Left - 7 Cols) */}
            <div className="lg:col-span-7 relative group overflow-hidden bg-slate-900 shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
               <div className="absolute inset-0 bg-zinc-800 transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute top-8 left-8 z-20">
                  <span className="px-5 py-2 bg-primary text-white text-xs font-black uppercase tracking-[0.2em]">Lead Investigation</span>
               </div>
               <div className="absolute bottom-12 left-12 right-12 z-20">
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-6">
                     <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Eleanor Vance</span>
                     <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Nov 18, 2023</span>
                     <span className="flex items-center gap-2 font-bold text-white italic underline underline-offset-4 decoration-primary decoration-2">Politics</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white hover:text-primary transition-colors cursor-pointer leading-[0.95] mb-8 tracking-tighter uppercase">
                     The Global Shift: Navigating the New Economic Front Line
                  </h1>
                  <Link href="/blog/1" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white border-b-2 border-primary pb-2 hover:gap-5 transition-all">
                     Read Full Dispatch <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>

            {/* Secondary Grid (Right - 5 Cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-6">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="relative group overflow-hidden bg-zinc-900 border border-border/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                    <div className="absolute inset-0 bg-zinc-800 transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                       <span className="text-primary text-[9px] font-black uppercase tracking-widest block mb-2">Technological</span>
                       <h2 className="text-sm md:text-md font-black text-white group-hover:text-primary transition-colors line-clamp-2 uppercase leading-tight">
                          The Future of Quantum Encryption in Global Defense
                       </h2>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Feed */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Content Area (9/12 Cols = 75%) */}
            <div className="lg:w-3/4">
               <div className="flex items-center justify-between border-b-2 border-primary pb-6 mb-12">
                  <h2 className="text-2xl font-black tracking-tighter uppercase">ALL BLOGS</h2>
               </div>

               {/* 3-Column Grid for Blog Posts */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(0, visibleCount).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
               </div>

               {visibleCount < posts.length && (
                 <div className="mt-20 pt-12 border-t border-border flex justify-center">
                    <button 
                      onClick={handleLoadMore}
                      className="px-16 py-6 bg-secondary text-white text-xs font-black uppercase tracking-[0.2em] transform hover:-translate-y-1 transition-all shadow-2xl hover:bg-primary"
                    >
                      Load More
                    </button>
                 </div>
               )}
            </div>

            {/* Right Sidebar Area (3/12 Cols = 25%) */}
            <div className="lg:w-1/4">
               <div className="sticky top-32">
                  <Sidebar />
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
