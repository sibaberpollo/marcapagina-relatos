import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth'
import { prisma } from '@/lib/prisma'
import { corpseWorkflow } from '@/lib/corpseWorkflow'

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

    // Verify user is authorized for this corpse
    const author = await prisma.corpseAuthor.findFirst({
      where: { corpseId, userId: user.id },
    })
    if (!author) {
      return NextResponse.json({ error: 'Not authorized for this corpse' }, { status: 403 })
    }

    // Check if user has already voted
    if (author.voteToEnd) {
      return NextResponse.json({ error: 'Already voted to end' }, { status: 400 })
    }

    // Use workflow to handle voting
    const result = await corpseWorkflow.voteToEnd(corpseId, user.id)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      votesToEnd: result.votesToEnd,
      totalAuthors: result.totalAuthors,
      threshold: result.threshold,
      ended: result.ended,
    })
  } catch (error) {
    console.error('Error in vote API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Verify user is authorized for this corpse
    const author = await prisma.corpseAuthor.findFirst({
      where: { corpseId, userId: user.id },
    })
    if (!author) {
      return NextResponse.json({ error: 'Not authorized for this corpse' }, { status: 403 })
    }

    // Get voting status with user-specific info
    const votingStatus = await corpseWorkflow.getVotingStatus(corpseId, user.id)

    return NextResponse.json(votingStatus)
  } catch (error) {
    console.error('Error getting voting status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
