import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type LimitResult = { allowed: boolean; retryAfterMs: number };

function createLimiter(max: number, windowSeconds: number): {
  check: (key: string) => Promise<LimitResult>;
} {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = Redis.fromEnv();
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowSeconds} s`),
      analytics: false,
    });
    return {
      async check(key: string): Promise<LimitResult> {
        const result = await limiter.limit(key);
        return {
          allowed: result.success,
          retryAfterMs: result.success ? 0 : Math.max(0, result.reset - Date.now()),
        };
      },
    };
  }

  // In-memory fallback — resets on process restart, not suitable for Vercel serverless.
  // Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN for persistent rate limiting.
  const store = new Map<string, { count: number; resetAt: number }>();
  const windowMs = windowSeconds * 1_000;
  return {
    async check(key: string): Promise<LimitResult> {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || now >= entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterMs: 0 };
      }
      if (entry.count >= max) {
        return { allowed: false, retryAfterMs: entry.resetAt - now };
      }
      entry.count++;
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}

export const loginLimiter = createLimiter(5, 60);
export const registerLimiter = createLimiter(3, 60);
export const exportLimiter = createLimiter(10, 60);
