import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CorpseMetrics {
  completionRate: number
  totalStories: number
  completedStories: number
  averageWordCount: number
  averageWordsPerSegment: number
  moderationApprovalRate: number
  totalModerations: number
  approvedModerations: number
  averageContributors: number
  averageSubmissionTime: number // in minutes
  abandonmentRate: number
}

export interface CorpseAnalyticsData {
  metrics: CorpseMetrics
  trends: {
    storiesOverTime: Array<{ date: string; count: number }>
    completionRatesOverTime: Array<{ date: string; rate: number }>
    wordCountsOverTime: Array<{ date: string; avgWords: number }>
  }
}

/**
 * Calculate completion rate: percentage of stories that reach completed status
 */
export async function getCompletionRate(): Promise<{
  total: number
  completed: number
  rate: number
}> {
  const totalStories = await prisma.exquisiteCorpse.count()
  const completedStories = await prisma.exquisiteCorpse.count({
    where: { status: 'completed' },
  })

  const rate = totalStories > 0 ? (completedStories / totalStories) * 100 : 0

  return {
    total: totalStories,
    completed: completedStories,
    rate: Math.round(rate * 100) / 100, // Round to 2 decimal places
  }
}

/**
 * Calculate average word counts across all stories
 */
export async function getAverageWordCounts(): Promise<{ total: number; perSegment: number }> {
  const segments = await prisma.corpseSegment.findMany({
    select: { wordCount: true },
  })

  if (segments.length === 0) return { total: 0, perSegment: 0 }

  const totalWords = segments.reduce((sum, seg) => sum + seg.wordCount, 0)
  const avgPerSegment = totalWords / segments.length

  return {
    total: totalWords,
    perSegment: Math.round(avgPerSegment * 100) / 100,
  }
}

/**
 * Get moderation statistics
 */
export async function getModerationStats(): Promise<{
  total: number
  approved: number
  rejected: number
  approvalRate: number
}> {
  const moderations = await prisma.corpseModeration.findMany({
    select: { decision: true },
  })

  const total = moderations.length
  const approved = moderations.filter((m) => m.decision === 'approved').length
  const rejected = total - approved
  const approvalRate = total > 0 ? (approved / total) * 100 : 0

  return {
    total,
    approved,
    rejected,
    approvalRate: Math.round(approvalRate * 100) / 100,
  }
}

/**
 * Calculate average number of contributors per story
 */
export async function getAverageContributors(): Promise<number> {
  const stories = await prisma.exquisiteCorpse.findMany({
    include: {
      authors: {
        select: { id: true },
      },
    },
  })

  if (stories.length === 0) return 0

  const totalContributors = stories.reduce((sum, story) => sum + story.authors.length, 0)
  const avgContributors = totalContributors / stories.length

  return Math.round(avgContributors * 100) / 100
}

/**
 * Calculate average submission time (time between first and last segment)
 */
