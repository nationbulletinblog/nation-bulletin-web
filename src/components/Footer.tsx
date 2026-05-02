import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Globe, Send, Share2, Mail, Users, Video } from 'lucide-react'

export const Footer = () => {
  const categories = [
    'Business', 'Health', 'Services', 'Education', 
    'Technology', 'Shopping', 'Home', 'General', 
    'SEO', 'Travel'
  ]

  const sponsorLinks = [
    { name: 'Digital Transformation Services', href: '#' },
    { name: 'Mobility Solutions India', href: '#' },
    { name: 'Enterprise App Development Company', href: '#' },
    { name: 'IoT Consulting Services', href: '#' },
    { name: 'AR VR App Development Company', href: '#' },
    { name: 'DevOps Consulting Services', href: '#' },
    { name: 'AI and ML Solutions', href: '#' },
    { name: 'Blockchain Application Development Company', href: '#' },
    { name: 'Software Development Company India', href: '#' },
    { name: 'Serverless App Development Company', href: '#' },
  ]

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
              NationBulletin is a free blogging platform where writers, businesses, and creators can publish high-quality content, share insights, and gain online visibility. Join us to grow your authority, reach a wider audience, and build strong SEO presence.
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

          {/* Column 3: Sponsor Links */}
          <div className="border-l border-zinc-800 md:pl-12">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Sponsor Links</h4>
            <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest">
              {sponsorLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-zinc-300 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Paid Opportunity */}
          <div className="border-l border-zinc-800 md:pl-12">
            <div className="p-5 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3">
               <h5 className="text-[10px] font-black uppercase tracking-widest text-primary italic underline underline-offset-4">Paid Content Opportunity</h5>
               <p className="text-[11px] leading-relaxed !text-white">
                  SEO-friendly guest posts, Do-follow backlinks, Brand promotion to a targeted audience, Fast approval and permanent placement.
               </p>
               <div className="flex items-center gap-2 text-[11px] font-bold text-white mt-4">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>xyz@email.com</span>
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
