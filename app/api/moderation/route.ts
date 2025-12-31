import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'
import { ModerationDecision, CorpseStatus } from '@prisma/client'

// GET /api/moderation - Get pending moderations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get corpses pending moderation
    const pendingCorpses = await prisma.exquisiteCorpse.findMany({
      where: {
        status: CorpseStatus.pending_moderation,
      },
      include: {
        segments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { position: 'asc' },
        },
        authors: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        moderation: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate quality metrics for each corpse
    const corpsesWithMetrics = pendingCorpses.map((corpse) => {
      const totalWords = corpse.segments.reduce((sum, segment) => sum + segment.wordCount, 0)
      const avgWordsPerSegment = totalWords / corpse.segments.length
      const uniqueAuthors = new Set(corpse.segments.map((s) => s.authorId)).size
      const completionTime = corpse.endedAt
        ? corpse.endedAt.getTime() - corpse.createdAt.getTime()
        : null

      return {
        ...corpse,
        metrics: {
          totalWords,
          avgWordsPerSegment: Math.round(avgWordsPerSegment),
          uniqueAuthors,
          completionTime: completionTime ? Math.round(completionTime / (1000 * 60)) : null, // minutes
          segmentsCount: corpse.segments.length,
        },
      }
    })

    return NextResponse.json(corpsesWithMetrics)
  } catch (error) {
    console.error('Error fetching pending moderations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/moderation - Moderate a corpse (approve/reject)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { corpseId, decision, feedback, reason } = body

    if (!corpseId || !decision) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['approved', 'rejected'].includes(decision)) {
      return NextResponse.json({ error: 'Invalid decision' }, { status: 400 })
    }

    // Get the corpse with segments
    const corpse = await prisma.exquisiteCorpse.findUnique({
      where: { id: corpseId },
      include: {
        segments: {
          include: { author: true },
          orderBy: { position: 'asc' },
        },
        authors: {
          include: { user: true },
        },
      },
    })

    if (!corpse) {
      return NextResponse.json({ error: 'Corpse not found' }, { status: 404 })
    }

    if (corpse.status !== CorpseStatus.pending_moderation) {
      return NextResponse.json({ error: 'Corpse is not pending moderation' }, { status: 400 })
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create moderation record
      const moderation = await tx.corpseModeration.create({
        data: {
          corpseId,
          moderatorId: user.id,
          decision: decision as ModerationDecision,
          feedback: feedback || null,
          reason: reason || null,
        },
      })

      let transtextosId: string | null = null

      if (decision === 'approved') {
        // Update corpse status
        await tx.exquisiteCorpse.update({
          where: { id: corpseId },
          data: { status: 'completed' },
        })

        // Create Transtextos post
        transtextosId = await createTranstextosPost(corpse, tx)

        // Update moderation with Transtextos ID
        if (transtextosId) {
          await tx.corpseModeration.update({
            where: { id: moderation.id },
            data: { transtextosId },
          })
        }
      } else {
        // For rejected corpses, mark as ended
        await tx.exquisiteCorpse.update({
          where: { id: corpseId },
          data: { status: 'ended' },
        })

        // Send feedback emails to contributors
        await sendRejectionFeedback(corpse, feedback, reason)
      }

      return { moderation, transtextosId }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error moderating corpse:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

interface CorpseData {
  id: string
  title: string
  prompt?: string | null
  segments: Array<{
    content: string
    author: {
      name: string | null
      id: string
    }
  }>
  authors: Array<{
    user: {
      email: string | null
    }
  }>
}

async function createTranstextosPost(corpse: CorpseData, tx: unknown): Promise<string | null> {
  try {
    // Combine all segments into the full story
    const fullContent = corpse.segments.map((segment) => segment.content.trim()).join('\n\n')

    // Get author names for credits
    const authorNames = [
      ...new Set(
        corpse.segments.map((s) => s.author.name).filter((name): name is string => name !== null)
      ),
    ]

    // Use Sanity client to create Transtextos post
    const { client } = await import('@/lib/sanity')

    const transtextosPost = {
      _type: 'relato',
      title: `Cadáver Exquisito: ${corpse.title}`,
      slug: {
        _type: 'slug',
        current: `cadaver-exquisito-${corpse.id}`,
      },
      summary: `Historia colaborativa creada por ${authorNames.join(', ')}. ${corpse.prompt ? `Prompt inicial: "${corpse.prompt}"` : ''}`,
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: fullContent,
            },
          ],
        },
      ],
      publishedAt: new Date().toISOString(),
      date: new Date().toISOString(),
      status: 'published',
      author: {
        _type: 'reference',
        _ref: corpse.segments[0]?.author?.id || 'author-default',
      },
      tags: ['colaborativo', 'cadáver exquisito', 'micronarrativa'],
      bgColor: '#efa106',
      showDropCap: false,
    }

    const createdPost = await client.create(transtextosPost)
    return createdPost._id
  } catch (error) {
    console.error('Error creating Transtextos post:', error)
    return null
  }
}

async function sendRejectionFeedback(corpse: CorpseData, feedback?: string, reason?: string) {
  // This would integrate with your existing email system
  // For now, just log it
  console.log(`Rejection feedback for corpse ${corpse.id}:`, {
    feedback,
    reason,
    contributors: corpse.authors.map((a) => a.user.email),
  })

  // TODO: Implement actual email sending using your email service
}
