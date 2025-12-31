import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    // Find the invitation
    const invitation = await prisma.corpseInvitation.findUnique({
      where: { token },
      include: { corpse: true },
    })

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 400 })
    }

    if (invitation.corpseId !== id) {
      return NextResponse.json({ error: 'Invalid invitation for this corpse' }, { status: 400 })
    }

    if (invitation.status === 'accepted') {
      return NextResponse.redirect(new URL(`/micronarrativas/${id}`, request.url))
    }

    if (invitation.status === 'expired') {
      return NextResponse.json({ error: 'Invitation expired' }, { status: 400 })
    }

    // TODO: Redirect to login or accept invitation
    // For now, just mark as accepted
    await prisma.corpseInvitation.update({
      where: { token },
      data: { status: 'accepted', acceptedAt: new Date() },
    })

    // TODO: Add user to corpse authors

    return NextResponse.redirect(new URL(`/micronarrativas/${id}`, request.url))
  } catch (error) {
    console.error('Invitation accept error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
