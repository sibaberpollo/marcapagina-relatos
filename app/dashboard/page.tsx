import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth'
import { redirect } from 'next/navigation'
import DashboardWrapper from '@/components/dashboard/DashboardWrapper'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <DashboardWrapper>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </DashboardWrapper>
  )
}
