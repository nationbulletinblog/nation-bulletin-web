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
import { fetchAuthorByEmail, fetchUserPosts } from '@/app/actions/blog'

export function formatViews(views: number | undefined | null) {
  if (!views) return 0;
  if (views >= 1000) {
    return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return views;
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [authorData, setAuthorData] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.email) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [author, posts] = await Promise.all([
        fetchAuthorByEmail(session?.user?.email!),
        fetchUserPosts(session?.user?.email!)
      ])
      setAuthorData(author)
      setUserPosts(posts)
    } catch (error) {
      console.error('Error fetching profile data:', error)
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
                fetchData()
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {/* Primary Action: Direct Submission Form */}
            <div className="max-w-4xl mx-auto w-full">
               {session && <SubmissionForm session={session} onSuccess={fetchData} />}
            </div>

            {/* Secondary: Past Articles */}
            {userPosts.length > 0 && (
              <div className="bg-background p-10 md:p-14 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
                    <h2 className="text-3xl font-black capitalize tracking-tighter">My Articles</h2>
                    <Link href="/blog" className="text-meta text-zinc-400 hover:text-primary transition-colors flex items-center gap-2">
                        View All Blogs <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
  
                  <div className="space-y-12">
                    {userPosts.map((post: any) => (
                      <div key={post._id} className="group flex flex-col md:flex-row gap-8 items-start">
                          <div className="w-full md:w-48 aspect-video bg-muted flex-shrink-0 relative overflow-hidden">
                             {post.mainImage ? (
                               <img 
                                 src={urlFor(post.mainImage).url()} 
                                 alt={post.title} 
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                               />
                             ) : (
                               <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                                 <Globe className="w-8 h-8 text-zinc-300" />
                               </div>
                             )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center space-x-3 text-meta text-primary mb-2">
                                <span>{post.categories?.[0]?.title || 'General'}</span>
                                <span className="text-zinc-300">
                                  {new Date(post.publishedAt || post._createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                            </div>
                            <Link href={`/blog/${post.slug?.current || '#'}`}>
                              <h3 className="text-xl font-black capitalize italic tracking-tighter leading-tight group-hover:text-primary transition-colors cursor-pointer">
                                  {post.title}
                              </h3>
                            </Link>
                            <div className="mt-6 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-primary" /> {formatViews(post.views)} Views</span>
                                <span className={`${post.status === 'Under Approval' ? 'text-zinc-400' : 'text-primary'} italic`}>
                                  Status: {post.status}
                                </span>
                            </div>
                          </div>
                      </div>
                    ))}
                  </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

