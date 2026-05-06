import React from "react";
import Link from "next/link";
import { User, Calendar, ArrowRight } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { BlogList } from "@/components/BlogList";
import { client } from "@/lib/sanity.client";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import { fetchSiteSettings } from "@/app/actions/blog";

export const dynamic = 'force-dynamic'

async function getPosts(limit: number) {
  const query = `*[_type == "post"] | order(publishedAt desc) [0...${limit}] {
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
    showAsAdmin,
    categories[]->{
      title
    }
  }`;
  return await client.fetch(query);
}

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    title: settings?.seoTitle || "Nation Bulletin (Pending CMS)",
    description: settings?.seoDescription || "Modern news and blog platform.",
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: settings?.seoTitle || "Nation Bulletin (Pending CMS)",
      description: settings?.seoDescription || "Modern news and blog platform.",
      url: baseUrl,
      siteName: 'Nation Bulletin',
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 800,
          height: 600,
          alt: 'Nation Bulletin Logo',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings?.seoTitle || "Nation Bulletin (Pending CMS)",
      description: settings?.seoDescription || "Modern news and blog platform.",
      images: ['/logo.png'],
    },
  };
}

export default async function Home() {
  const posts = await getPosts(10);
  const settings = await fetchSiteSettings();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="bg-[#F9F9F9] min-h-screen font-sans">
      {/* Featured Section */}
      {featuredPost && (
        <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden group">
          {featuredPost.mainImage && (
            <Image
              src={urlFor(featuredPost.mainImage).url()}
              alt={featuredPost.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
              <div className="max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-xs font-bold uppercase tracking-[0.2em]">
                  <span className="px-3 py-1 bg-primary text-white rounded-full">Featured Article</span>
                  <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                  {featuredPost.title}
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-300 font-medium line-clamp-2 max-w-2xl">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                      {featuredPost.showAsAdmin !== false ? (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <Image src="/favicon-globe.png" alt="Admin" width={24} height={24} className="opacity-50" />
                        </div>
                      ) : featuredPost.author?.image ? (
                        <Image
                          src={urlFor(featuredPost.author.image).url()}
                          alt={featuredPost.author.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white font-bold">
                          {featuredPost.author?.name?.charAt(0) || 'A'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm tracking-tight">
                        {featuredPost.showAsAdmin !== false ? 'Admin' : (featuredPost.author?.name || 'Admin')}
                      </div>
                      <div className="text-white/60 text-[10px] font-black uppercase tracking-widest">Lead Editor</div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${featuredPost.slug.current}`}
                    className="flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all group/btn shadow-2xl"
                  >
                    Read Story
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            <div className="flex items-end justify-between border-b-2 border-zinc-900/5 pb-6">
              <div>
                <div className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">The Latest News</div>
                <h2 className="text-4xl md:text-5xl font-black text-zinc-950 tracking-tighter">Recent Stories</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {remainingPosts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all group shadow-xl"
              >
                View Archive
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
             <div className="sticky top-28">
               <Sidebar settings={settings} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
