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
    select: {
      title: true,
      prompt: true,
      status: true,
      authors: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
      segments: {
        select: { content: true },
        take: 3, // First few segments for description
      },
    },
  })

  if (!corpse || corpse.status !== 'completed') {
    return {
      title: 'Micronarrativa no encontrada - Marcapágina',
    }
  }

  const contributors = corpse.authors.map((author) => author.user.name || 'Anónimo')
  const contributorText =
    contributors.length <= 3
      ? contributors.join(', ')
      : `${contributors.slice(0, 3).join(', ')} y ${contributors.length - 3} más`

  const description = corpse.prompt
    ? `Micronarrativa colaborativa: "${corpse.prompt}". Creada por ${contributorText}.`
    : `Micronarrativa colaborativa creada por ${contributorText} en Marcapágina.`

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcapagina.com'
  const url = `${baseUrl}/micronarrativas/${resolvedParams.id}/completa`

  return {
    title: `"${corpse.title}" - Micronarrativa completa - Marcapágina`,
    description,
    openGraph: {
      title: `"${corpse.title}" - Micronarrativa colaborativa`,
      description,
      url,
      type: 'article',
      authors: contributors,
      siteName: 'Marcapágina',
      images: [
        {
          url: `${baseUrl}/api/og/corpse/${resolvedParams.id}`,
          width: 1200,
          height: 630,
          alt: `Micronarrativa: ${corpse.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `"${corpse.title}" - Micronarrativa completa`,
      description,
      images: [`${baseUrl}/api/og/corpse/${resolvedParams.id}`],
    },
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
