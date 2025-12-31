/**
 * Rate limiting utilities for Next.js API routes
 */

import { getRedisClient } from './redis'
import { CORPSE_CONFIG } from './corpseConfig'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
}

export interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  keyPrefix?: string
}

/**
 * Rate limiting implementation using Redis
 */
export class RateLimiter {
  private redis = getRedisClient()

  constructor() {
    // Redis client is initialized
  }

  /**
   * Check if a request should be rate limited
   */
  async checkLimit(identifier: string, options: RateLimitOptions): Promise<RateLimitResult> {
    const { windowMs, maxRequests, keyPrefix = 'ratelimit' } = options
    const key = `${keyPrefix}:${identifier}`
    const now = Date.now()
    const windowStart = now - windowMs

    try {
      // Use Redis pipeline for atomic operations
      const pipeline = this.redis.pipeline()

      // Remove old entries outside the window
      pipeline.zremrangebyscore(key, 0, windowStart)

      // Add current request timestamp
      pipeline.zadd(key, now, now.toString())

      // Count requests in current window
      pipeline.zcount(key, windowStart, now)

      // Set expiry on the key (cleanup)
      pipeline.pexpire(key, windowMs * 2) // Keep key alive for 2x window time

      const results = await pipeline.exec()

      if (!results) {
        // Redis unavailable, allow request
        console.warn('Redis unavailable for rate limiting, allowing request')
        return {
          allowed: true,
          remaining: maxRequests - 1,
          resetTime: now + windowMs,
          limit: maxRequests,
        }
      }

      const requestCount = (results[2]?.[1] as number) || 0

      const allowed = requestCount <= maxRequests
      const remaining = Math.max(0, maxRequests - requestCount)
      const resetTime = now + windowMs

      return {
        allowed,
        remaining,
        resetTime,
        limit: maxRequests,
      }
    } catch (error) {
      console.error('Rate limiting error:', error)
      // On error, allow the request to avoid blocking legitimate users
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
        limit: maxRequests,
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Rate limit middleware for corpse contributions
 */
export async function rateLimitCorpseContributions(
  userId: string,
  corpseId?: string
): Promise<RateLimitResult> {
  const identifier = corpseId ? `${userId}:${corpseId}` : userId

  return rateLimiter.checkLimit(identifier, {
    windowMs: CORPSE_CONFIG.RATE_LIMITS.CORPSE_CONTRIBUTIONS.WINDOW_MS,
    maxRequests: CORPSE_CONFIG.RATE_LIMITS.CORPSE_CONTRIBUTIONS.MAX_REQUESTS,
    keyPrefix: 'corpse-contributions',
  })
}

/**
 * Rate limit middleware for corpse actions (join, vote, skip)
 */
export async function rateLimitCorpseActions(userId: string): Promise<RateLimitResult> {
  return rateLimiter.checkLimit(userId, {
    windowMs: CORPSE_CONFIG.RATE_LIMITS.CORPSE_ACTIONS.WINDOW_MS,
    maxRequests: CORPSE_CONFIG.RATE_LIMITS.CORPSE_ACTIONS.MAX_REQUESTS,
    keyPrefix: 'corpse-actions',
  })
}

/**
 * Rate limit middleware for general API requests
 */
export async function rateLimitApiRequests(ip: string): Promise<RateLimitResult> {
  return rateLimiter.checkLimit(ip, {
    windowMs: CORPSE_CONFIG.RATE_LIMITS.API_REQUESTS.WINDOW_MS,
    maxRequests: CORPSE_CONFIG.RATE_LIMITS.API_REQUESTS.MAX_REQUESTS,
    keyPrefix: 'api-requests',
  })
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  }
}

/**
 * Create rate limit error response
 */
export function createRateLimitError(result: RateLimitResult): {
  error: string
  code: string
  retryAfter: number
  headers: Record<string, string>
} {
  const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000)

  return {
    error: 'Demasiadas solicitudes. Por favor, espera antes de intentar nuevamente.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter,
    headers: {
      ...getRateLimitHeaders(result),
      'Retry-After': retryAfter.toString(),
    },
  }
}
