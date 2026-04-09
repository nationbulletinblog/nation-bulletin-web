import React from 'react'
import Link from 'next/link'
import { Globe, Send, Share2, Mail, ArrowRight } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div>
            <Link href="/" className="inline-block mb-8">
               <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                 NATION<span className="text-primary italic">.</span>BULLETIN
               </h2>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mt-2">Personal Blog Network</p>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
              We deliver independent, high-impact journalism for the digital age. Our mission is to provide global insights with absolute transparency and speed.
            </p>
            <div className="flex items-center space-x-6">
              {[Globe, Send, Share2].map((Icon, i) => (
                <Link key={i} href="#" className="text-zinc-500 hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8 border-b border-zinc-800 pb-4">Quick Links</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-zinc-400">
              <li><Link href="/blog" className="hover:text-white transition-colors">Front Page</Link></li>
              <li><Link href="/category/politics" className="hover:text-white transition-colors">Political Analysis</Link></li>
              <li><Link href="/category/economy" className="hover:text-white transition-colors">Global Economy</Link></li>
              <li><Link href="/category/opinion" className="hover:text-white transition-colors">Opinion Pieces</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8 border-b border-zinc-800 pb-4">Main Categories</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-zinc-400">
              <li><Link href="/category/technology" className="hover:text-white transition-colors">Technology</Link></li>
              <li><Link href="/category/business" className="hover:text-white transition-colors">Business</Link></li>
              <li><Link href="/category/lifestyle" className="hover:text-white transition-colors">Lifestyle</Link></li>
              <li><Link href="/category/culture" className="hover:text-white transition-colors">World Culture</Link></li>
            </ul>
          </div>

          {/* Tag Cloud */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-8 border-b border-zinc-800 pb-4">Tag Cloud</h4>
            <div className="flex flex-wrap gap-2">
              {['#Tech', '#SEO', '#Business', '#Marketing', '#Startups', '#Web3', '#Ethics', '#Success', '#Growth', '#Insight'].map((tag) => (
                <Link 
                  key={tag} 
                  href={`/tag/${tag.replace('#', '').toLowerCase()}`}
                  className="px-3 py-1.5 bg-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:bg-primary hover:text-white transition-all border border-zinc-700 hover:border-primary"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

       {/* Bottom Bar */}
        <div className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
           <div className="flex items-center space-x-8">
              <span>© {new Date().getFullYear()} NATION BULLETIN DIGITAL</span>
              <span className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">
                <Globe className="w-3 h-3 text-primary animate-pulse" /> 
                International Edition
              </span>
           </div>
           <div className="flex items-center space-x-8">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/write-for-us" className="hover:text-primary transition-colors">Become a Contributor</Link>
           </div>
        </div>
      </div>
    </footer>
  )
}
