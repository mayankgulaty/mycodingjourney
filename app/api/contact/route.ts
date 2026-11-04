import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { readEnv } from '@/lib/env'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { siteConfig } from '@/lib/site'

export const runtime = 'nodejs'

// Replaces vercel.json `functions["app/api/contact/route.ts"].maxDuration` (10s).
// Workers do not read maxDuration; CONTACT_TIMEOUT_MS enforces the same budget.
export const maxDuration = 10
const CONTACT_TIMEOUT_MS = 10_000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAILTO = `mailto:${siteConfig.author.email}`

type Msg = { name: string; email: string; message: string; ip: string; userAgent: string }

async function sendWithResend(m: Msg): Promise<boolean> {
  const key = readEnv('RESEND_API_KEY')
  if (!key) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: readEnv('CONTACT_FROM_EMAIL') || 'mycodingjourney contact <onboarding@resend.dev>',
        to: [readEnv('CONTACT_TO_EMAIL') || siteConfig.author.email],
        reply_to: m.email,
        subject: `[mycodingjourney] Message from ${m.name}`,
        text: `From: ${m.name} <${m.email}>\n\n${m.message}`,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) console.error('Resend rejected the contact email, status', res.status)
    return res.ok
  } catch (error) {
    console.error('Resend request failed:', error instanceof Error ? error.message : 'unknown')
    return false
  }
}

async function storeInSupabase(m: Msg): Promise<boolean> {
  try {
    const admin = createAdminClient()
    if (!admin) return false
    const { error } = await admin
      .from('contact_messages')
      .insert({ name: m.name, email: m.email, message: m.message, ip: m.ip, user_agent: m.userAgent })
    if (error) {
      console.error('contact_messages insert failed:', error.code, error.message)
      return false
    }
    return true
  } catch (error) {
    console.error('contact_messages insert failed:', error instanceof Error ? error.message : 'unknown')
    return false
  }
}

export async function POST(request: NextRequest) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<NextResponse>((resolve) => {
    timer = setTimeout(() => {
      resolve(
        NextResponse.json(
          {
            ok: false,
            error: 'The contact form timed out. Please email me directly instead.',
            fallback: MAILTO,
          },
          { status: 504 }
        )
      )
    }, CONTACT_TIMEOUT_MS)
  })

  try {
    return await Promise.race([handleContact(request), timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

async function handleContact(request: NextRequest) {
  const ip = clientIp(request.headers)

  const limited = rateLimit(`contact:${ip}`, 3, 10 * 60_000)
  const globalLimited = rateLimit('contact:global', 40, 60 * 60_000)
  if (!limited.ok || !globalLimited.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter || globalLimited.retryAfter) } }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: real users never see or fill this field. Pretend success to bots, deliver nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true, delivered: false })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const m: Msg = { name, email, message, ip, userAgent: (request.headers.get('user-agent') || '').slice(0, 300) }

  // Delivery: email via Resend if configured, and/or stored in Supabase `contact_messages`.
  const [emailed, stored] = await Promise.all([sendWithResend(m), storeInSupabase(m)])

  if (emailed || stored) {
    return NextResponse.json({ ok: true, delivered: true, via: emailed ? 'email' : 'inbox' })
  }

  // Nothing delivered: say so honestly and hand the visitor a working fallback.
  return NextResponse.json(
    {
      ok: false,
      error: "The contact form isn't connected yet, so your message was NOT sent. Please email me directly instead.",
      fallback: MAILTO,
    },
    { status: 503 }
  )
}
