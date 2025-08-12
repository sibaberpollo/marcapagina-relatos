import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'
import { getAutoresBySlugs } from '@/lib/sanity'
import AuthorFollowCard from '@/components/AuthorFollowCard'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const user = await prisma.user.findUnique({ where: { email: session.user?.email || '' } })
  const follows = user ? await prisma.follow.findMany({ where: { userId: user.id } }) : []
  const slugs = follows.map((f) => f.authorSlug)
  const autores = await getAutoresBySlugs(slugs)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Autores que sigues</h1>
      {autores.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-200">Aún no sigues a ningún autor.</p>
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
    </div>
  )
}



