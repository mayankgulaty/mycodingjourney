'use client'

import { useState, useEffect } from 'react'
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
    ExternalLink
} from 'lucide-react'
import type { Article } from '@/lib/types'

export default function AdminDashboard() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authError, setAuthError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

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
            }
        } catch (error) {
            console.error('Error toggling publish:', error)
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
            }
        } catch (error) {
            console.error('Error toggling featured:', error)
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
            }
        } catch (error) {
            console.error('Error deleting article:', error)
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
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12">
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
                                {articles.map((article) => (
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
