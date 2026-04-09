import React from 'react'
import { PostCard } from '@/components/PostCard'
import { Sidebar } from '@/components/Sidebar'
import { Search as SearchIcon } from 'lucide-react'
import { client } from '@/lib/sanity.client'

async function getSearchResults(query: string) {
  const sanityQuery = `*[_type == "post" && (title match $searchQuery || excerpt match $searchQuery || categories[]->title match $searchQuery)] | order(publishedAt desc) {
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
  return await client.fetch(sanityQuery, { searchQuery: `*${query}*` });
}

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const { q: query = '' } = await searchParams;
  const filteredPosts = query ? await getSearchResults(query) : [];

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
                   {filteredPosts.map((post: any) => (
                      <PostCard key={post._id} post={post} />
                   ))}
                </div>
             ) : (
                <div className="py-24 text-center bg-muted border border-border">
                   <p className="text-2xl font-black uppercase tracking-tighter text-zinc-300">No matches found for your query.</p>
                   {query ? (
                     <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Try searching for different keywords or sectors.</p>
                   ) : (
                     <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Please enter a search term in the field above.</p>
                   )}
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
