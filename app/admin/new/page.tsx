'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    Save,
    Send,
    ArrowLeft,
    Eye,
    EyeOff,
    RefreshCw,
    X,
    Plus,
    Upload,
    Image as ImageIcon,
    Move,
    Trash2
} from 'lucide-react'
import { parseMarkdownPreview } from '@/lib/markdown-preview'

export default function NewArticlePage() {
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [coverImagePosition, setCoverImagePosition] = useState('50% 50%')
    const [published, setPublished] = useState(false)
    const [featured, setFeatured] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const [showPositioner, setShowPositioner] = useState(false)
    const imageContainerRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Get auth from session
    useEffect(() => {
        const storedPassword = sessionStorage.getItem('admin_password')
        if (!storedPassword) {
            router.push('/admin')
            return
        }
        setPassword(storedPassword)
    }, [router])

    // Auto-extract title from content
    useEffect(() => {
        if (!title && content) {
            const match = content.match(/^#\s+(.+)$/m)
            if (match) {
                setTitle(match[1].trim())
            }
        }
    }, [content, title])

    // Auto-generate slug from title
    useEffect(() => {
        if (title && !slug) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            setSlug(generatedSlug)
        }
    }, [title, slug])

    // Auto-extract excerpt from content
    useEffect(() => {
        if (!excerpt && content) {
            const cleanContent = content
                .replace(/^#+\s+.+$/gm, '')
                .replace(/^\s+/gm, '')
                .trim()

            const firstParagraph = cleanContent.split('\n\n')[0] || cleanContent
            const plainText = firstParagraph
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                .replace(/`(.*?)`/g, '$1')
                .trim()

            if (plainText.length > 160) {
                setExcerpt(plainText.substring(0, 157) + '...')
            } else {
                setExcerpt(plainText)
            }
        }
    }, [content, excerpt])

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase()
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag])
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }

    // Handle file upload
    const handleFileUpload = async (file: File) => {
        setUploading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${password}`
                },
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to upload image')
                return
            }

            setCoverImage(data.url)
            setCoverImagePosition('50% 50%') // Reset position for new image
        } catch (err) {
            console.error('Upload error:', err)
            setError('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file)
        }
    }

    // Handle image position drag
    const handlePositionDrag = (e: React.MouseEvent) => {
        if (!isDragging || !imageContainerRef.current) return

        const rect = imageContainerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))

        setCoverImagePosition(`${Math.round(x)}% ${Math.round(y)}%`)
    }

    const handlePositionMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsDragging(true)
        handlePositionDrag(e)
    }

    const handlePositionMouseUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseUp = () => setIsDragging(false)
            window.addEventListener('mouseup', handleGlobalMouseUp)
            return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
        }
    }, [isDragging])

    const removeCoverImage = () => {
        setCoverImage('')
        setCoverImagePosition('50% 50%')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Quick position presets
    const positionPresets = [
        { label: 'Center', value: '50% 50%' },
        { label: 'Top', value: '50% 0%' },
        { label: 'Bottom', value: '50% 100%' },
        { label: 'Left', value: '0% 50%' },
        { label: 'Right', value: '100% 50%' },
    ]

    const saveArticle = async (shouldPublish: boolean) => {
        if (!content.trim()) {
            setError('Content is required')
            return
        }

        if (!title.trim()) {
            setError('Title is required (add a # heading to your content or fill in the title field)')
            return
        }

        setSaving(true)
        setError('')

        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${password}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
                    excerpt: excerpt || undefined,
                    slug: slug || undefined,
                    tags,
                    cover_image: coverImage || undefined,
                    cover_image_position: coverImagePosition,
                    published: shouldPublish,
                    featured
                })
            })

            if (response.status === 401) {
                sessionStorage.removeItem('admin_password')
                router.push('/admin')
                return
            }

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to save article')
                return
            }

            router.push('/admin')
        } catch (err) {
            console.error('Error saving article:', err)
            setError('Failed to save article')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin')}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            New Article
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${showPreview
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            Preview
                        </button>
                        <button
                            onClick={() => saveArticle(false)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            Save Draft
                        </button>
                        <button
                            onClick={() => saveArticle(true)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Publish
                        </button>
                    </div>
                </div>
            </header>

            {/* Error message */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 mt-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                </div>
            )}

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
                    {/* Editor */}
                    <div className={showPreview ? 'lg:col-span-1' : 'lg:col-span-2'}>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Content (Markdown)
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-[60vh] px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    placeholder={`# Your Article Title

Write your article content here using Markdown...

## Code Blocks

\`\`\`javascript
console.log('Hello, World!')
\`\`\`

## Live Code (Interactive)

\`\`\`jsx live
export default function App() {
  return <h1>Hello!</h1>
}
\`\`\`

## Callouts

:::info
This is an info callout.
:::

:::warning
This is a warning callout.
:::`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    {showPreview && (
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sticky top-20 max-h-[80vh] overflow-y-auto">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Preview</h3>
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: parseMarkdownPreview(content)
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4 sticky top-20">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Metadata</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Article title (auto-extracted from # heading)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="url-friendly-slug"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Excerpt
                                </label>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    placeholder="Brief description (auto-extracted from content)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-purple-900 dark:hover:text-purple-200"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Add tag..."
                                    />
                                    <button
                                        onClick={addTag}
                                        className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Cover Image Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cover Image
                                </label>

                                {/* Upload Area */}
                                {!coverImage && (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                                                <span className="text-sm text-gray-500">Uploading...</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                                <span className="text-sm text-gray-500">
                                                    Drop image here or click to upload
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Max 5MB • JPEG, PNG, GIF, WebP
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* URL Input */}
                                {!coverImage && (
                                    <div className="mt-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                                            <span>or enter URL</span>
                                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                                        </div>
                                        <input
                                            type="url"
                                            value={coverImage}
                                            onChange={(e) => setCoverImage(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="https://..."
                                        />
                                    </div>
                                )}

                                {/* Image Preview & Position Controls */}
                                {coverImage && (
                                    <div className="space-y-3">
                                        {/* Preview with position indicator */}
                                        <div
                                            ref={imageContainerRef}
                                            className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                                            style={{ height: '200px' }}
                                            onMouseMove={showPositioner ? handlePositionDrag : undefined}
                                            onMouseUp={handlePositionMouseUp}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={coverImage}
                                                alt="Cover preview"
                                                className="w-full h-full"
                                                style={{
                                                    objectFit: 'cover',
                                                    objectPosition: coverImagePosition
                                                }}
                                            />

                                            {/* Position indicator */}
                                            {showPositioner && (
                                                <div
                                                    className="absolute inset-0 cursor-crosshair"
                                                    onMouseDown={handlePositionMouseDown}
                                                >
                                                    <div className="absolute inset-0 bg-black/30" />
                                                    <div
                                                        className="absolute w-6 h-6 -ml-3 -mt-3 bg-white border-2 border-purple-500 rounded-full shadow-lg flex items-center justify-center"
                                                        style={{
                                                            left: coverImagePosition.split(' ')[0],
                                                            top: coverImagePosition.split(' ')[1]
                                                        }}
                                                    >
                                                        <Move className="w-3 h-3 text-purple-600" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Controls overlay */}
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <button
                                                    onClick={() => setShowPositioner(!showPositioner)}
                                                    className={`p-2 rounded-lg transition-colors ${showPositioner
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-black/50 text-white hover:bg-black/70'
                                                        }`}
                                                    title="Adjust focal point"
                                                >
                                                    <Move className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={removeCoverImage}
                                                    className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    title="Remove image"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Position presets */}
                                        {showPositioner && (
                                            <div className="flex flex-wrap gap-1">
                                                {positionPresets.map((preset) => (
                                                    <button
                                                        key={preset.value}
                                                        onClick={() => setCoverImagePosition(preset.value)}
                                                        className={`px-2 py-1 text-xs rounded transition-colors ${coverImagePosition === preset.value
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {preset.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Replace image */}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                            Replace Image
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={featured}
                                        onChange={(e) => setFeatured(e.target.checked)}
                                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

