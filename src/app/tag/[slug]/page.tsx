import React from 'react'
import { PostCard } from '@/components/PostCard'
import { Sidebar } from '@/components/Sidebar'
import { Hash } from 'lucide-react'

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Placeholder data
  const posts = [
    {
      id: 2,
      title: "Finding Balance: The Zen Guide to Remote Professionalism",
      excerpt: "Discover the essential habits that separate highly productive remote workers from the rest of the pack in 2024.",
      author: "Marcus Aurelius",
      date: "Oct 22, 2023",
      category: "LIFESTYLE",
      views: "8.2k",
    },
    {
       id: 5,
       title: "Why Minimalist Web Design is Still Relevant in 2024",
       excerpt: "UX trends come and go, but clarity and speed remain the king of user experience. Here is why less is still more.",
       author: "Dieter Rams",
       date: "Oct 20, 2023",
       category: "DESIGN",
       views: "9.1k",
    }
  ]

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="border-b-2 border-primary pb-8 mb-12">
            <div className="flex items-center gap-3 text-primary mb-4">
               <Hash className="w-5 h-5 font-black" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Tag</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
               Posts Tagged: <span className="text-primary italic">#{slug.replace(/-/g, ' ')}</span>
            </h1>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
               Browsing all articles and stories matching the <span className="text-foreground font-black underline decoration-primary decoration-2 underline-offset-4">#{slug}</span> topic
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Feed */}
          <div className="lg:w-2/3">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                   <PostCard key={post.id} post={post} />
                ))}
             </div>

             <div className="mt-20 pt-12 border-t border-border text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">End of Feed</span>
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
             <div className="sticky top-32">
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
