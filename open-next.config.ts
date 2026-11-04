import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'
import memoryQueue from '@opennextjs/cloudflare/overrides/queue/memory-queue'
import type {
  CacheEntryType,
  CacheValue,
  IncrementalCache,
  WithLastModified,
} from '@opennextjs/aws/types/overrides.js'

/**
 * ISR cache for the Workers free plan.
 *
 * Build-time prerendered entries live in Workers Static Assets (the `ASSETS`
 * binding OpenNext always creates). That store is read-only, so time-based
 * revalidation (60s / 300s / 3600s) cannot update it.
 *
 * When the `NEXT_INC_CACHE_R2_BUCKET` binding is present, reads prefer the
 * newer of R2 and the static asset, and writes go to R2. R2's free tier covers
 * this. Workers KV's free tier (1,000 writes/day) cannot keep up with a
 * 60-second revalidate. No Durable Object is required.
 *
 * If the R2 binding is missing, the R2 adapter throws and these methods fall
 * back to static assets. Pages still render from the build. They do not refresh
 * until the next deploy.
 *
 * The memory queue dedupes revalidation inside one isolate and calls back
 * through the `WORKER_SELF_REFERENCE` service binding. It needs no paid queue.
 */
class StaticAssetsWithOptionalR2 implements IncrementalCache {
  readonly name = 'static-assets-with-optional-r2'

  async get<CacheType extends CacheEntryType = 'cache'>(
    key: string,
    cacheType?: CacheType,
  ): Promise<WithLastModified<CacheValue<CacheType>> | null> {
    const fromR2 = await this.read(r2IncrementalCache, key, cacheType)
    const fromAssets = await this.read(staticAssetsIncrementalCache, key, cacheType)
    if (fromR2 && fromAssets) {
      const r2Time = fromR2.lastModified ?? 0
      const assetTime = fromAssets.lastModified ?? 0
      return r2Time >= assetTime ? fromR2 : fromAssets
    }
    return fromR2 ?? fromAssets
  }

  async set<CacheType extends CacheEntryType = 'cache'>(
    key: string,
    value: CacheValue<CacheType>,
    cacheType?: CacheType,
  ): Promise<void> {
    try {
      await r2IncrementalCache.set(key, value, cacheType)
    } catch {
      // No R2 binding (or a write failure). The static-assets copy still serves.
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await r2IncrementalCache.delete(key)
    } catch {
      // Nothing was persisted outside the immutable static-assets copy.
    }
  }

  private async read<CacheType extends CacheEntryType = 'cache'>(
    cache: IncrementalCache,
    key: string,
    cacheType?: CacheType,
  ): Promise<WithLastModified<CacheValue<CacheType>> | null> {
    try {
      return await cache.get(key, cacheType)
    } catch {
      return null
    }
  }
}

export default defineCloudflareConfig({
  incrementalCache: new StaticAssetsWithOptionalR2(),
  queue: memoryQueue,
  // Serve a cache hit without booting the Next server. This app does not use PPR.
  enableCacheInterception: true,
})
