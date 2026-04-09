'use client'

import React, { useState } from 'react'
import { updateProfile } from '@/app/actions/update-profile'
import { Camera, Save, X, Loader2 } from 'lucide-react'

interface EditProfileFormProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    bio?: string | null
  }
  onCancel: () => void
  onSuccess: () => void
}

export function EditProfileForm({ user, onCancel, onSuccess }: EditProfileFormProps) {
  const [name, setName] = useState(user.name || '')
  const [bio, setBio] = useState(user.bio || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(user.image || null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('bio', bio)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Avatar Upload */}
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-muted border-2 border-primary flex items-center justify-center overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-12 h-12 text-zinc-300" />
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-8 h-8 text-white" />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
          <span className="mt-2 block text-[9px] font-black uppercase tracking-widest text-zinc-400 text-center">Update Portrait</span>
        </div>

        {/* Text Fields */}
        <div className="flex-1 w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Full Identity</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-muted border border-border focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
              placeholder="YOUR NAME"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Professional Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-5 py-4 bg-muted border border-border focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest transition-all resize-none"
              placeholder="TELL THE WORLD YOUR STORY..."
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 border-l-4 text-[10px] font-black uppercase tracking-widest ${
          message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-4 pt-8 border-t border-border">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-5 bg-primary text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-zinc-900 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 disabled:bg-zinc-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Transmitting...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Commit Changes
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-10 py-5 border-2 border-foreground text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center gap-3"
        >
          <X className="w-4 h-4" /> Abort
        </button>
      </div>
    </form>
  )
}
