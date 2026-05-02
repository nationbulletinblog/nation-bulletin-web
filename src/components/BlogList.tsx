'use client'

import React, { useState } from 'react'
import { PostCard } from './PostCard'
import { fetchPosts } from '@/app/actions/blog'
import { Loader2 } from 'lucide-react'

interface BlogListProps {
  initialPosts: any[]
  initialOffset: number
  categorySlug?: string
  searchQuery?: string
  limit?: number
}

export const BlogList = ({ 
  initialPosts, 
  initialOffset, 
  categorySlug, 
  searchQuery,
  limit = 12 
}: BlogListProps) => {
  const [posts, setPosts] = useState(initialPosts)
  const [offset, setOffset] = useState(initialOffset)
  const [hasMore, setHasMore] = useState(initialPosts.length >= limit)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const newOffset = offset + limit
      const newPosts = await fetchPosts(newOffset, limit, categorySlug, searchQuery)
      
      if (newPosts.length < limit) {
        setHasMore(false)
      }
      
      setPosts([...posts, ...newPosts])
      setOffset(newOffset)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-10 py-4 bg-zinc-900 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-primary transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading Dispatches...</span>
              </>
            ) : (
              <>
                <span>View All Blogs</span>
                <div className="w-6 h-px bg-white/30 group-hover:w-10 transition-all"></div>
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-border text-center">
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">End of Intelligence Feed</span>
        </div>
      )}
    </div>
  )
}
