/**
 * A/B Testing framework for UI improvements and user experience optimization
 */

import { getRedisClient } from './redis'
import { CORPSE_CONFIG } from './corpseConfig'

export interface ABTestVariant {
  id: string
  name: string
  weight: number // Percentage weight (0-100)
  config?: Record<string, unknown>
}

export interface ABTest {
  id: string
  name: string
  description: string
  variants: ABTestVariant[]
  enabled: boolean
  startDate?: Date
  endDate?: Date
  targetAudience?: {
    userIds?: string[]
    percentage?: number
  }
}

export interface ABTestResult {
  testId: string
  userId: string
  variantId: string
  assignedAt: Date
  completedActions?: string[]
  metadata?: Record<string, any>
}

class ABTestingManager {
  private tests: Map<string, ABTest> = new Map()
  private redis = getRedisClient()

  constructor() {
    this.initializeDefaultTests()
  }

  /**
   * Initialize default A/B tests
   */
  private initializeDefaultTests(): void {
    if (!CORPSE_CONFIG.AB_TESTING.ENABLED) return

    // Timer duration test
    this.createTest({
      id: 'timer-duration',
      name: 'Timer Duration Optimization',
      description: 'Test different timer durations to optimize user engagement',
      variants: [
        { id: 'short', name: '2 minutes', weight: 50, config: { durationSeconds: 120 } },
        { id: 'medium', name: '3 minutes', weight: 30, config: { durationSeconds: 180 } },
        { id: 'long', name: '5 minutes', weight: 20, config: { durationSeconds: 300 } },
      ],
      enabled: true,
    })

    // UI layout test
    this.createTest({
      id: 'contribution-ui',
      name: 'Contribution Interface Layout',
      description: 'Test different UI layouts for the contribution interface',
      variants: [
        { id: 'compact', name: 'Compact Layout', weight: 40, config: { layout: 'compact' } },
        { id: 'spacious', name: 'Spacious Layout', weight: 40, config: { layout: 'spacious' } },
        { id: 'minimal', name: 'Minimal Layout', weight: 20, config: { layout: 'minimal' } },
      ],
      enabled: true,
    })

    // Validation feedback test
    this.createTest({
      id: 'validation-feedback',
      name: 'Content Validation Feedback',
      description: 'Test different approaches to content validation feedback',
      variants: [
        {
          id: 'strict',
          name: 'Strict Validation',
          weight: 50,
          config: { feedbackStyle: 'strict' },
        },
        {
          id: 'encouraging',
          name: 'Encouraging Validation',
          weight: 30,
          config: { feedbackStyle: 'encouraging' },
        },
        {
          id: 'minimal',
          name: 'Minimal Validation',
          weight: 20,
          config: { feedbackStyle: 'minimal' },
        },
      ],
      enabled: true,
    })
  }

  /**
   * Create a new A/B test
   */
  createTest(test: ABTest): void {
    this.tests.set(test.id, test)
  }

