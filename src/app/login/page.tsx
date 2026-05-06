'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, ShieldCheck, Globe } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!turnstileToken) {
      setError('Please complete the security check.')
      return
    }

    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/profile')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4 py-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary/40"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="max-w-[480px] w-full bg-white rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-zinc-100 relative z-10 overflow-hidden">
        {/* Top Accents */}
        <div className="h-1.5 w-full bg-primary/10 flex">
           <div className="h-full w-1/3 bg-primary"></div>
        </div>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-50 rounded-xl mb-4 shadow-inner">
               <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 mb-1">Welcome Back</h2>
            <p className="text-xs font-medium text-zinc-500 max-w-[280px] mx-auto">
               Sign in to your Nation Bulletin editorial account.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all duration-300 placeholder:text-zinc-300"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Password</label>
                   <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all duration-300 placeholder:text-zinc-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={(token) => setTurnstileToken(token)}
                  options={{
                    theme: 'light',
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
                <p className="text-xs font-semibold text-red-600 leading-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex items-center justify-center gap-3 bg-zinc-900 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-xl hover:shadow-zinc-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait py-3.5`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative my-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
               <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-zinc-400">Secure</span></div>
            </div>

            <div className="text-center">
              <p className="text-[13px] font-medium text-zinc-500">
                New to Nation Bulletin?{' '}
                <Link href="/register" className="text-primary font-bold hover:text-zinc-900 transition-colors">
                  Create an Account
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        {/* Simple Footer Accents */}
        <div className="bg-zinc-50/50 p-6 border-t border-zinc-100 flex justify-center gap-6">
           <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Platform v2.1</span>
           </div>
        </div>
      </div>
    </div>
  )
}
