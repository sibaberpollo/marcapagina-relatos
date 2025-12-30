/**
 * Configuration constants for the corpse workflow system
 */

export const CORPSE_CONFIG = {
  // Timer settings
  TIMER_DURATION_SECONDS: 120, // 2 minutes
  TIMER_DURATION_MS: 120 * 1000, // 2 minutes in milliseconds

  // Voting settings
  VOTING_THRESHOLD_PERCENTAGE: 60, // 60% of authors need to vote to end

  // Content validation settings
  CONTENT_VALIDATION: {
    MIN_WORDS: 50,
    MAX_WORDS: 100,
    MAX_CONTENT_LENGTH: 10000, // Maximum characters allowed
  },

  // Rate limiting settings
  RATE_LIMITS: {
    CORPSE_CONTRIBUTIONS: {
      WINDOW_MS: 60 * 1000, // 1 minute
      MAX_REQUESTS: 10, // Max 10 contributions per minute per user
    },
    CORPSE_ACTIONS: {
      WINDOW_MS: 30 * 1000, // 30 seconds
      MAX_REQUESTS: 20, // Max 20 actions (join, vote, skip) per 30 seconds
    },
    API_REQUESTS: {
      WINDOW_MS: 60 * 1000, // 1 minute
      MAX_REQUESTS: 100, // Max 100 API requests per minute per IP
    },
  },

  // WebSocket monitoring settings
  WEBSOCKET_METRICS: {
    ENABLED: true,
    CONNECTION_TIMEOUT_MS: 30000, // 30 seconds
    HEARTBEAT_INTERVAL_MS: 25000, // 25 seconds
  },

  // A/B testing settings
  AB_TESTING: {
    ENABLED: true,
    EXPERIMENT_DURATION_DAYS: 30,
    SAMPLE_SIZE_MINIMUM: 100,
  },
} as const

/**
 * Calculate voting threshold for a given number of authors
 */
export function calculateVotingThreshold(totalAuthors: number): number {
  return Math.ceil(totalAuthors * (CORPSE_CONFIG.VOTING_THRESHOLD_PERCENTAGE / 100))
}

/**
 * Get timer duration in milliseconds
 */
export function getTimerDurationMs(): number {
  return CORPSE_CONFIG.TIMER_DURATION_MS
}

/**
 * Get timer duration in seconds
 */
export function getTimerDurationSeconds(): number {
  return CORPSE_CONFIG.TIMER_DURATION_SECONDS
}
