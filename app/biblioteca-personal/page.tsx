import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../auth'
import { prisma } from '@/lib/prisma'
import { getAutoresBySlugs } from '@/lib/sanity'
import AuthorFollowCard from '@/components/AuthorFollowCard'
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
      <h1 className="text-2xl font-bold">Biblioteca personal</h1>
      <section>
        <h2 className="text-lg font-semibold mb-3">Tu actividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="font-semibold mb-2">Leídos</h3>
            {readSlugs.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">Aún no marcas lecturas.</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-100 space-y-1">
                {readSlugs.map((s) => (
                  <li key={s}><Link href={`/relato/${s}`} className="hover:underline">{s}</Link></li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="font-semibold mb-2">Likes</h3>
            {liked.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">Aún no tienes likes.</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-100 space-y-1">
                {liked.map((s) => (
                  <li key={s}><Link href={`/relato/${s}`} className="hover:underline">{s}</Link></li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="font-semibold mb-2">Superlikes</h3>
            {superliked.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">Aún no tienes superlikes.</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-100 space-y-1">
                {superliked.map((s) => (
                  <li key={s}><Link href={`/relato/${s}`} className="hover:underline">{s}</Link></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-3">Autores que sigues</h2>
        {autores.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Aún no sigues a ningún autor.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {autores.map((autor: any) => (
              <AuthorFollowCard
                key={autor.slug.current}
                authorSlug={autor.slug.current}
                authorName={autor.name}
                authorImage={autor.avatar}
                href={`/autor/${autor.slug.current}`}
                isFollowing={true}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}



