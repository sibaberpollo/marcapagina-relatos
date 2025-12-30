import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth'
import { prisma } from '@/lib/prisma'
import { corpseWorkflow } from '@/lib/corpseWorkflow'
import { Server } from 'socket.io'
import { rateLimitCorpseActions, createRateLimitError } from '@/lib/rateLimit'

// Store io instance (this would be set up in the socket route)
const io: Server | null = null

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const resolvedParams = await params
    const corpseId = resolvedParams.id

    // Rate limiting for actions
    const rateLimitResult = await rateLimitCorpseActions(user.id)
    if (!rateLimitResult.allowed) {
      const errorResponse = createRateLimitError(rateLimitResult)
      return NextResponse.json(
        {
          error: errorResponse.error,
          code: errorResponse.code,
          retryAfter: errorResponse.retryAfter,
        },
        {
          status: 429,
          headers: errorResponse.headers,
        }
      )
    }

    // Use corpseWorkflow to join
    const result = await corpseWorkflow.joinCorpse(corpseId, user.id, io!)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error joining corpse:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
