'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PostCard } from '@/components/PostCard'
import { Sidebar } from '@/components/Sidebar'
import { Search as SearchIcon } from 'lucide-react'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  // Mock data (standardized across pages)
  const allPosts = [
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
  ]

  const filteredPosts = query 
    ? allPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="border-b-2 border-primary pb-8 mb-12 text-center">
            <div className="flex items-center justify-center gap-3 text-primary mb-4">
               <SearchIcon className="w-5 h-5 font-black" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Search Directory</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
              Results For: <span className="text-primary italic">"{query}"</span>
            </h1>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
               Found <span className="text-foreground font-black underline decoration-primary decoration-2 underline-offset-4">{filteredPosts.length}</span> matching dispatches in our system
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Feed */}
          <div className="lg:w-3/4">
             {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                   ))}
                </div>
             ) : (
                <div className="py-24 text-center bg-muted border border-border">
                   <p className="text-2xl font-black uppercase tracking-tighter text-zinc-300">No matches found for your query.</p>
                   <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Try searching for keywords like 'Technology', 'AI', or 'Market'.</p>
                </div>
             )}

             <div className="mt-20 pt-12 border-t border-border text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">End of Search Bundle</span>
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
             <div className="sticky top-32">
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
