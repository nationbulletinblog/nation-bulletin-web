import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Globe, Send, Share2, Mail, Users, Video } from 'lucide-react'

export const Footer = () => {
  const tags = [
    'Agarwal Packers', 'Artificial Intelligence', 'Business', 'Custom Boxes',
    'Custom Printed Boxes', 'Digital Marketing', 'Education', 'Food',
    'Health', 'Home', 'Home Improvement', 'Mobile App Development',
    'Packaging', 'Packers And Movers', 'SEO', 'SEO Services',
    'Social Media', 'Technology', 'Travel', 'Web Design'
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
    <footer className="bg-[#111111] text-[#CCCCCC] pt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Brand Info & Paid Opportunity */}
          <div className="space-y-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
               <Image src="/logo_footer.png" alt="Nation Bulletin Logo" width={200} height={60} className="object-contain" />
            </Link>
            <p className="text-xs leading-relaxed font-medium">
              NationBulletin is a free blogging platform where writers, businesses, and creators can publish high-quality content, share insights, and gain online visibility. Join us to grow your authority, reach a wider audience, and build strong SEO presence.
            </p>
            <div className="p-5 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3">
               <h5 className="text-[10px] font-black uppercase tracking-widest text-primary italic underline underline-offset-4">Paid Content Opportunity</h5>
               <p className="text-[10px] leading-relaxed text-zinc-400">
                  SEO-friendly guest posts, Do-follow backlinks, Brand promotion to a targeted audience, Fast approval and permanent placement.
               </p>
               <div className="flex items-center gap-2 text-[10px] font-black text-white mt-4">
                  <Mail className="w-3 h-3 text-primary" />
                  <span>xyz@email.com</span>
               </div>
            </div>
          </div>

          {/* Column 2: Tags */}
          <div className="border-l border-zinc-800 pl-0 md:pl-12">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link 
                  key={tag} 
                  href={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1.5 bg-zinc-800 text-[9px] font-bold uppercase tracking-wider text-zinc-300 hover:bg-primary hover:text-white transition-all border border-zinc-700"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Sponsor Links */}
          <div className="border-l border-zinc-800 pl-0 md:pl-12">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Sponsor Links</h4>
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest">
              {sponsorLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-zinc-400 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Website Status & Social */}
          <div className="border-l border-zinc-800 pl-0 md:pl-12 flex flex-col items-center text-center">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 w-full text-left">Website Status</h4>
            <div className="relative w-full aspect-square max-w-[200px] flex flex-col items-center justify-center p-6 bg-zinc-900 rounded-full border-4 border-primary/20 shadow-2xl">
               {/* Decorative Ring */}
               <div className="absolute inset-0 border-[8px] border-zinc-800 rounded-full" />
               <div className="relative z-10 space-y-2">
                  <div className="text-[10px] font-black text-zinc-500 uppercase">Nation Authority</div>
                  <div className="flex items-center justify-center gap-4 text-white text-xs font-black">
                     <div>DA - <span className="text-primary">37</span></div>
                     <div>PA - <span className="text-primary">46</span></div>
                  </div>
                  <div className="h-px bg-zinc-800 w-12 mx-auto my-2" />
                  <div className="text-[9px] font-bold text-zinc-400">ALEXA: 34,297</div>
                  <div className="text-[9px] font-bold text-zinc-400">COUNTRY: 4,366</div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 bg-black -mx-[4px]">
           <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms & Condition</Link>
                <Link href="/content-policy" className="hover:text-white transition-colors">Content Policy</Link>
              </div>
              
              <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                 <span className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">
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
