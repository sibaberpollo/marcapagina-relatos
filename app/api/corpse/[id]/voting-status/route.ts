import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth'
import { prisma } from '@/lib/prisma'
import { corpseWorkflow } from '@/lib/corpseWorkflow'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user?.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        })
      : null

    const resolvedParams = await params
    const corpseId = resolvedParams.id

    const votingStatus = await corpseWorkflow.getVotingStatus(corpseId, user?.id)

    return NextResponse.json(votingStatus)
  } catch (error) {
    console.error('Error getting voting status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
