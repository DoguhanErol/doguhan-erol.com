type Bucket = {
  count: number;
  windowStart: number;
  lockedUntil?: number;
};

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  lockoutMs: number
): { allowed: true } | { allowed: false; retryAfterSec: number } {
  const now = Date.now();
  if (buckets.size > 4000) {
    for (const [bucketKey, bucket] of buckets) {
      const lockExpired = !bucket.lockedUntil || bucket.lockedUntil <= now;
      if (now - bucket.windowStart > windowMs && lockExpired) {
        buckets.delete(bucketKey);
      }
    }
  }

  const existing = buckets.get(key);
  if (existing?.lockedUntil && existing.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((existing.lockedUntil - now) / 1000),
    };
  }

  if (!existing || now - existing.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  const nextCount = existing.count + 1;
  if (nextCount > limit) {
    const lockedUntil = now + lockoutMs;
    buckets.set(key, {
      count: nextCount,
      windowStart: existing.windowStart,
      lockedUntil,
    });
    return {
      allowed: false,
      retryAfterSec: Math.ceil(lockoutMs / 1000),
    };
  }

  buckets.set(key, {
    count: nextCount,
    windowStart: existing.windowStart,
  });
  return { allowed: true };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}
