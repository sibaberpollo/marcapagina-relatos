import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../auth'
import { prisma } from '@/lib/prisma'
import { getAutoresBySlugs, getRelatosForChronologicalBySlugs } from '@/lib/sanity'
import BibliotecaTabs from '@/components/mi-area/BibliotecaTabs'
import AuthorCard from '@/components/AuthorCard'
import Link from 'next/link'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const user = await prisma.user.findUnique({ where: { email: session.user?.email || '' } })
  const follows = user ? await prisma.follow.findMany({ where: { userId: user.id } }) : []
  const slugs = follows.map((f) => f.authorSlug)
  const autores = await getAutoresBySlugs(slugs)

  // Reacciones y leídos del usuario
  const [reads, reactions] = user
    ? await Promise.all([
        prisma.read.findMany({ where: { userId: user.id, contentType: 'relato' } }),
        prisma.reaction.findMany({ where: { userId: user.id, contentType: 'relato' } }),
      ])
    : [[], []]

  // Agrupar por tipo de reacción
  const liked = reactions.filter((r) => r.type === 'UP').map((r) => r.slug)
  const superliked = reactions.filter((r) => r.type === 'DOUBLE').map((r) => r.slug)
  const readSlugs = reads.map((r) => r.slug)

  return (
    <div className="space-y-6">
      {/* Breadcrumb/Título */}
      <div className="text-sm text-gray-600">Inicio →</div>
      <h2 className="text-xl font-semibold">Hola, {session.user?.name?.split(' ')[0] || 'lectora/lector'}</h2>
      <h1 className="text-2xl font-bold">Biblioteca personal</h1>
      <section>
        <h2 className="text-lg font-semibold mb-3">Tu actividad</h2>
        <BibliotecaTabs
          favorites={await getRelatosForChronologicalBySlugs(superliked)}
          likes={await getRelatosForChronologicalBySlugs(liked)}
          read={await getRelatosForChronologicalBySlugs(readSlugs)}
          initialTab="favorites"
        />
      </section>
      {/* Sidebar eliminado en este release */}
    </div>
  )
}



