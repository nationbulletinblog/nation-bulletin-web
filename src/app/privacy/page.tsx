import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen pt-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-px flex-grow bg-primary"></div>
            <span className="text-primary font-black uppercase tracking-widest text-[10px]">Data Privacy</span>
            <div className="h-px flex-grow bg-primary"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12 text-center">
            Privacy Policy
          </h1>

          <div className="prose prose-xl prose-zinc dark:prose-invert max-w-none">
            <p className="lead font-bold text-xl mb-12 text-zinc-500">
              Your privacy matters. This policy explains how we handle your information on Nation Bulletin.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">1. Information We Collect</h2>
              <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                We collect information you provide when you create an account, post an article, or contact us. This includes your name and email address.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">2. How We Use It</h2>
              <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                We use your information to manage your profile and improve our services. We never sell your personal data to anyone.
              </p>
            </section>

            <section className="mb-12 pt-12 border-t border-border text-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Questions?</h4>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                 Contact us: <span className="text-foreground border-b border-primary">privacy@nationbulletin.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
