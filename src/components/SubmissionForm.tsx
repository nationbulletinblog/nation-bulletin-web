'use client'

import React, { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import Select, { MultiValue, SingleValue } from 'react-select'
import { blogSubmissionSchema, BlogSubmission } from '../lib/validation'
import { submitBlogPost } from '../app/actions/submit-blog'
import { Upload, X, Check, AlertCircle, Image as ImageIcon, Search } from 'lucide-react'

// Dynamic import for React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'

const CATEGORY_OPTIONS = [
  { value: 'Technology', label: 'TECHNOLOGY' },
  { value: 'Economy', label: 'ECONOMY' },
  { value: 'Politics', label: 'POLITICS' },
  { value: 'Culture', label: 'CULTURE' },
  { value: 'Science', label: 'SCIENCE' },
  { value: 'Lifestyle', label: 'LIFESTYLE' },
  { value: 'Opinion', label: 'OPINION' },
]

const TAG_OPTIONS = [
  { value: 'AI', label: '#AI' },
  { value: 'Web3', label: '#WEB3' },
  { value: 'Sustainability', label: '#SUSTAINABLE' },
  { value: 'GlobalGrowth', label: '#GLOBALGROWTH' },
  { value: 'FutureNow', label: '#FUTURENOW' },
  { value: 'Investigative', label: '#INVESTIGATIVE' },
  { value: 'Politics2024', label: '#POLITICS2024' },
  { value: 'DigitalTransformation', label: '#DIGITALTRANSFORMATION' },
  { value: 'Ethics', label: '#ETHICS' },
  { value: 'CultureShock', label: '#CULTURESHOCK' },
]

export const SubmissionForm = () => {
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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
      category: 'Technology',
      tags: []
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
    setStatus({ type: 'loading', message: 'Analyzing and submitting script...' })
    
    // Final check for tags to ensure they are properly formatted as strings
    const result = await submitBlogPost(data)

    if (result.success) {
      setStatus({ type: 'success', message: 'Dispatch received. Our editors will review your script within 24 hours.' })
      reset()
      setPreviewImage(null)
    } else {
      setStatus({ type: 'error', message: result.message })
    }
  }

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  }), [])

  // Custom styles for React Select to match the Editorial Theme
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#f8f8f8',
      borderRadius: '0',
      border: state.isFocused ? '1px solid #910a0a' : '1px solid #eeeeee',
      boxShadow: 'none',
      padding: '8px 12px',
      fontSize: '12px',
      fontWeight: '800',
      fontFamily: 'var(--font-outfit)',
      '&:hover': {
        borderColor: '#910a0a'
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#aaa',
      letterSpacing: '0.1em'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#910a0a' : state.isFocused ? '#fdecea' : 'white',
      color: state.isSelected ? 'white' : '#111',
      fontSize: '10px',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      cursor: 'pointer'
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#910a0a',
      borderRadius: '0',
      padding: '2px 8px'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'white',
      fontSize: '9px',
      fontWeight: '900'
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
    <div className="bg-white border-2 border-primary p-8 md:p-12 shadow-[20px_20px_0px_0px_rgba(145,10,10,0.1)]">
      <div className="mb-12">
         <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Editorial Submission</h2>
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Please provide all mandatory investigative fields below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Author Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Full Identification</label>
            <input
              {...register('authorName')}
              className="w-full px-5 py-4 bg-muted border border-border focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest"
              placeholder="e.g. MARCUS AURELIUS"
            />
            {errors.authorName && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.authorName.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Secure Email Channel</label>
            <input
              {...register('authorEmail')}
              className="w-full px-5 py-4 bg-muted border border-border focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest"
              placeholder="YOUR@SECUREMAIL.COM"
            />
            {errors.authorEmail && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.authorEmail.message}</p>}
          </div>
        </div>

        {/* Global Cataloging */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Story Headline</label>
          <input
            {...register('title')}
            className="w-full px-5 py-4 bg-muted border border-border focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest"
            placeholder="THE FUTURE OF AUTONOMOUS SYSTEMS..."
          />
          {errors.title && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.title.message}</p>}
        </div>

        {/* Searchable Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Primary Sector</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  styles={selectStyles}
                  options={CATEGORY_OPTIONS}
                  value={CATEGORY_OPTIONS.find(opt => opt.value === field.value)}
                  onChange={(val: SingleValue<{value: string, label: string}>) => field.onChange(val?.value)}
                  placeholder="SELECT SECTOR..."
                />
              )}
            />
            {errors.category && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.category.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Sector Tags</label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  styles={selectStyles}
                  options={TAG_OPTIONS}
                  value={TAG_OPTIONS.filter(opt => field.value?.includes(opt.value))}
                  onChange={(vals: MultiValue<{value: string, label: string}>) => field.onChange(vals.map(v => v.value))}
                  placeholder="SELECT MULTIPLE TAGS..."
                />
              )}
            />
            {errors.tags && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.tags.message}</p>}
          </div>
        </div>

        {/* Featured Imagery */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Featured Story Imagery</label>
          <div className={`relative border-2 border-dashed transition-all duration-300 ${previewImage ? 'border-primary' : 'border-zinc-200 hover:border-primary'}`}>
             {previewImage ? (
                <div className="relative aspect-video w-full group overflow-hidden">
                   <img src={previewImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={removeImage}
                        className="p-4 bg-primary text-white hover:bg-zinc-900 transition-colors"
                      >
                         <X className="w-6 h-6" />
                      </button>
                   </div>
                </div>
             ) : (
                <label className="flex flex-col items-center justify-center py-16 cursor-pointer group">
                   <ImageIcon className="w-12 h-12 text-zinc-300 mb-4 group-hover:text-primary transition-colors" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-primary transition-colors">Click or drag image file here</span>
                   <span className="mt-2 text-[8px] font-black text-zinc-300 uppercase">JPEG, PNG Max 5MB</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
             )}
          </div>
        </div>

        {/* Narrative Content (RTE) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-900 border-l-4 border-primary pl-3">Narrative Body</label>
          <div className="editorial-editor transition-all focus-within:border-primary border border-border">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Initiate your investigative report here..."
                />
              )}
            />
          </div>
          {errors.content && <p className="text-primary text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.content.message}</p>}
        </div>

        <div className="pt-8 border-t border-border">
          <button
            type="submit"
            disabled={status.type === 'loading'}
            className={`w-full py-6 text-xs font-black uppercase tracking-[0.3em] transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 ${
              status.type === 'loading'
                ? 'bg-zinc-400 cursor-not-allowed text-zinc-600'
                : 'bg-primary text-white hover:bg-zinc-900'
            }`}
          >
            {status.type === 'loading' ? (
               <>Processing Security Check...</>
            ) : (
               <>Submit Narrative Dispatch <Check className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {status.type !== 'idle' && (
          <div
            className={`mt-10 p-8 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500 ${
              status.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
            }`}
          >
            {status.type === 'success' ? (
               <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
               <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            )}
            <div>
               <h4 className={`text-sm font-black uppercase tracking-widest mb-1 ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {status.type === 'success' ? 'Protocol Accepted' : 'Security Breach / Validation Error'}
               </h4>
               <p className={`text-xs font-medium leading-relaxed ${status.type === 'success' ? 'text-green-600/80' : 'text-red-600/80'}`}>{status.message}</p>
            </div>
          </div>
        )}
      </form>

      <style jsx global>{`
        .editorial-editor .ql-container {
          min-height: 400px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
        }
        .editorial-editor .ql-editor {
          padding: 24px;
        }
        .editorial-editor .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #eeeeee;
          padding: 12px;
        }
        .editorial-editor .ql-container.ql-snow {
          border: none;
        }
        .ql-snow .ql-stroke {
          stroke: #111;
        }
        .ql-snow .ql-picker {
          color: #111;
          font-weight: 800;
        }
        .ql-snow .ql-active .ql-stroke {
          stroke: #910a0a !important;
        }
      `}</style>
    </div>
  )
}
