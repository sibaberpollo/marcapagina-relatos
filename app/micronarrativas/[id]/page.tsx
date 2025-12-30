import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'
import { WaitingRoom } from '@/components/corpse/WaitingRoom'

interface CorpsePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CorpsePageProps): Promise<Metadata> {
  const resolvedParams = await params

  const corpse = await prisma.exquisiteCorpse.findUnique({
    where: { id: resolvedParams.id },
    select: { title: true, prompt: true, status: true },
  })

  if (!corpse) {
    return {
      title: 'Micronarrativa no encontrada - Marcapágina',
    }
  }

  return {
    title: `"${corpse.title}" - Micronarrativa colaborativa - Marcapágina`,
    description: corpse.prompt
      ? `Micronarrativa colaborativa: ${corpse.prompt}`
      : 'Únete a esta micronarrativa colaborativa en Marcapágina',
  }
}

export default async function CorpsePage({ params }: CorpsePageProps) {
  const resolvedParams = await params
  const session = await getServerSession(authOptions)

  const corpse = await prisma.exquisiteCorpse.findUnique({
    where: { id: resolvedParams.id },
    include: {
      authors: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { joinedAt: 'asc' },
      },
      segments: {
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!corpse) {
    notFound()
  }

  // Check if user is logged in and part of this corpse
  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null
  const userId = user?.id || null

  const isAuthor = userId ? corpse.authors.some((author) => author.userId === userId) : false

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WaitingRoom
        corpseId={resolvedParams.id}
        corpse={corpse}
        userId={userId}
        isAuthor={isAuthor}
      />
    </div>
  )
}
