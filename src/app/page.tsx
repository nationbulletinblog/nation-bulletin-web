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
    title: settings?.seoTitle || "Nation Bulletin | Stories & Insights",
    description: settings?.seoDescription || "Modern news and blog platform providing investigative insights and global narratives.",
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: settings?.seoTitle || "Nation Bulletin | Stories & Insights",
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
      title: settings?.seoTitle || "Nation Bulletin | Stories & Insights",
      description: settings?.seoDescription || "Modern news and blog platform.",
      images: ['/logo.png'],
    },
  };
}

export default async function Home() {
  // Fetch 5 for hero + 12 for initial list = 17 posts
  const posts = await getPosts(17);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 5);
  const remainingPosts = posts.slice(5);

  return (
    <div className="bg-background min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Nation Bulletin",
            "url": baseUrl,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${baseUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* Bento Feature Grid */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* Primary Feature (Left - 7 Cols) */}
            {featuredPost && (
              <div className="lg:col-span-7 relative group overflow-hidden bg-slate-900 shadow-2xl min-h-[400px] md:min-h-[600px]">
                <Link href={`/blog/${featuredPost.slug.current}`} className="relative block w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                  {featuredPost.mainImage ? (
                    <Image
                      src={urlFor(featuredPost.mainImage).url()}
                      alt={featuredPost.mainImage.alt || featuredPost.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-800" />
                  )}
                  <div className="absolute top-8 left-8 z-20">
                    <span className="px-5 py-2 bg-primary text-white text-xs font-black uppercase tracking-[0.2em]">
                      {featuredPost.categories?.[0]?.title || 'Latest Investigation'}
                    </span>
                  </div>
                  <div className="absolute bottom-12 left-12 right-12 z-20">
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-6">
                      <span className="flex items-center gap-2 normal-case">
                        <User className="w-4 h-4 text-primary" /> 
                        {featuredPost.showAsAdmin !== false ? 'Admin' : (featuredPost.author?.name || 'Admin')}
                      </span>
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white hover:text-primary transition-colors cursor-pointer leading-[0.95] mb-8 tracking-tighter">
                      {featuredPost.title}
                    </h1>
                    <div className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white border-b-2 border-primary pb-2 hover:gap-5 transition-all">
                      Read Full Blog <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Secondary Grid (Right - 5 Cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {sidePosts.map((post: any) => (
                <div key={post._id} className="relative group overflow-hidden bg-zinc-900 border border-border/10">
                   <Link href={`/blog/${post.slug.current}`} className="relative block w-full h-full min-h-[200px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                    {post.mainImage ? (
                      <Image
                        src={urlFor(post.mainImage).url()}
                        alt={post.mainImage.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-800" />
                    )}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest">
                        {post.categories?.[0]?.title}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <h2 className="text-sm font-black text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>
                    </div>
                   </Link>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* Main Content Feed */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Content Area (9/12 Cols = 75%) */}
            <div className="lg:w-3/4">
               <div className="flex items-center justify-between border-b-2 border-primary pb-6 mb-12">
                  <h2 className="text-2xl font-black tracking-tighter">OUR LATEST BLOGS</h2>
               </div>

               {/* Load More List */}
               <BlogList initialPosts={remainingPosts} initialOffset={5} />
            </div>

            {/* Right Sidebar Area (3/12 Cols = 25%) */}
            <div className="lg:w-1/4">
                <Sidebar />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
