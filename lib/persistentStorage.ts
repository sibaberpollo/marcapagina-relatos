import { getRedisClient } from '@/lib/redis'

interface DraftData {
  content: string
  lastSaved: string // ISO date string
}

interface TimerData {
  timeoutId: string // We'll store a unique identifier instead of NodeJS.Timeout
  endTime: string // ISO date string
}

class PersistentStorage {
  private redis = getRedisClient()

  // Draft storage keys
  private getDraftKey(corpseId: string, userId: string): string {
    return `corpse:draft:${corpseId}:${userId}`
  }

  // Timer storage keys
  private getTimerKey(corpseId: string, userId: string): string {
    return `corpse:timer:${corpseId}:${userId}`
  }

  // Active timers set key
  private getActiveTimersKey(): string {
    return 'corpse:active_timers'
  }

  // Draft operations
  async saveDraft(corpseId: string, userId: string, content: string): Promise<void> {
    const key = this.getDraftKey(corpseId, userId)
    const data: DraftData = {
      content,
      lastSaved: new Date().toISOString(),
    }

    try {
      await this.redis.set(key, JSON.stringify(data), 'EX', 24 * 60 * 60) // 24 hours TTL
    } catch (error) {
      console.error('Failed to save draft to Redis:', error)
      throw new Error('Failed to save draft')
    }
  }

  async getDraft(corpseId: string, userId: string): Promise<string | null> {
    const key = this.getDraftKey(corpseId, userId)

    try {
      const data = await this.redis.get(key)
      if (!data) return null

      const parsed: DraftData = JSON.parse(data)
      return parsed.content
    } catch (error) {
      console.error('Failed to get draft from Redis:', error)
      return null
    }
  }

  async clearDraft(corpseId: string, userId: string): Promise<void> {
    const key = this.getDraftKey(corpseId, userId)

    try {
      await this.redis.del(key)
    } catch (error) {
      console.error('Failed to clear draft from Redis:', error)
      // Don't throw error for cleanup operations
    }
  }

  // Timer operations
  async saveTimer(
    corpseId: string,
    userId: string,
    timeoutId: string,
    endTime: Date
  ): Promise<void> {
    const timerKey = this.getTimerKey(corpseId, userId)
    const activeTimersKey = this.getActiveTimersKey()

    const data: TimerData = {
      timeoutId,
      endTime: endTime.toISOString(),
    }

    try {
      await this.redis.set(timerKey, JSON.stringify(data))
      await this.redis.sadd(activeTimersKey, timerKey)
    } catch (error) {
      console.error('Failed to save timer to Redis:', error)
      throw new Error('Failed to save timer')
    }
  }

  async getTimer(
    corpseId: string,
    userId: string
  ): Promise<{ timeoutId: string; endTime: Date } | null> {
    const key = this.getTimerKey(corpseId, userId)

    try {
      const data = await this.redis.get(key)
      if (!data) return null

      const parsed: TimerData = JSON.parse(data)
      return {
        timeoutId: parsed.timeoutId,
        endTime: new Date(parsed.endTime),
      }
    } catch (error) {
      console.error('Failed to get timer from Redis:', error)
      return null
    }
  }

  async clearTimer(corpseId: string, userId: string): Promise<void> {
    const timerKey = this.getTimerKey(corpseId, userId)
    const activeTimersKey = this.getActiveTimersKey()

    try {
      await this.redis.del(timerKey)
      await this.redis.srem(activeTimersKey, timerKey)
    } catch (error) {
      console.error('Failed to clear timer from Redis:', error)
      // Don't throw error for cleanup operations
    }
  }

  async getAllActiveTimers(): Promise<
    Array<{ corpseId: string; userId: string; timeoutId: string; endTime: Date }>
  > {
    const activeTimersKey = this.getActiveTimersKey()

    try {
      const timerKeys = await this.redis.smembers(activeTimersKey)
      const timers = await Promise.all(
        timerKeys.map(async (key) => {
          const data = await this.redis.get(key)
          if (!data) return null

          const parsed: TimerData = JSON.parse(data)
          const [, , corpseId, userId] = key.split(':') // Extract from key format: corpse:timer:corpseId:userId

          return {
            corpseId,
            userId,
            timeoutId: parsed.timeoutId,
            endTime: new Date(parsed.endTime),
          }
        })
      )

      return timers.filter(Boolean) as Array<{
        corpseId: string
        userId: string
        timeoutId: string
        endTime: Date
      }>
    } catch (error) {
      console.error('Failed to get all active timers from Redis:', error)
      return []
    }
  }

  // Cleanup operations
  async cleanupCorpse(corpseId: string): Promise<void> {
    try {
      // Clear all drafts for this corpse
      const draftPattern = `corpse:draft:${corpseId}:*`
      const draftKeys = await this.redis.keys(draftPattern)
      if (draftKeys.length > 0) {
        await this.redis.del(...draftKeys)
      }

      // Clear all timers for this corpse
      const timerPattern = `corpse:timer:${corpseId}:*`
      const timerKeys = await this.redis.keys(timerPattern)
      const activeTimersKey = this.getActiveTimersKey()

      if (timerKeys.length > 0) {
        await this.redis.del(...timerKeys)
        await this.redis.srem(activeTimersKey, ...timerKeys)
      }
    } catch (error) {
      console.error('Failed to cleanup corpse from Redis:', error)
      // Don't throw error for cleanup operations
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping()
      return result === 'PONG'
    } catch (error) {
      console.error('Redis ping failed:', error)
      return false
    }
  }
}

export const persistentStorage = new PersistentStorage()
