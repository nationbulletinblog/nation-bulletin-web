import React from 'react'
import { PostCard } from '@/components/PostCard'
import { Sidebar } from '@/components/Sidebar'
import { Folder } from 'lucide-react'
import { client } from '@/lib/sanity.client'

async function getCategoryPosts(slug: string) {
  const query = `*[_type == "post" && references(*[_type == "category" && slug.current == $slug]._id)] | order(publishedAt desc) {
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
  return await client.fetch(query, { slug });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getCategoryPosts(slug);

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
                {posts.map((post: any) => (
                   <PostCard key={post._id} post={post} />
                ))}
             </div>

             {posts.length === 0 && (
               <div className="py-24 text-center">
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No intelligence dispatches found in this sector.</p>
               </div>
             )}

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
