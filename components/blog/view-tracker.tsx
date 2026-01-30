'use client'

import { useEffect, useRef } from 'react'

interface ViewTrackerProps {
    slug: string
}

export function ViewTracker({ slug }: ViewTrackerProps) {
    const tracked = useRef(false)

    useEffect(() => {
        // Only track once per page load
        if (tracked.current) return
        tracked.current = true

        // Check if we've already tracked this in the session
        const sessionKey = `viewed_${slug}`
        if (sessionStorage.getItem(sessionKey)) return

        // Track the view
        fetch(`/api/articles/${slug}/view`, {
            method: 'POST',
        }).catch(console.error)

        // Mark as viewed in session
        sessionStorage.setItem(sessionKey, 'true')
    }, [slug])

    return null
}
