import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || ''
  const contentType = searchParams.get('contentType') || 'relato'
  if (!slug) return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 })

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return Response.json({ isRead: false })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return Response.json({ isRead: false })

  const read = await prisma.read.findUnique({
    where: { userId_contentType_slug: { userId: user.id, contentType, slug } },
  })
  return Response.json({ isRead: Boolean(read), progress: read?.progress ?? 0 })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { slug, contentType = 'relato', progress = 1 } = await req.json()
  if (!slug) return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })

  const read = await prisma.read.upsert({
    where: { userId_contentType_slug: { userId: user.id, contentType, slug } },
    create: { userId: user.id, contentType, slug, progress },
    update: { progress },
  })
  return Response.json(read)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { slug, contentType = 'relato' } = await req.json()
  if (!slug) return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })

  await prisma.read.delete({ where: { userId_contentType_slug: { userId: user.id, contentType, slug } } })
  return new Response(null, { status: 204 })
}


