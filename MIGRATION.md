# Cloudflare Workers migration

mycodingjourney.com is deployed with [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) 1.20.16 on the Workers free plan. `vercel.json` is gone. Security headers stay in `next.config.js`.

## Next.js version

`@opennextjs/cloudflare@1.20.16` accepts Next `>=15.5.29 <16` or `>=16.4.5`.

This repo was on `next@^16.4.3`, which can install 16.4.3 or 16.4.4. Those patch releases are outside the adapter's peer range. Next 16 itself is supported. `next` and `eslint-config-next` are pinned to **16.4.5**, the current 16.x release the adapter accepts. Nothing was downgraded to 15.

## Build the deployable worker

`wrangler.jsonc` points at `.open-next/worker.js` and `.open-next/assets`. `opennextjs-cloudflare build` runs `npm run build` and then writes that directory. The dry-run command bundles it into `dist-worker/` (the packaged worker, not a second app build).

```bash
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --dry-run --outdir dist-worker
```

Deploy after the OpenNext build (do not deploy `dist-worker/` on its own):

```bash
npx opennextjs-cloudflare deploy
# equivalent, once .open-next/ exists:
npx wrangler deploy
```

Pass `--keep-vars` if secrets were set in the dashboard and a deploy must not delete them:

```bash
npx opennextjs-cloudflare deploy -- --keep-vars
```

Measured with Wrangler 4.157.0 on this commit:

| | |
| --- | --- |
| Total upload (uncompressed) | 9772.92 KiB |
| gzip | 2069.90 KiB (2.02 MiB) |
| `gzip -c dist-worker/worker.js` | 2,117,786 bytes |

