import { persistentStorage } from '@/lib/persistentStorage'
import { getRedisClient } from '@/lib/redis'

describe('Persistent Storage', () => {
  const testCorpseId = 'test-corpse-123'
  const testUserId = 'test-user-456'
  const testContent = 'This is a test draft content'

  beforeAll(async () => {
    // Ensure Redis is connected
    const redis = getRedisClient()
    await redis.ping()
  })

  afterAll(async () => {
    // Clean up test data
    try {
      await persistentStorage.clearDraft(testCorpseId, testUserId)
      await persistentStorage.clearTimer(testCorpseId, testUserId)
    } catch (error) {
      // Ignore cleanup errors in tests
    }
  })

  describe('Draft Storage', () => {
    it('should save and retrieve a draft', async () => {
      await persistentStorage.saveDraft(testCorpseId, testUserId, testContent)

      const retrieved = await persistentStorage.getDraft(testCorpseId, testUserId)
      expect(retrieved).toBe(testContent)
    })

    it('should return null for non-existent draft', async () => {
      const retrieved = await persistentStorage.getDraft('non-existent', 'user')
      expect(retrieved).toBeNull()
    })

    it('should clear a draft', async () => {
      await persistentStorage.saveDraft(testCorpseId, testUserId, testContent)
      await persistentStorage.clearDraft(testCorpseId, testUserId)

      const retrieved = await persistentStorage.getDraft(testCorpseId, testUserId)
      expect(retrieved).toBeNull()
    })
  })

  describe('Timer Storage', () => {
    const endTime = new Date(Date.now() + 60000) // 1 minute from now

    it('should save and retrieve a timer', async () => {
      const timeoutId = 'test-timeout-123'
      await persistentStorage.saveTimer(testCorpseId, testUserId, timeoutId, endTime)

      const retrieved = await persistentStorage.getTimer(testCorpseId, testUserId)
      expect(retrieved).toBeTruthy()
      expect(retrieved?.timeoutId).toBe(timeoutId)
      expect(retrieved?.endTime.getTime()).toBe(endTime.getTime())
    })

    it('should return null for non-existent timer', async () => {
      const retrieved = await persistentStorage.getTimer('non-existent', 'user')
      expect(retrieved).toBeNull()
    })

    it('should clear a timer', async () => {
      const timeoutId = 'test-timeout-456'
      await persistentStorage.saveTimer(testCorpseId, testUserId, timeoutId, endTime)
      await persistentStorage.clearTimer(testCorpseId, testUserId)

      const retrieved = await persistentStorage.getTimer(testCorpseId, testUserId)
      expect(retrieved).toBeNull()
    })
  })

  describe('Cleanup Operations', () => {
    it('should cleanup all data for a corpse', async () => {
      // Save test data
      await persistentStorage.saveDraft(testCorpseId, testUserId, testContent)
      const timeoutId = 'cleanup-test-timeout'
      await persistentStorage.saveTimer(
        testCorpseId,
        testUserId,
        timeoutId,
        new Date(Date.now() + 60000)
      )

      // Verify data exists
      const draft = await persistentStorage.getDraft(testCorpseId, testUserId)
      const timer = await persistentStorage.getTimer(testCorpseId, testUserId)
      expect(draft).toBe(testContent)
      expect(timer).toBeTruthy()

      // Cleanup
      await persistentStorage.cleanupCorpse(testCorpseId)

      // Verify data is gone
      const draftAfter = await persistentStorage.getDraft(testCorpseId, testUserId)
      const timerAfter = await persistentStorage.getTimer(testCorpseId, testUserId)
      expect(draftAfter).toBeNull()
      expect(timerAfter).toBeNull()
    })
  })
})
