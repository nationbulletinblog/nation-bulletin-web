'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from '../actions/register'

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-24 relative overflow-hidden">
      {/* Editorial Decorative Elements */}
      <div className="absolute top-0 right-0 w-full h-2 bg-primary"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-12 bg-white p-12 md:p-16 border-2 border-primary shadow-[20px_20px_0px_0px_rgba(145,10,10,0.1)] relative z-10">
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Contributor Program</span>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            Join Us<span className="text-primary">.</span>
          </h2>
          <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-relaxed">
            Create your press profile and start shaping the narrative today.
          </p>
        </div>

        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Full Identity</label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-muted border border-border focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
                placeholder="FIRST LAST"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Email Channel</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 bg-muted border border-border focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
                placeholder="YOUR@SECUREMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Security Key</label>
              <input
                type="password"
                required
                className="w-full px-5 py-4 bg-muted border border-border focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-black uppercase tracking-widest">
              Validation Protocol Failed: {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-[10px] font-black uppercase tracking-widest">
              Protocol Accepted: {success}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-5 px-4 text-xs font-black uppercase tracking-[0.3em] transition-all transform active:scale-95 ${
                loading ? 'bg-zinc-300 text-zinc-500 cursor-wait' : 'bg-primary text-white hover:bg-zinc-900 shadow-xl shadow-primary/10'
              }`}
            >
              {loading ? 'Processing Registry...' : 'Initiate Registration'}
            </button>
          </div>

          <div className="text-center pt-8 border-t border-border mt-12">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Already Registered?{' '}
              <Link href="/login" className="text-primary font-black hover:underline hover:decoration-2 underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
