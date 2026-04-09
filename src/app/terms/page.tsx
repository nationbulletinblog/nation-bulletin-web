import React from 'react'

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen pt-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-px flex-grow bg-primary"></div>
            <span className="text-primary font-black uppercase tracking-widest text-[10px]">Usage Rules</span>
            <div className="h-px flex-grow bg-primary"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12 text-center">
            Terms of Service
          </h1>

          <div className="prose prose-xl prose-zinc dark:prose-invert max-w-none">
            <p className="lead font-bold text-xl mb-12 text-zinc-500">
              By using Nation Bulletin, you agree to follow these simple rules.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">1. Content Ownership</h2>
              <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                All articles, images, and tools on this site are the property of Nation Bulletin or its members. You cannot copy or reuse them without our permission.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">2. Community Rules</h2>
              <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                We do not allow spam, fake news, or abusive behavior. We reserve the right to remove any account or article that breaks these rules.
              </p>
            </section>

            <section className="mb-12 pt-12 border-t border-border text-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Questions?</h4>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                 Contact us: <span className="text-foreground border-b border-primary">info@nationbulletin.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
