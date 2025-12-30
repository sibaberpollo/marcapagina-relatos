import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      reconnectOnError: (err) => {
        console.warn('Redis reconnect on error:', err.message)
        return err.message.includes('READONLY')
      },
    })

    redis.on('connect', () => {
      console.log('Connected to Redis')
    })

    redis.on('error', (err) => {
      console.error('Redis connection error:', err)
    })

    redis.on('close', () => {
      console.log('Redis connection closed')
    })
  }

  return redis
}

export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
  }
}
