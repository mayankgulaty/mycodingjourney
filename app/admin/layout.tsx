import { Metadata } from 'next'
import { ToastProvider } from '@/components/toast'

export const metadata: Metadata = {
    title: 'Admin Dashboard | My Coding Journey',
    description: 'Manage articles and content',
    robots: 'noindex, nofollow', // Don't index admin pages
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ToastProvider>
            <div className="fixed inset-0 z-50 bg-gray-100 dark:bg-gray-900 overflow-auto">
                {/* This creates a full-page overlay that hides the site header/footer */}
                {children}
            </div>
        </ToastProvider>
    )
}
