import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../auth'
import { prisma } from '@/lib/prisma'
import { CompletedCorpseViewer } from '@/components/corpse/CompletedCorpseViewer'

interface CompletedCorpsePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CompletedCorpsePageProps): Promise<Metadata> {
  const resolvedParams = await params

  const corpse = await prisma.exquisiteCorpse.findUnique({
    where: { id: resolvedParams.id },
    select: { title: true, prompt: true, status: true },
  })

  if (!corpse || corpse.status !== 'completed') {
    return {
      title: 'Micronarrativa no encontrada - Marcapágina',
    }
  }

  return {
    title: `"${corpse.title}" - Micronarrativa completa - Marcapágina`,
    description: corpse.prompt
      ? `Micronarrativa colaborativa completa: ${corpse.prompt}`
      : 'Lee esta micronarrativa colaborativa completa en Marcapágina',
  }
}

export default async function CompletedCorpsePage({ params }: CompletedCorpsePageProps) {
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

  if (!corpse || corpse.status !== 'completed') {
    notFound()
  }

  // Check if user is logged in and is a moderator (for graduation button)
  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, image: true },
      })
    : null

  // TODO: Implement moderator check - for now, assume any logged-in user can graduate
  const isModerator = !!user

  // Calculate voting information
  const totalAuthors = corpse.authors.length
  const votesToEnd = corpse.authors.filter((author) => author.voteToEnd).length
  const majorityThreshold = Math.ceil(totalAuthors * 0.6) // 60% majority

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CompletedCorpseViewer
        corpse={corpse}
        segments={corpse.segments}
        authors={corpse.authors}
        votingInfo={{
          votesToEnd,
          totalAuthors,
          majorityThreshold,
          completedByVote: votesToEnd >= majorityThreshold,
        }}
        isModerator={isModerator}
        currentUser={user}
      />
    </div>
  )
}
