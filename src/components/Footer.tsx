import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Globe, Send, Share2, Mail, Users, Video } from 'lucide-react'

import { client } from '@/lib/sanity.client'

export const Footer = async () => {
  const categories = [
    'Business', 'Health', 'Services', 'Education', 
    'Technology', 'Shopping', 'Home', 'General', 
    'SEO', 'Travel'
  ]

  // Fetch latest 4 posts and site settings
  const [latestPosts, settings] = await Promise.all([
    client.fetch(`*[_type == "post"] | order(publishedAt desc) [0...4] {
      _id,
      title,
      slug
    }`),
    client.fetch(`*[_type == "siteSettings"][0]`)
  ])

  return (
    <footer className="bg-[#111111] text-zinc-300 pt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Brand Info & Paid Opportunity */}
          <div className="space-y-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
               <Image src="/logo_footer.png" alt="Nation Bulletin Logo" width={200} height={60} className="object-contain" style={{ height: 'auto' }} />
            </Link>
            <p className="text-[13px] leading-relaxed font-medium !text-white">
              {settings?.footerAbout || "NationBulletin is a free blogging platform where writers, businesses, and creators can publish high-quality content, share insights, and gain online visibility. Join us to grow your authority, reach a wider audience, and build strong SEO presence."}
            </p>
          </div>

          {/* Column 2: Categories */}
          <div className="border-l border-zinc-800 md:pl-12">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link 
                  key={category} 
                  href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1.5 bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-200 hover:bg-primary hover:text-white transition-all border border-zinc-700"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Latest Blogs */}
          <div className="border-l border-zinc-800 md:pl-12">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Latest Blogs</h4>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
              {latestPosts.map((post: any) => (
                <li key={post._id}>
                  <Link href={`/blog/${post.slug.current}`} className="text-zinc-300 hover:text-primary transition-colors flex items-start gap-3 group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="leading-relaxed line-clamp-2">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Paid Opportunity */}
          <div className="border-l border-zinc-800 md:pl-12">
            <div className="p-5 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3">
               <h5 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#ff3333] border-l-2 border-[#ff3333] pl-3 mb-4">
                 {settings?.paidContentTitle || "Paid Content Opportunity"}
               </h5>
                <p className="text-[13px] leading-relaxed font-medium !text-white opacity-90">
                   {settings?.paidContentDescription || "We offer SEO-friendly guest posts with high-quality do-follow backlinks, helping boost your website’s authority and search rankings. We provide fast approval and permanent content placement for long-term benefits."}
                </p>
               <div className="flex items-center gap-3 text-[13px] font-black text-white mt-6 group">
                  <Mail className="w-4 h-4 text-[#ff4d4d] group-hover:scale-110 transition-transform" />
                  <a href={`mailto:${settings?.contactEmail || "submit@nationbulletin.com"}`} className="hover:text-[#ff4d4d] transition-colors border-b border-white/10 hover:border-[#ff4d4d]">
                    {settings?.contactEmail || "submit@nationbulletin.com"}
                  </a>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 bg-black -mx-4">
           <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms & Condition</Link>
                <Link href="/content-policy" className="hover:text-white transition-colors">Content Policy</Link>
                <Link href="/write-for-us" className="hover:text-white transition-colors text-primary">Write For Us</Link>
              </div>
              
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                 <span className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
                    <ShieldCheck className="w-3 h-3 text-primary" /> DMCA PROTECTED
                 </span>
                 <span>Copyright © 2026 NationBulletin.com</span>
              </div>
           </div>
        </div>
      </div>
    </footer>
  )
}
