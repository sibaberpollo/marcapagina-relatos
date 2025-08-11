import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../auth'

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leídos</h1>
      <p className="text-gray-700 dark:text-gray-200">Pronto verás lo que ya has leído.</p>
    </div>
  )
}


