import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth'
import { prisma } from '@/lib/prisma'
import { corpseWorkflow } from '@/lib/corpseWorkflow'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const corpseId = params.id
    const body = await request.json()
    const { action, content } = body

    // Verify user is authorized for this corpse
    const author = await prisma.corpseAuthor.findFirst({
      where: { corpseId, userId: user.id },
    })
    if (!author) {
      return NextResponse.json({ error: 'Not authorized for this corpse' }, { status: 403 })
    }

    switch (action) {
      case 'save-draft':
        if (typeof content !== 'string') {
          return NextResponse.json({ error: 'Content must be a string' }, { status: 400 })
        }
        corpseWorkflow.saveDraft(corpseId, user.id, content)
        return NextResponse.json({ success: true })

      case 'get-draft': {
        const draft = corpseWorkflow.getDraft(corpseId, user.id)
        return NextResponse.json({ draft: draft || '' })
      }

      case 'clear-draft': {
        corpseWorkflow.clearDraft(corpseId, user.id)
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in contribute API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const corpseId = params.id

    // Verify user is authorized for this corpse
    const author = await prisma.corpseAuthor.findFirst({
      where: { corpseId, userId: user.id },
    })
    if (!author) {
      return NextResponse.json({ error: 'Not authorized for this corpse' }, { status: 403 })
    }

    // Get corpse state (without sensitive info)
    const state = await corpseWorkflow.getCorpseState(corpseId)
    if (!state) {
      return NextResponse.json({ error: 'Corpse not found' }, { status: 404 })
    }

    // Get user's draft
    const draft = corpseWorkflow.getDraft(corpseId, user.id)

    // Return state and draft
    return NextResponse.json({
      state: {
        ...state,
        // Don't expose full queue details, just user's position
        queue: state.queue.map((q) => ({
          userId: q.userId,
          position: q.position,
          hasContributed: q.hasContributed,
          isCurrentUser: q.userId === user.id,
        })),
      },
      draft: draft || '',
      isCurrentContributor: state.currentContributor?.userId === user.id,
    })
  } catch (error) {
    console.error('Error getting corpse state:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