  /**
   * Get a test by ID
   */
  getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId)
  }

  /**
   * Assign a user to a test variant
   */
  async assignUserToTest(testId: string, userId: string): Promise<ABTestVariant | null> {
    const test = this.tests.get(testId)
    if (!test || !test.enabled) return null

    // Check if user is already assigned
    const existingAssignment = await this.getUserAssignment(testId, userId)
    if (existingAssignment) {
      return existingAssignment
    }

    // Check target audience
    if (test.targetAudience) {
      if (test.targetAudience.userIds && !test.targetAudience.userIds.includes(userId)) {
        return null
      }

      if (test.targetAudience.percentage) {
        const userHash = this.hashUserId(userId)
        if (userHash > test.targetAudience.percentage) {
          return null
        }
      }
    }

    // Assign variant based on weights
    const variant = this.selectVariantByWeight(test.variants)

    if (variant) {
      // Store assignment in Redis
      const assignment: ABTestResult = {
        testId,
        userId,
        variantId: variant.id,
        assignedAt: new Date(),
      }

      await this.redis.setex(
        `abtest:${testId}:${userId}`,
        CORPSE_CONFIG.AB_TESTING.EXPERIMENT_DURATION_DAYS * 24 * 60 * 60, // days in seconds
        JSON.stringify(assignment)
      )

      console.log(`User ${userId} assigned to variant ${variant.id} in test ${testId}`)
    }

    return variant
  }

  /**
   * Get user's current test assignment
   */
  async getUserAssignment(testId: string, userId: string): Promise<ABTestVariant | null> {
    try {
      const assignmentData = await this.redis.get(`abtest:${testId}:${userId}`)
      if (!assignmentData) return null

      const assignment: ABTestResult = JSON.parse(assignmentData)
      const test = this.tests.get(testId)
      if (!test) return null

      return test.variants.find((v) => v.id === assignment.variantId) || null
    } catch (error) {
      console.error('Error getting user assignment:', error)
      return null
    }
  }

  /**
   * Record an action for a user's test variant
   */
  async recordAction(
    testId: string,
    userId: string,
    action: string,
  metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const assignmentData = await this.redis.get(`abtest:${testId}:${userId}`)
      if (!assignmentData) return

      const assignment: ABTestResult = JSON.parse(assignmentData)
      if (!assignment.completedActions) {
        assignment.completedActions = []
      }

      if (!assignment.completedActions.includes(action)) {
        assignment.completedActions.push(action)
        assignment.metadata = { ...assignment.metadata, ...metadata }

        await this.redis.setex(
          `abtest:${testId}:${userId}`,
          CORPSE_CONFIG.AB_TESTING.EXPERIMENT_DURATION_DAYS * 24 * 60 * 60,
          JSON.stringify(assignment)
        )
      }
    } catch (error) {
      console.error('Error recording action:', error)
    }
  }

  /**
   * Get test results
   */
  async getTestResults(testId: string): Promise<{
    test: ABTest
    variantResults: Array<{
      variant: ABTestVariant
      participantCount: number
      completionRate: number
      actions: Record<string, number>
    }>
  } | null> {
    const test = this.tests.get(testId)
    if (!test) return null

    try {
      const keys = await this.redis.keys(`abtest:${testId}:*`)
      const assignments: ABTestResult[] = []

      for (const key of keys) {
        const data = await this.redis.get(key)
        if (data) {
          assignments.push(JSON.parse(data))
        }
      }

      const variantResults = test.variants.map((variant) => {
        const variantAssignments = assignments.filter((a) => a.variantId === variant.id)
        const participantCount = variantAssignments.length

        const actions: Record<string, number> = {}
        let totalCompletions = 0

        variantAssignments.forEach((assignment) => {
          if (assignment.completedActions) {
            totalCompletions++
            assignment.completedActions.forEach((action) => {
              actions[action] = (actions[action] || 0) + 1
            })
          }
        })

        const completionRate = participantCount > 0 ? totalCompletions / participantCount : 0

        return {
          variant,
          participantCount,
          completionRate,
          actions,
        }
      })

      return {
        test,
        variantResults,
      }
    } catch (error) {
      console.error('Error getting test results:', error)
      return null
    }
  }

  /**
   * Select variant based on weights
   */
  private selectVariantByWeight(variants: ABTestVariant[]): ABTestVariant | null {
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
    if (totalWeight === 0) return null

    let random = Math.random() * totalWeight
    for (const variant of variants) {
      random -= variant.weight
      if (random <= 0) {
        return variant
      }
    }

    return variants[0] // Fallback
  }

  /**
   * Simple hash function for user ID
   */
  private hashUserId(userId: string): number {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100 // Return percentage (0-99)
  }

  /**
   * Get all active tests
   */
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter((test) => test.enabled)
  }

  /**
   * Enable/disable a test
   */
  setTestEnabled(testId: string, enabled: boolean): void {
    const test = this.tests.get(testId)
    if (test) {
      test.enabled = enabled
    }
  }
}

// Singleton instance
export const abTestingManager = new ABTestingManager()

// Convenience functions for common tests
export async function getUserTimerVariant(userId: string): Promise<ABTestVariant | null> {
  return abTestingManager.assignUserToTest('timer-duration', userId)
}

export async function getUserUIVariant(userId: string): Promise<ABTestVariant | null> {
  return abTestingManager.assignUserToTest('contribution-ui', userId)
}

export async function getUserValidationVariant(userId: string): Promise<ABTestVariant | null> {
  return abTestingManager.assignUserToTest('validation-feedback', userId)
}

export async function recordTestAction(
  testId: string,
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  return abTestingManager.recordAction(testId, userId, action, metadata)
}
