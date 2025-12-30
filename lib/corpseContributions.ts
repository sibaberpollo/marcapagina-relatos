import { prisma } from './prisma'

export interface CorpseContribution {
  id: string
  corpseId: string
  title: string
  prompt: string | null
  status: string
  contributedAt: Date
  segment: {
    content: string
    wordCount: number
    position: number
  }
}

export interface CorpseContributionStats {
  totalContributions: number
  totalWords: number
  completedCorpses: number
  activeCorpses: number
  averageWordsPerSegment: number
}

export async function getUserCorpseContributions(userId: string): Promise<CorpseContribution[]> {
  try {
    const segments = await prisma.corpseSegment.findMany({
      where: { authorId: userId },
      include: {
        corpse: {
          select: {
            id: true,
            title: true,
            prompt: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return segments.map((segment) => ({
      id: segment.id,
      corpseId: segment.corpse.id,
      title: segment.corpse.title,
      prompt: segment.corpse.prompt,
      status: segment.corpse.status,
      contributedAt: segment.createdAt,
      segment: {
        content: segment.content,
        wordCount: segment.wordCount,
        position: segment.position,
      },
    }))
  } catch (error) {
    console.error('Error fetching user corpse contributions:', error)
    return []
  }
}

export async function getUserCorpseStats(userId: string): Promise<CorpseContributionStats> {
  try {
    const [totalContributions, segments, completedCorpses, activeCorpses] = await Promise.all([
      prisma.corpseSegment.count({ where: { authorId: userId } }),
      prisma.corpseSegment.findMany({
        where: { authorId: userId },
        select: { wordCount: true },
      }),
      prisma.corpseAuthor.count({
        where: {
          userId,
          corpse: { status: 'completed' },
        },
      }),
      prisma.corpseAuthor.count({
        where: {
          userId,
          corpse: { status: 'active' },
        },
      }),
    ])

    const totalWords = segments.reduce((sum, segment) => sum + segment.wordCount, 0)
    const averageWordsPerSegment =
      totalContributions > 0 ? Math.round(totalWords / totalContributions) : 0

    return {
      totalContributions,
      totalWords,
      completedCorpses,
      activeCorpses,
      averageWordsPerSegment,
    }
  } catch (error) {
    console.error('Error fetching user corpse stats:', error)
    return {
      totalContributions: 0,
      totalWords: 0,
      completedCorpses: 0,
      activeCorpses: 0,
      averageWordsPerSegment: 0,
    }
  }
}

export async function getCorpseContributionsByUserSlug(userSlug: string): Promise<{
  contributions: CorpseContribution[]
  stats: CorpseContributionStats
}> {
  try {
    // First get the user ID from the slug (assuming slug matches user ID for now)
    // In a real implementation, you'd need to map author slugs to user IDs
    const contributions = await getUserCorpseContributions(userSlug)
    const stats = await getUserCorpseStats(userSlug)

    return { contributions, stats }
  } catch (error) {
    console.error('Error fetching corpse contributions by user slug:', error)
    return {
      contributions: [],
      stats: {
        totalContributions: 0,
        totalWords: 0,
        completedCorpses: 0,
        activeCorpses: 0,
        averageWordsPerSegment: 0,
      },
    }
  }
}
