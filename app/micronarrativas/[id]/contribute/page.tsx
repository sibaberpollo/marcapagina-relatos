import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../auth'
import { prisma } from '@/lib/prisma'
import { ContributionInterface } from '@/components/corpse/ContributionInterface'

interface ContributePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ContributePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return {
      title: 'Acceso requerido - Marcapágina',
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return {
      title: 'Usuario no encontrado - Marcapágina',
    }
  }

  // Check if user is authorized for this corpse
  const author = await prisma.corpseAuthor.findFirst({
    where: { corpseId: resolvedParams.id, userId: user.id },
  })

  if (!author) {
    return {
      title: 'No autorizado - Marcapágina',
    }
  }

  // Get corpse details
  const corpse = await prisma.exquisiteCorpse.findUnique({
    where: { id: resolvedParams.id },
    select: { title: true, status: true },
  })

  if (!corpse) {
    return {
      title: 'Micronarrativa no encontrada - Marcapágina',
    }
  }

  return {
    title: `Contribuir a "${corpse.title}" - Marcapágina`,
    description: `Contribuye a la micronarrativa colectiva "${corpse.title}"`,
  }
}

export default async function ContributePage({ params }: ContributePageProps) {
  const resolvedParams = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    notFound()
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    notFound()
  }

  // Check if user is authorized for this corpse
  const author = await prisma.corpseAuthor.findFirst({
    where: { corpseId: resolvedParams.id, userId: user.id },
  })

  if (!author) {
    notFound()
  }

  // Get corpse details
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

  // Don't allow contributing if corpse is not active
  if (corpse.status !== 'active') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ContributionInterface
        corpseId={resolvedParams.id}
        corpse={corpse}
        userId={user.id}
        author={author}
      />
    </div>
  )
}
