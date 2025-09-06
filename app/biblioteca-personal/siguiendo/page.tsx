import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'
import { getAutoresBySlugs } from '@/lib/sanity'
import AuthorFollowCard from '@/components/AuthorFollowCard'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  // Deshabilitado temporalmente
  const autores: any[] = []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Autores que sigues</h1>
      <p className="text-gray-700 dark:text-gray-200">
        Seguimiento de autores no disponible en este release.
      </p>
    </div>
  )
}
