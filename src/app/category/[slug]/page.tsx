import React from 'react'
import { PostCard } from '@/components/PostCard'
import { Sidebar } from '@/components/Sidebar'
import { Folder } from 'lucide-react'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Placeholder data
  const posts = [
    {
      id: 1,
      title: "The Rapid Evolution of Generative AI in Creative Industries",
      excerpt: "How artists and designers are leveraging next-generation machine learning models to push the boundaries of digital creativity.",
      author: "Julius Caesar",
      date: "Oct 24, 2023",
      category: "TECHNOLOGY",
      views: "14k",
    },
    {
       id: 4,
       title: "The Impact of Quantum Computing on Financial Security",
       excerpt: "An in-depth look at how next-gen encryption is being challenged by emerging computational power.",
       author: "Eleanor Vance",
       date: "Oct 18, 2023",
       category: "TECHNOLOGY",
       views: "12k",
    },
    {
       id: 6,
       title: "Deep Sea Exploration: The Final Frontier of Climate Science",
       excerpt: "New discoveries in the abyss are providing critical data for our understanding of global ocean currents.",
       author: "Pliny",
       date: "Oct 14, 2023",
       category: "SCIENCE",
       views: "9.2k",
    }
  ]

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="border-b-2 border-primary pb-8 mb-12">
            <div className="flex items-center gap-3 text-primary mb-4">
               <Folder className="w-5 h-5 font-black" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Category</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
              Browsing: <span className="text-primary italic">{slug.replace(/-/g, ' ')}</span>
            </h1>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
               Latest articles and stories within the <span className="text-foreground font-black underline decoration-primary decoration-2 underline-offset-4">{slug}</span> section
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
