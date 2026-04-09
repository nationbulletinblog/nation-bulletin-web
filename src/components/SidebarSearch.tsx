'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export const SidebarSearch = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="bg-muted p-8">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 border-b border-zinc-200 pb-4">Search Articles</h3>
      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Type and hit enter..." 
          className="w-full bg-white border border-border py-4 px-4 text-xs font-medium focus:border-primary outline-none transition-all placeholder:text-zinc-300"
        />
        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
          <Search className="w-4 h-4 text-zinc-300 hover:text-primary transition-colors" />
        </button>
      </form>
    </section>
  )
}
