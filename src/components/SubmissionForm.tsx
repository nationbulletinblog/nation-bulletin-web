'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import Select, { MultiValue, SingleValue } from 'react-select'
import { blogSubmissionSchema, BlogSubmission } from '../lib/validation'
import { submitBlogPost } from '../app/actions/submit-blog'
import { fetchCategories, fetchTags } from '../app/actions/blog'
import { client } from '@/lib/sanity.client'
import { Upload, X, Check, AlertCircle, Image as ImageIcon, Send, Type, Hash, Layers } from 'lucide-react'
import { Session } from 'next-auth'

// Dynamic import for React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'

export const SubmissionForm = ({ session }: { session: Session }) => {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])
  const [tags, setTags] = useState<{ value: string; label: string }[]>([])
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, tagData] = await Promise.all([
          fetchCategories(),
          fetchTags()
        ])
        setCategories(catData)
        setTags(tagData)
      } catch (error) {
        console.error('Error fetching categories/tags:', error)
      }
    }
    fetchData()
  }, [])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<BlogSubmission>({
    resolver: zodResolver(blogSubmissionSchema),
    defaultValues: {
      content: '',
      category: '',
      tags: [],
      authorName: session.user?.name || '',
      authorEmail: session.user?.email || '',
      seoTitle: '',
      seoDescription: '',
      imageAlt: '',
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        setValue('mainImage', file)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    setValue('mainImage', undefined)
  }

  const onSubmit = async (data: BlogSubmission) => {
    setStatus({ type: 'loading', message: 'Preparing your article for review...' })
    
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('authorName', data.authorName)
    formData.append('authorEmail', data.authorEmail)
    formData.append('category', data.category)
    if (data.seoTitle) formData.append('seoTitle', data.seoTitle)
    if (data.seoDescription) formData.append('seoDescription', data.seoDescription)
    if (data.imageAlt) formData.append('imageAlt', data.imageAlt)
    data.tags.forEach(tag => formData.append('tags', tag))
    
    if (data.mainImage) {
      formData.append('mainImage', data.mainImage as Blob)
    }

    const result = await submitBlogPost(formData as any)

    if (result.success) {
      setStatus({ type: 'success', message: 'Thank you! Your article has been received. Our editorial team will review it shortly.' })
      reset()
      setPreviewImage(null)
    } else {
      setStatus({ type: 'error', message: result.message })
    }
  }

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
    clipboard: {
      matchVisual: false, // Prevents extra newlines when pasting
    }
  }), [])

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      border: state.isFocused ? '1px solid #910a0a' : '1px solid #e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(145, 10, 10, 0.05)' : 'none',
      padding: '6px 12px',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#910a0a'
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#910a0a' : state.isFocused ? '#fdecea' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer'
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#910a0a',
      borderRadius: '6px',
      padding: '2px 8px'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'white',
      fontSize: '11px',
      fontWeight: '700'
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'white',
      '&:hover': {
        backgroundColor: '#111',
        color: 'white'
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-zinc-100 p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
      
      <div className="mb-10 text-left">
         <h2 className="text-2xl font-black tracking-tight text-zinc-900 mb-2">Editorial Console</h2>
         <p className="text-sm font-medium text-zinc-500">Provide your article details below for editorial review.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Author Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
            <input
              {...register('authorName')}
              placeholder="e.g. John Doe"
              className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
            <input
              {...register('authorEmail')}
              placeholder="name@company.com"
              className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Article Headline</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Type className="h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              {...register('title')}
              className="w-full pl-11 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all duration-300 placeholder:text-zinc-300"
              placeholder="e.g. How Technology is Reshaping Education..."
            />
          </div>
          {errors.title && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.title.message}</p>}
        </div>

        {/* Categorization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  styles={selectStyles}
                  options={categories}
                  value={categories.find(opt => opt.value === field.value)}
                  onChange={(val: SingleValue<{value: string, label: string}>) => field.onChange(val?.value)}
                  placeholder="Select a category..."
                />
              )}
            />
            {errors.category && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Tags</label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  styles={selectStyles}
                  options={tags}
                  value={tags.filter(opt => field.value?.includes(opt.value))}
                  onChange={(vals: MultiValue<{value: string, label: string}>) => field.onChange(vals.map(v => v.value))}
                  placeholder="Add relevant tags..."
                />
              )}
            />
            {errors.tags && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.tags.message}</p>}
          </div>
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Featured Image</label>
          <div className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${previewImage ? 'border-primary' : 'border-zinc-200 hover:border-primary'}`}>
             {previewImage ? (
                <div className="relative aspect-video w-full group overflow-hidden rounded-2xl">
                   <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={removeImage}
                        className="p-4 bg-primary text-white rounded-xl hover:bg-zinc-900 transition-colors shadow-xl"
                      >
                         <X className="w-6 h-6" />
                      </button>
                   </div>
                </div>
             ) : (
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer group">
                   <ImageIcon className="w-12 h-12 text-zinc-300 mb-3 group-hover:text-primary transition-colors" />
                   <span className="text-xs font-bold text-zinc-500 group-hover:text-primary transition-colors">Click to upload featured image</span>
                   <span className="mt-1 text-[10px] font-medium text-zinc-400 uppercase">Recommended: 1200x630 (Max 5MB)</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
             )}
          </div>
        
        {/* Image Alt Text */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Image Alt Text (SEO)</label>
          <input
            {...register('imageAlt')}
            placeholder="Describe the image for accessibility and SEO..."
            className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
          />
        </div>
        </div>

        {/* SEO Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
           <div className="space-y-2">
             <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Meta Title</label>
             <input
               {...register('seoTitle')}
               placeholder="e.g. 5 Ways Technology is Changing Education..."
               className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
             />
           </div>

           <div className="space-y-2">
             <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Meta Description</label>
             <textarea
               {...register('seoDescription')}
               placeholder="Write a compelling description for search engines..."
               rows={2}
               className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 resize-none"
             />
           </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <div className="flex justify-between items-end ml-1">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Article Content</label>
            <div className="flex gap-4 text-[9px] font-bold uppercase tracking-tight text-zinc-400">
               <span>Min 800 Words</span>
               <span>Max 1 Link</span>
               <span className="text-primary/70">No Adult/Gambling</span>
            </div>
          </div>
          <div className="editorial-editor transition-all focus-within:border-primary border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Share your story with the world..."
                />
              )}
            />
          </div>
          {errors.content && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.content.message}</p>}
        </div>

        <div className="pt-6 border-t border-zinc-100">
          <button
            type="submit"
            disabled={status.type === 'loading'}
            className={`w-full py-5 text-sm font-bold tracking-wide transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 rounded-xl shadow-xl hover:shadow-zinc-900/20 ${
              status.type === 'loading'
                ? 'bg-zinc-300 cursor-not-allowed text-zinc-500'
                : 'bg-zinc-900 text-white hover:bg-primary'
            }`}
          >
            {status.type === 'loading' ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
               <>
                 <span>Submit for Review</span>
                 <Send className="w-4 h-4" />
               </>
            )}
          </button>
        </div>

        {(status.type === 'success' || status.type === 'error') && (
          <div
            className={`mt-8 p-6 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500 border ${
              status.type === 'success' ? 'bg-green-50/50 border-green-100 text-green-800' : 'bg-red-50/50 border-red-100 text-red-800'
            }`}
          >
            {status.type === 'success' ? (
               <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center flex-shrink-0"><Check className="w-5 h-5" /></div>
            ) : (
               <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center flex-shrink-0"><AlertCircle className="w-5 h-5" /></div>
            )}
            <div>
               <h4 className="text-sm font-black uppercase tracking-tight mb-1">
                  {status.type === 'success' ? 'Submission Received' : 'Error Occurred'}
               </h4>
               <p className="text-xs font-medium leading-relaxed opacity-80">{status.message}</p>
            </div>
          </div>
        )}
      </form>

      <style jsx global>{`
        .editorial-editor .ql-container {
          min-height: 350px;
          font-family: var(--font-sans), sans-serif;
          font-size: 15px;
          color: #374151;
        }
        .editorial-editor .ql-editor {
          padding: 24px;
          line-height: 1.6;
        }
        .editorial-editor .ql-toolbar.ql-snow {
          border: none;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px;
        }
        .editorial-editor .ql-container.ql-snow {
          border: none;
          background-color: white;
        }
        .ql-snow .ql-stroke {
          stroke: #4b5563;
        }
        .ql-snow .ql-picker {
          color: #4b5563;
          font-weight: 600;
        }
        .ql-snow .ql-active .ql-stroke {
          stroke: #910a0a !important;
        }
      `}</style>
    </div>
  )
}
