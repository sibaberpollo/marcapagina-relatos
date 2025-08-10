import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login-test')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Autores que sigues</h1>
      <p className="text-gray-700 dark:text-gray-200">Pronto podrás gestionar a quién sigues.</p>
    </div>
  )
}


