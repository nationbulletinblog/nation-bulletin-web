import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { BlogList } from '@/components/BlogList'
import { Folder } from 'lucide-react'
import { client } from '@/lib/sanity.client'

async function getCategory(slug: string) {
  return await client.fetch(`*[_type == "category" && slug.current == $slug][0]{ title, description, seoTitle, seoDescription }`, { slug });
}

async function getCategoryPosts(slug: string, limit: number) {
  const query = `*[_type == "post" && references(*[_type == "category" && slug.current == $slug]._id)] | order(publishedAt desc) [0...${limit}] {
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
    categories[]->{
      title
    }
  }`;
  return await client.fetch(query, { slug });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!category) return { title: 'Category Not Found' };

  return {
    title: category.seoTitle || `${category.title} | Nation Bulletin`,
    description: category.seoDescription || category.description,
    alternates: {
      canonical: `${baseUrl}/category/${slug}`,
    },
    openGraph: {
      title: category.seoTitle || `${category.title} | Nation Bulletin`,
      description: category.seoDescription || category.description,
      url: `${baseUrl}/category/${slug}`,
      siteName: 'Nation Bulletin',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 800,
          height: 600,
          alt: 'Nation Bulletin Logo',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: category.seoTitle || `${category.title} | Nation Bulletin`,
      description: category.seoDescription || category.description,
      images: [`${baseUrl}/logo.png`],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialPosts = await getCategoryPosts(slug, 12);

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="border-b-2 border-primary pb-8 mb-12">
            <div className="flex items-center gap-3 text-primary mb-4">
               <Folder className="w-5 h-5 font-black" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Category</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
              Browsing: <span className="text-primary italic">{slug.replace(/-/g, ' ')}</span>
            </h1>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
               Latest articles and stories within the <span className="text-foreground font-black underline decoration-primary decoration-2 underline-offset-4">{slug}</span> section
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Feed */}
          <div className="lg:w-3/4">
             {initialPosts.length > 0 ? (
                <BlogList initialPosts={initialPosts} initialOffset={0} categorySlug={slug} />
             ) : (
                <div className="py-24 text-center">
                   <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No intelligence dispatches found in this sector.</p>
                </div>
             )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
             <div className="sticky top-32">
                <Sidebar />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
