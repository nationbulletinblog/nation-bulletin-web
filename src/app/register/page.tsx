'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from '../actions/register'
import { User, Mail, Lock, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)

    const result = await registerUser(formData)

    if (result.success) {
      setSuccess(result.message)
      setLoading(false)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4 py-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary/40"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="max-w-[520px] w-full bg-white rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-zinc-100 relative z-10 overflow-hidden">
        {/* Top Accents */}
        <div className="h-1.5 w-full bg-secondary/10 flex">
           <div className="h-full w-1/3 bg-secondary"></div>
        </div>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-50 rounded-xl mb-4 shadow-inner text-secondary">
               <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 mb-1">Create Account</h2>
            <p className="text-xs font-medium text-zinc-500 max-w-[320px] mx-auto">
               Join the Nation Bulletin community today.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-zinc-400 group-focus-within:text-secondary transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-sm transition-all duration-300 placeholder:text-zinc-300"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-400 group-focus-within:text-secondary transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-sm transition-all duration-300 placeholder:text-zinc-300"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-400 group-focus-within:text-secondary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-sm transition-all duration-300 placeholder:text-zinc-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
                <p className="text-xs font-semibold text-red-600 leading-tight">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50/50 rounded-xl border border-green-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-1.5 h-8 bg-green-500 rounded-full"></div>
                <p className="text-xs font-semibold text-green-600 leading-tight">{success}</p>
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-[13px] font-medium text-zinc-500">
                Found your way back?{' '}
                <Link href="/login" className="text-secondary font-bold hover:text-zinc-900 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        {/* Footer Info */}
        <div className="bg-zinc-50/50 p-6 border-t border-zinc-100 flex items-center justify-center gap-2">
           <ShieldCheck className="w-3 h-3 text-zinc-400" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Secure Registration Protocol</span>
        </div>
      </div>
    </div>
  )
}
