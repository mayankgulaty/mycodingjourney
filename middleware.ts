import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const APEX_HOST = 'mycodingjourney.com'
const CANONICAL_ORIGIN = 'https://www.mycodingjourney.com'

/**
 * Replaces the redirects in vercel.json.
 *
 * 1. Apex host -> www, same path (permanent).
 * 2. /home -> / (permanent), on whatever host served the request.
 *
 * workers.dev and localhost are left alone. Static assets that Workers serves
 * without invoking this Worker are not covered; see MIGRATION.md.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase()
  const { pathname, search } = request.nextUrl

  if (host === APEX_HOST) {
    return NextResponse.redirect(`${CANONICAL_ORIGIN}${pathname}${search}`, 308)
  }

  if (pathname === '/home') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
