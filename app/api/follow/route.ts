import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { authorSlug } = await req.json().catch(() => ({}))
  if (!authorSlug || typeof authorSlug !== 'string') {
    return NextResponse.json({ error: 'authorSlug requerido' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  await prisma.follow.upsert({
    where: { userId_authorSlug: { userId: user.id, authorSlug } },
    update: {},
    create: { userId: user.id, authorSlug },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const authorSlug = searchParams.get('authorSlug')
  if (!authorSlug) return NextResponse.json({ error: 'authorSlug requerido' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  await prisma.follow.delete({ where: { userId_authorSlug: { userId: user.id, authorSlug } } }).catch(() => null)

  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ follows: [] })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ follows: [] })

  const follows = await prisma.follow.findMany({ where: { userId: user.id } })
  return NextResponse.json({ follows })
}



