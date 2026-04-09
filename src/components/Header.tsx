'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Search, Menu, X, User, LogOut, Edit3, ChevronDown, Globe } from 'lucide-react'

export const Header = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'Politics', href: '/category/politics' },
    { name: 'Economy', href: '/category/economy' },
    { name: 'World', href: '/category/world' },
    { name: 'Business', href: '/category/business' },
    { name: 'Opinion', href: '/category/opinion' },
    { name: 'Tech', href: '/category/technology' },
  ]

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md py-4' : 'bg-background py-6 md:py-8'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left Aligned */}
          <Link href="/" className="flex flex-col group">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
              NATION<span className="text-primary italic">.</span>BULLETIN
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="h-[2px] w-8 bg-primary"></span>
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Global News</span>
            </div>
          </Link>

          {/* Navigation - Centered (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
             {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-primary hover:bg-muted transition-all rounded-lg"
                >
                  {link.name}
                </Link>
             ))}
          </nav>

          {/* Utilities - Right Aligned */}
          <div className="flex items-center space-x-4 md:space-x-8">
             <div className="hidden md:flex items-center gap-4 border-r border-border pr-8 mr-4">
                <div className="relative flex items-center">
                   {isSearchOpen ? (
                      <form onSubmit={handleSearchSubmit} className="absolute right-0 flex items-center animate-in slide-in-from-right-4 duration-300">
                         <input 
                           autoFocus
                           type="text" 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="bg-muted border border-primary px-4 py-2 text-xs font-black uppercase tracking-widest outline-none w-64"
                           placeholder="SEARCH..."
                         />
                         <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 text-zinc-400 hover:text-primary">
                            <X className="w-4 h-4" />
                         </button>
                      </form>
                   ) : (
                      <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="text-zinc-400 hover:text-primary transition-colors"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                   )}
                </div>
                <Link href="/write-for-us" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">
                   <Edit3 className="w-4 h-4" />
                   <span className="hidden xl:inline">Write for Us</span>
                </Link>
             </div>

             {/* Auth Section */}
             <div className="flex items-center gap-4">
                {session ? (
                  <div className="flex items-center gap-3">
                    <Link href="/profile" className="w-10 h-10 bg-muted flex items-center justify-center rounded-full hover:ring-2 ring-primary transition-all overflow-hidden border border-border">
                       <User className="w-5 h-5 text-zinc-400" />
                    </Link>
                    <button onClick={() => signOut()} className="text-zinc-400 hover:text-red-500 transition-colors">
                       <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">Login</Link>
                    <Link href="/register" className="px-6 py-3 bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-secondary/10 active:scale-95">
                      Subscribe
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 bg-muted rounded-xl hover:text-primary transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
             </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[80px] bg-background z-[60] lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
             <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center space-y-8">
                {navLinks.map((link) => (
                   <Link 
                     key={link.name} 
                     href={link.href}
                     className="text-4xl font-black uppercase tracking-tighter text-foreground hover:text-primary transition-colors"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     {link.name}
                   </Link>
                ))}
                
                <div className="w-full pt-12 border-t border-border flex flex-col items-center gap-8">
                   <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-muted p-4">
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="SEARCH STORIES..."
                        className="flex-grow bg-transparent outline-none font-black text-xs uppercase"
                      />
                      <button type="submit">
                        <Search className="w-6 h-6 text-primary" />
                      </button>
                   </form>
                   <Link 
                     href="/register" 
                     className="w-full py-6 bg-primary text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     Read All Stories
                   </Link>
                </div>
             </div>
          </div>
        )}
      </div>
    </header>
  )
}
