import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// Create or update a reaction (UP or DOUBLE). Idempotent per user/content.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const { contentType = 'relato', slug, type } = await req.json()
    if (!slug || !type || !['UP', 'DOUBLE'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })

    const reaction = await prisma.reaction.upsert({
      where: { userId_contentType_slug: { userId: user.id, contentType, slug } },
      create: { userId: user.id, contentType, slug, type },
      update: { type },
    })

    return Response.json(reaction)
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}

// Delete reaction
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const { contentType = 'relato', slug } = await req.json()
    if (!slug) return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })

    await prisma.reaction.delete({
      where: { userId_contentType_slug: { userId: user.id, contentType, slug } },
    })

    return new Response(null, { status: 204 })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}

// Get aggregated counts and the current user's reaction
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || ''
  const contentType = searchParams.get('contentType') || 'relato'
  if (!slug) return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 })

  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  try {
    // Si hay usuario, obtener su id para calcular reacción actual y leído en paralelo
    const user = email ? await prisma.user.findUnique({ where: { email } }) : null

    const [counts, currentUserReaction, read] = await Promise.all([
      prisma.reaction.groupBy({
        by: ['type'],
        where: { slug, contentType },
        _count: { _all: true },
      }),
      user
        ? prisma.reaction.findUnique({
            where: { userId_contentType_slug: { userId: user.id, contentType, slug } },
          })
        : null,
      user
        ? prisma.read.findUnique({
            where: { userId_contentType_slug: { userId: user.id, contentType, slug } },
          })
        : null,
    ])

    const up = counts.find((c) => c.type === 'UP')?._count._all || 0
    const double = counts.find((c) => c.type === 'DOUBLE')?._count._all || 0

    return Response.json({
      counts: { up, double },
      userReaction: currentUserReaction?.type || null,
      isRead: Boolean(read),
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
