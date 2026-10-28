/** @type {import('next').NextConfig} */

// Security headers are defined here (not in vercel.json) so they travel with the
// app to any host, including Cloudflare Workers.
const csp = [
  "default-src 'self'",
  // Next.js inline bootstrap scripts + MDXRemote/Sandpack need these for now.
  // Tighten (nonces / drop unsafe-eval) as a follow-up once Report-Only is clean.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.codesandbox.io",
  "style-src 'self' 'unsafe-inline' https://*.codesandbox.io",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://*.codesandbox.io",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.codesandbox.io wss://*.codesandbox.io https://*.csb.app",
  "frame-src 'self' https://*.codesandbox.io https://*.csb.app",
  "worker-src 'self' blob:",
  "media-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // X-XSS-Protection is deprecated and can introduce issues in old browsers; "0" disables it.
  { key: 'X-XSS-Protection', value: '0' },
  // Report-Only first so nothing breaks (Sandpack live playgrounds, MDX, Supabase images).
  // Switch the key to 'Content-Security-Policy' once the browser console shows no violations.
  { key: 'Content-Security-Policy-Report-Only', value: csp },
]

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  poweredByHeader: false,
  experimental: {
    mdxRs: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
