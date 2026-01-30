import { AlertCircle, Info, Lightbulb, AlertTriangle, XCircle } from 'lucide-react'

type CalloutType = 'info' | 'tip' | 'warning' | 'danger' | 'note'

interface CalloutProps {
    type?: CalloutType
    title?: string
    children: React.ReactNode
}

const calloutStyles: Record<CalloutType, {
    container: string
    icon: React.ReactNode
    title: string
}> = {
    info: {
        container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500',
        icon: <Info className="w-5 h-5 text-blue-500" />,
        title: 'text-blue-700 dark:text-blue-400',
    },
    tip: {
        container: 'bg-green-50 dark:bg-green-900/20 border-green-500',
        icon: <Lightbulb className="w-5 h-5 text-green-500" />,
        title: 'text-green-700 dark:text-green-400',
    },
    warning: {
        container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500',
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        title: 'text-yellow-700 dark:text-yellow-400',
    },
    danger: {
        container: 'bg-red-50 dark:bg-red-900/20 border-red-500',
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        title: 'text-red-700 dark:text-red-400',
    },
    note: {
        container: 'bg-gray-50 dark:bg-gray-800/50 border-gray-400',
        icon: <AlertCircle className="w-5 h-5 text-gray-500" />,
        title: 'text-gray-700 dark:text-gray-300',
    },
}

const defaultTitles: Record<CalloutType, string> = {
    info: 'Info',
    tip: 'Tip',
    warning: 'Warning',
    danger: 'Danger',
    note: 'Note',
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
    const styles = calloutStyles[type]
    const displayTitle = title || defaultTitles[type]

    return (
        <div className={`my-6 rounded-lg border-l-4 p-4 ${styles.container}`}>
            <div className="flex items-center gap-2 mb-2">
                {styles.icon}
                <span className={`font-semibold ${styles.title}`}>{displayTitle}</span>
            </div>
            <div className="text-gray-700 dark:text-gray-300 [&>p]:mb-0">
                {children}
            </div>
        </div>
    )
}
