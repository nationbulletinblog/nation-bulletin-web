'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Shield, ArrowRight, TrendingUp, Loader2, Globe } from 'lucide-react'
import Link from 'next/link'
import { client } from '@/lib/sanity.client'
import { EditProfileForm } from '@/components/EditProfileForm'
import { urlFor } from '@/lib/sanity.client'
import { SubmissionForm } from '@/components/SubmissionForm'
import { fetchAuthorByEmail } from '@/app/actions/blog'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [authorData, setAuthorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.email) {
      fetchAuthorData()
    }
  }, [session])

  const fetchAuthorData = async () => {
    try {
      const data = await fetchAuthorByEmail(session?.user?.email!)
      setAuthorData(data)
    } catch (error) {
      console.error('Error fetching author data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const bioText = authorData?.bio?.[0]?.children?.[0]?.text || ''

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Editorial Header */}
      <header className="pt-20 pb-16 masthead-line mb-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex items-center gap-10">
              <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                {authorData?.image ? (
                  <img 
                    src={urlFor(authorData.image).url()} 
                    alt={authorData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full p-2">
                     <img src="/images/globe-avatar.png" alt="Admin" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
              <div className="text-left">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="text-meta text-primary font-black uppercase tracking-widest text-[9px]">Verified Member</span>
                    <Shield className="w-3 h-3 text-primary" />
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                    {authorData?.name || session?.user?.name || 'Verified Member'}
                 </h1>
                 <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{session?.user?.email}</p>
                 {bioText && !isEditing && (
                   <p className="mt-4 max-w-xl text-zinc-500 text-xs font-medium leading-relaxed italic border-l-2 border-primary pl-4">
                     "{bioText}"
                   </p>
                 )}
              </div>
           </div>
           
           {!isEditing && (
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 border-2 border-foreground text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors active:scale-95"
                >
                  Edit Profile
                </button>
             </div>
           )}
        </div>
      </header>

      <div className="container mx-auto px-4">
        {isEditing ? (
          <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 border border-border shadow-2xl">
            <h2 className="text-2xl font-black capitalize tracking-tighter mb-12 border-b border-border pb-6">Edit Profile</h2>
            <EditProfileForm 
              user={{
                name: authorData?.name,
                email: authorData?.email,
                image: authorData?.image ? urlFor(authorData.image).url() : null,
                bio: bioText
              }} 
              onCancel={() => setIsEditing(false)}
              onSuccess={() => {
                setIsEditing(false)
                fetchAuthorData()
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {/* Primary Action: Direct Submission Form */}
            <div className="max-w-4xl mx-auto w-full">
               {session && <SubmissionForm session={session} />}
            </div>

            {/* Secondary: Past Articles */}
            <div className="bg-background p-10 md:p-14 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
                  <h2 className="text-3xl font-black capitalize tracking-tighter">My Articles</h2>
                  <Link href="/blog" className="text-meta text-zinc-400 hover:text-primary transition-colors flex items-center gap-2">
                      View Entire Archive <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-12">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-48 aspect-video bg-muted flex-shrink-0" />
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 text-meta text-primary mb-2">
                              <span>Technology</span>
                              <span className="text-zinc-300">Nov {10 + i}, 2023</span>
                          </div>
                          <h3 className="text-xl font-black capitalize italic tracking-tighter leading-tight group-hover:text-primary transition-colors">
                              Policy Shift: The New Ethics of Autonomous Systems
                          </h3>
                          <div className="mt-6 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-primary" /> 1.4k Views</span>
                              <span className="text-primary italic">Status: Published</span>
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