export async function getAverageSubmissionTime(): Promise<number> {
  const stories = await prisma.exquisiteCorpse.findMany({
    where: { status: 'completed' },
    include: {
      segments: {
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (stories.length === 0) return 0

  const completionTimes = stories
    .filter((story) => story.segments.length > 1)
    .map((story) => {
      const firstSegment = story.segments[0]
      const lastSegment = story.segments[story.segments.length - 1]
      const duration = lastSegment.createdAt.getTime() - firstSegment.createdAt.getTime()
      return duration / (1000 * 60) // Convert to minutes
    })

  if (completionTimes.length === 0) return 0

  const avgTime = completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
  return Math.round(avgTime * 100) / 100
}

/**
 * Calculate abandonment rate (stories that started but never completed)
 */
export async function getAbandonmentRate(): Promise<{
  abandoned: number
  total: number
  rate: number
}> {
  const totalStories = await prisma.exquisiteCorpse.count({
    where: {
      status: { in: ['active', 'ended', 'pending_moderation'] },
    },
  })

  const activeStories = await prisma.exquisiteCorpse.count({
    where: { status: 'active' },
  })

  // Abandoned = total non-completed - active (assuming ended/pending are waiting)
  const abandoned = totalStories - activeStories
  const rate = totalStories > 0 ? (abandoned / totalStories) * 100 : 0

  return {
    abandoned,
    total: totalStories,
    rate: Math.round(rate * 100) / 100,
  }
}

/**
 * Get stories over time (last 30 days)
 */
export async function getStoriesOverTime(
  days: number = 30
): Promise<Array<{ date: string; count: number }>> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  const stories = await prisma.exquisiteCorpse.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  const dateMap = new Map<string, number>()

  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    dateMap.set(dateStr, 0)
  }

  // Count stories per date
  stories.forEach((story) => {
    const dateStr = story.createdAt.toISOString().split('T')[0]
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
  })

  return Array.from(dateMap.entries()).map(([date, count]) => ({ date, count }))
}

/**
 * Get completion rates over time
 */
export async function getCompletionRatesOverTime(
  days: number = 30
): Promise<Array<{ date: string; rate: number }>> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  const stories = await prisma.exquisiteCorpse.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { createdAt: true, status: true },
    orderBy: { createdAt: 'asc' },
  })

  const dateMap = new Map<string, { total: number; completed: number }>()

  // Initialize all dates
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    dateMap.set(dateStr, { total: 0, completed: 0 })
  }

  // Count per date
  stories.forEach((story) => {
    const dateStr = story.createdAt.toISOString().split('T')[0]
    const current = dateMap.get(dateStr) || { total: 0, completed: 0 }
    current.total++
    if (story.status === 'completed') {
      current.completed++
    }
    dateMap.set(dateStr, current)
  })

  return Array.from(dateMap.entries()).map(([date, stats]) => ({
    date,
    rate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
  }))
}

/**
 * Get average word counts over time
 */
export async function getWordCountsOverTime(
  days: number = 30
): Promise<Array<{ date: string; avgWords: number }>> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  const segments = await prisma.corpseSegment.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { createdAt: true, wordCount: true },
    orderBy: { createdAt: 'asc' },
  })

  const dateMap = new Map<string, { total: number; count: number }>()

  // Initialize all dates
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    dateMap.set(dateStr, { total: 0, count: 0 })
  }

  // Aggregate per date
  segments.forEach((segment) => {
    const dateStr = segment.createdAt.toISOString().split('T')[0]
    const current = dateMap.get(dateStr) || { total: 0, count: 0 }
    current.total += segment.wordCount
    current.count++
    dateMap.set(dateStr, current)
  })

  return Array.from(dateMap.entries()).map(([date, stats]) => ({
    date,
    avgWords: stats.count > 0 ? stats.total / stats.count : 0,
  }))
}

/**
 * Get all analytics data
 */
export async function getCorpseAnalytics(): Promise<CorpseAnalyticsData> {
  const [
    completionStats,
    wordStats,
    moderationStats,
    avgContributors,
    avgSubmissionTime,
    abandonmentStats,
    storiesOverTime,
    completionRatesOverTime,
    wordCountsOverTime,
  ] = await Promise.all([
    getCompletionRate(),
    getAverageWordCounts(),
    getModerationStats(),
    getAverageContributors(),
    getAverageSubmissionTime(),
    getAbandonmentRate(),
    getStoriesOverTime(),
    getCompletionRatesOverTime(),
    getWordCountsOverTime(),
  ])

  return {
    metrics: {
      completionRate: completionStats.rate,
      totalStories: completionStats.total,
      completedStories: completionStats.completed,
      averageWordCount: wordStats.total,
      averageWordsPerSegment: wordStats.perSegment,
      moderationApprovalRate: moderationStats.approvalRate,
      totalModerations: moderationStats.total,
      approvedModerations: moderationStats.approved,
      averageContributors: avgContributors,
      averageSubmissionTime: avgSubmissionTime,
      abandonmentRate: abandonmentStats.rate,
    },
    trends: {
      storiesOverTime,
      completionRatesOverTime,
      wordCountsOverTime,
    },
  }
}
