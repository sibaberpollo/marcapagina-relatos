import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { redirect } from 'next/navigation'
import DashboardWrapper from '@/components/features/dashboard/DashboardWrapper'
import ModerationQueue from '@/components/admin/ModerationQueue'

export default async function ModerationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <DashboardWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moderación de Historias</h1>
          <p className="text-muted-foreground">
            Revisa y aprueba historias colaborativas del Cadáver Exquisito antes de publicarlas en
            Transtextos.
          </p>
        </div>

        <ModerationQueue />
      </div>
    </DashboardWrapper>
  )
}