That is under the old Workers Free gzip cap of 3 MB. As of 4 September 2026 Cloudflare no longer enforces a gzip limit; the cap is 64 MiB uncompressed on every plan ([changelog](https://developers.cloudflare.com/changelog/post/2026-09-04-increased-worker-size-limit/)). 9772.92 KiB is under that too.

## Worker config

`wrangler.jsonc`:

- name `mycodingjourney`
- `compatibility_date` `2026-11-04`
- flags `nodejs_compat` and `global_fetch_strictly_public`
- `ASSETS` binding to `.open-next/assets`
- `workers_dev`: true
- no `routes`, no custom domain

`workers.dev` is on so the first deploy is `https://mycodingjourney.<account>.workers.dev`. Attach `mycodingjourney.com` / `www.mycodingjourney.com` later in the dashboard or with a separate config change. Do not add routes in this file until that is intentional.

Logs and traces are enabled (`observability.logs` sampled at 1, traces at 0.01).

## Secrets

Read at request time through `readEnv()` in `lib/env.ts` (`process.env[name]`). Direct `process.env.NEXT_PUBLIC_*` reads are inlined at build and would freeze an empty value into the bundle. No secret values are in git.

Set each one with `npx wrangler secret put <NAME>` (or the dashboard). For Workers Builds, set the same names under **Build variables and secrets** so `next build` can prerender articles. Runtime secrets are still required; build variables are not copied into the Worker.

| Name | Required | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL (public and admin clients) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public reads (blog, RSS, sitemap) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Admin CRUD, contact insert, view counts, image upload |
| `ADMIN_PASSWORD` | yes | Bearer token for `/api/articles` and `/api/upload`. Unset means nobody is authorized |
| `RESEND_API_KEY` | yes, for email | `POST /api/contact`. Unset skips email; the route still stores the message if the service role key is set |
| `CONTACT_FROM_EMAIL` | no | Resend `from`. Default `mycodingjourney contact <onboarding@resend.dev>` |
| `CONTACT_TO_EMAIL` | no | Resend `to`. Default is the address in `lib/site.ts` |

Local files (gitignored): `.env.local` for `next dev`, `.dev.vars` for `wrangler dev` / `npm run preview`. Copy `.env.example` and `.dev.vars.example`.

If the public Supabase vars are missing at build, pages still build and the blog is empty. With the R2 binding below, ISR fills them in after deploy. Without R2, that empty prerender stays until the next build that has the vars.

## Bindings Mayank needs to create

Already in `wrangler.jsonc` (nothing to create in the dashboard):

| Binding | What it is |
| --- | --- |
| `ASSETS` | OpenNext static assets, including the build-time ISR cache |
| `WORKER_SELF_REFERENCE` | Service binding to this Worker. The in-isolate revalidation queue calls it. The service name is `mycodingjourney` |

Create this only if time-based ISR should persist between deploys:

| Binding | Resource |
| --- | --- |
| `NEXT_INC_CACHE_R2_BUCKET` | R2 bucket `mycodingjourney-isr` |

```bash
npx wrangler r2 bucket create mycodingjourney-isr
```

Then uncomment the `r2_buckets` block in `wrangler.jsonc` and redeploy. R2's free allowance (10 GB, 1 million Class A ops/month) does not require Workers Paid. Workers KV was not used: the free KV tier allows 1,000 writes/day, and `revalidate = 60` on a single hot page is already 1,440 writes/day. KV is also eventually consistent, which OpenNext advises against.

No Durable Object, D1, or Queues binding. The revalidation queue is OpenNext's memory queue (deduped per isolate only). That is the free-plan option. A Durable Object queue dedupes globally but is not configured here.

If `NEXT_INC_CACHE_R2_BUCKET` is absent, cache reads and writes catch the adapter error and serve the static-assets copy. The site still responds. Pages do not refresh until the next deploy.

`npm run cf-typegen` rewrites `cloudflare-env.d.ts` after the OpenNext build. That file is gitignored because it imports `.open-next/worker`.

## ISR

| Route | `revalidate` |
| --- | --- |
| `/`, `/blog`, `/blog/[slug]`, `/blog/tag/[tag]` | 60 |
| `/playground` | 300 |
| `/rss.xml`, `/sitemap.xml` | 3600 |

OpenNext stores the build-time cache under the `ASSETS` binding (`cdn-cgi/_next_cache`). Runtime updates go to R2 when the binding exists. `enableCacheInterception` is on so a cache hit does not boot the Next server. This app does not use PPR.

Workers Free CPU time is 10 ms per request. Waiting on Supabase or Resend does not count as CPU, but rendering a stale page that misses cache can. The free plan is the target; `limits.cpu_ms` is left unset so a paid account keeps the platform default and a free account is not given a limit it cannot deploy.

## Redirects, headers, contact timeout

Moved out of `vercel.json`:

- `mycodingjourney.com` → `https://www.mycodingjourney.com` (308), same path. In `next.config.js` `redirects()` and in `middleware.ts`. `workers.dev` and localhost are not redirected.
- `/home` → `/` (308), same place.
- `POST /api/contact` budget of 10 seconds. `export const maxDuration = 10` is the Next route config. Workers ignore `maxDuration`, so the handler also races a 10s timer and returns 504. The Resend call still aborts at 8 seconds.

Security headers, including the report-only Content-Security-Policy, stay in `next.config.js` `headers()`. `public/_headers` adds a one-year immutable cache on `/_next/static/*`, because the Worker does not run in front of those files and `headers()` does not apply to them.

Static assets on the apex host are served by Workers Static Assets without invoking the Worker, so the apex redirect does not see them. Pages and `/api/*` do. A zone Redirect Rule is the place to send asset URLs from the apex host to www without billing those requests as Worker invocations.

Next.js 16 prints a warning that `middleware.ts` is deprecated in favor of `proxy.ts`. OpenNext 1.20.16 still bundles `middleware.ts` (`Bundling middleware function...`). The file stays a middleware so the adapter picks it up. The same redirects are in `next.config.js`.

## Images

`images.unoptimized` is set. The Next optimizer shells out to `sharp`, which is not available on Workers. `next/image` renders the original file. Local images are served from static assets. Remote images in MDX already use a plain `<img>`.

## Route handlers

All of these are App Router handlers on the Node.js runtime (`nodejs_compat`). There is no `runtime = 'edge'`.

| Route | Behavior on Workers |
| --- | --- |
| `POST /api/contact` | Resend over `fetch`, then Supabase `contact_messages`. 10s deadline. Fails closed (503 + mailto) when neither delivery works |
| `POST /api/upload` | Admin bearer token, then Supabase Storage `blog-images`. App limit is 5 MB, checked before the body is buffered |
| `/api/articles`, `/api/articles/[id]` | Admin bearer token, service-role client |
| `POST /api/articles/[id]/view` | Service-role RPC `increment_view_count` |
| `GET /rss.xml` | Public client, `revalidate` 3600 |

Upload size: the route rejects anything over 5 MB (`image/jpeg`, `png`, `gif`, `webp`). A request to a Worker on a Free or Pro zone is limited to 100 MB by the zone, not by the Workers plan ([limits](https://developers.cloudflare.com/workers/platform/limits/#request-and-response-limits)). 5 MB is inside that. The upload is one outbound subrequest to Supabase. The free plan allows 50 external subrequests per invocation.

The in-memory rate limiter is unchanged. It is per isolate, same as a single serverless instance. It is not a global limit.

## Supabase on Workers

`@supabase/supabase-js` 2.118 talks to Supabase with `fetch`. `lib/supabase.ts`:

- builds the client on first use inside a request, so a missing env var does not throw at import or fail `next build`
- sets `persistSession`, `autoRefreshToken`, and `detectSessionInUrl` to false (no `localStorage` in a Worker, and the service-role client must not refresh a user session)
- passes the Workers `fetch` (with `global_fetch_strictly_public`, that `fetch` only reaches the public internet)
- never calls `.channel()`, so Realtime does not open a WebSocket

`nodejs_compat` covers the Node built-ins the library still imports (`node:net` / `node:tls` are linked by the bundle; the storage and PostgREST paths used here go through `fetch`). Callers treat a missing URL or key as "not configured" and return empty data or 503/500 instead of throwing at startup.

This environment had no Supabase credentials, so the build was not run against a live project. With the vars unset, `next build` completes and logs `Supabase is not configured`.
