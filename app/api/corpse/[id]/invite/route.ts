import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { emails } = await request.json()

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'Invalid emails' }, { status: 400 })
    }

    // Verify the corpse exists
    const corpse = await prisma.exquisiteCorpse.findUnique({
      where: { id },
    })

    if (!corpse) {
      return NextResponse.json({ error: 'Corpse not found' }, { status: 404 })
    }

    const invitations: { email: string; token: string; status: string }[] = []

    for (const email of emails) {
      const token = crypto.randomBytes(32).toString('hex')

      // For now, just log the invitation
      console.log(`Invitation for ${email} to corpse ${id} with token ${token}`)

      invitations.push({
        email,
        token,
        status: 'sent',
      })
    }

    return NextResponse.json({ success: true, invitations })
  } catch (error) {
    console.error('Invitation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
