import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { readEnv } from './env'

/**
 * Supabase client for Workers.
 *
 * `@supabase/supabase-js` talks to Supabase over `fetch`, which Workers provide.
 * Sessions are not persisted: there is no `localStorage` in a Worker, and the
 * service-role client must not refresh a user session. Realtime is never opened
 * from these clients (no `.channel()` calls), so the Worker does not hold a
 * WebSocket. `nodejs_compat` covers the Node built-ins the library still imports.
 *
 * Clients are created lazily, on first use inside a request, so missing env does
 * not crash module init or `next build`. Callers treat `null` as "not configured".
 */
function clientOptions() {
  return {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      // Workers global fetch. `global_fetch_strictly_public` keeps this off bindings.
      fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init),
    },
  }
}

let publicClient: SupabaseClient | undefined
let adminClient: SupabaseClient | undefined

export function getSupabase(): SupabaseClient | null {
  const url = readEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!url || !key) return null
  if (!publicClient) publicClient = createClient(url, key, clientOptions())
  return publicClient
}

// Admin client for server-side operations (bypasses RLS).
export function createAdminClient(): SupabaseClient | null {
  const url = readEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = readEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return null
  if (!adminClient) adminClient = createClient(url, key, clientOptions())
  return adminClient
}
