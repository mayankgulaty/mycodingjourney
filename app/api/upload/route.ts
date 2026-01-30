'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ') || authHeader.slice(7) !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' }, { status: 400 })
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large. Max size: 5MB' }, { status: 400 })
        }

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg'
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const filename = `cover-${timestamp}-${randomStr}.${ext}`

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Upload to Supabase Storage
        const supabaseAdmin = createAdminClient()
        const { data, error } = await supabaseAdmin.storage
            .from('blog-images')
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: '31536000', // 1 year cache
                upsert: false
            })

        if (error) {
            console.error('Supabase upload error:', error)
            return NextResponse.json({ error: 'Failed to upload image: ' + error.message }, { status: 500 })
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('blog-images')
            .getPublicUrl(filename)

        return NextResponse.json({
            url: urlData.publicUrl,
            filename: filename
        })
    } catch (err) {
        console.error('Upload error:', err)
        return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 })
    }
}
