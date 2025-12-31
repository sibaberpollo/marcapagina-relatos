'use client'

import { useState } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { redirect } from 'next/navigation'
import DashboardWrapper from '@/components/features/dashboard/DashboardWrapper'
import ModerationQueue from '@/components/admin/ModerationQueue'
import CorpseAnalytics from '@/components/admin/CorpseAnalytics'
import { Button } from '@/components/ui/button'

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'analytics'>('queue')

  return (
    <DashboardWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Moderación de Historias</h1>
            <p className="text-muted-foreground">
              Revisa y aprueba historias colaborativas del Cadáver Exquisito antes de publicarlas en
              Transtextos.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'queue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('queue')}
            >
              Cola de Moderación
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('analytics')}
            >
              Analíticas
            </Button>
          </div>
        </div>

        {activeTab === 'queue' && <ModerationQueue />}
        {activeTab === 'analytics' && <CorpseAnalytics />}
      </div>
    </DashboardWrapper>
  )
}
