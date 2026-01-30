'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Star,
    StarOff,
    LogOut,
    RefreshCw,
    ExternalLink,
    Search,
    Filter,
    FileText,
    TrendingUp,
    Clock,
    Tag,
    X
} from 'lucide-react'
import type { Article } from '@/lib/types'
import { useToast } from '@/components/toast'

export default function AdminDashboard() {
    const { success, error: showError } = useToast()
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authError, setAuthError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Calculate stats
    const stats = useMemo(() => {
        const totalArticles = articles.length
        const publishedCount = articles.filter(a => a.published).length
        const draftCount = articles.filter(a => !a.published).length
        const totalViews = articles.reduce((sum, a) => sum + (a.view_count || 0), 0)
        const featuredCount = articles.filter(a => a.featured).length
        return { totalArticles, publishedCount, draftCount, totalViews, featuredCount }
    }, [articles])

    // Get all unique tags
    const allTags = useMemo(() => {
        const tagSet = new Set<string>()
        articles.forEach(article => {
            (article.tags || []).forEach(tag => tagSet.add(tag))
        })
        return Array.from(tagSet).sort()
    }, [articles])

    // Filter articles
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            // Search filter
            const matchesSearch = !searchQuery || 
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (article.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (article.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            
            // Status filter
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'published' && article.published) ||
                (statusFilter === 'draft' && !article.published)
            
            // Tag filter
            const matchesTag = !selectedTag || (article.tags || []).includes(selectedTag)
            
            return matchesSearch && matchesStatus && matchesTag
        })
    }, [articles, searchQuery, statusFilter, selectedTag])

    // Check for stored auth
    useEffect(() => {
        const storedPassword = sessionStorage.getItem('admin_password')
        if (storedPassword) {
            setPassword(storedPassword)
            setIsAuthenticated(true)
        }
    }, [])

    // Fetch articles when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchArticles()
        }
    }, [isAuthenticated])

    const fetchArticles = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/articles?all=true', {
                headers: {
                    'Authorization': `Bearer ${password}`
                }
            })

            if (response.status === 401) {
                setIsAuthenticated(false)
                sessionStorage.removeItem('admin_password')
                setAuthError('Invalid password')
                return
            }

            const data = await response.json()
            setArticles(data.data || [])
        } catch (error) {
            console.error('Error fetching articles:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError('')
        sessionStorage.setItem('admin_password', password)
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        sessionStorage.removeItem('admin_password')
        setIsAuthenticated(false)
        setPassword('')
        setArticles([])
    }

    const togglePublish = async (article: Article) => {
        try {
            const response = await fetch(`/api/articles/${article.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${password}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ published: !article.published })
            })

            if (response.ok) {
                fetchArticles()
                success(article.published ? 'Article unpublished' : 'Article published successfully!')
            } else {
                showError('Failed to update article')
            }
        } catch (err) {
            console.error('Error toggling publish:', err)
            showError('Failed to update article')
        }
    }

    const toggleFeatured = async (article: Article) => {
        try {
            const response = await fetch(`/api/articles/${article.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${password}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ featured: !article.featured })
            })

            if (response.ok) {
                fetchArticles()
                success(article.featured ? 'Article unfeatured' : 'Article featured!')
            } else {
                showError('Failed to update article')
            }
        } catch (err) {
            console.error('Error toggling featured:', err)
            showError('Failed to update article')
        }
    }

    const deleteArticle = async (article: Article) => {
        if (!confirm(`Are you sure you want to delete "${article.title}"?`)) {
            return
        }

        try {
            const response = await fetch(`/api/articles/${article.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${password}`
                }
            })

            if (response.ok) {
                fetchArticles()
                success('Article deleted successfully')
            } else {
                showError('Failed to delete article')
            }
        } catch (err) {
            console.error('Error deleting article:', err)
            showError('Failed to delete article')
        }
    }

    // Login form
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                        Admin Login
                    </h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                        {authError && (
                            <p className="text-red-500 text-sm">{authError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Article Manager
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchArticles}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => router.push('/admin/new')}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            New Article
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalArticles}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.publishedCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.draftCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles by title, content, or tags..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        {/* Status Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === 'all'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setStatusFilter('published')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === 'published'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                Published
                            </button>
                            <button
                                onClick={() => setStatusFilter('draft')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === 'draft'
                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                Drafts
                            </button>
                        </div>
                        
                        {/* Tags Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                showFilters || selectedTag
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Tag className="w-4 h-4" />
                            Tags
                        </button>
                    </div>
                    
                    {/* Tag Filter */}
                    {showFilters && allTags.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                        !selectedTag
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    All Tags
                                </button>
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                            selectedTag === tag
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Results count */}
                    {(searchQuery || statusFilter !== 'all' || selectedTag) && (
                        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            Showing {filteredArticles.length} of {articles.length} articles
                            {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
                            {selectedTag && <span> tagged with &quot;{selectedTag}&quot;</span>}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            No articles yet. Create your first one!
                        </p>
                        <button
                            onClick={() => router.push('/admin/new')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Article
                        </button>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            No articles found matching your criteria
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setStatusFilter('all')
                                setSelectedTag(null)
                            }}
                            className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tags
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {article.title}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    /{article.slug}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${article.published
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {article.published ? 'Published' : 'Draft'}
                                                </span>
                                                {article.featured && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(article.tags || []).slice(0, 3).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(article.tags || []).length > 3 && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        +{(article.tags || []).length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {article.view_count.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {article.published && (
                                                    <a
                                                        href={`/blog/${article.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                        title="View"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => togglePublish(article)}
                                                    className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title={article.published ? 'Unpublish' : 'Publish'}
                                                >
                                                    {article.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => toggleFeatured(article)}
                                                    className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title={article.featured ? 'Unfeature' : 'Feature'}
                                                >
                                                    {article.featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/${article.id}`)}
                                                    className="p-2 text-gray-400 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteArticle(article)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}
