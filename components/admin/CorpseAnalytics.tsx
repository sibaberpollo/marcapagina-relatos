'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
} from 'lucide-react'

interface CorpseMetrics {
  completionRate: number
  totalStories: number
  completedStories: number
  averageWordCount: number
  averageWordsPerSegment: number
  moderationApprovalRate: number
  totalModerations: number
  approvedModerations: number
  averageContributors: number
  averageSubmissionTime: number
  abandonmentRate: number
}

interface AnalyticsData {
  metrics: CorpseMetrics
  trends: {
    storiesOverTime: Array<{ date: string; count: number }>
    completionRatesOverTime: Array<{ date: string; rate: number }>
    wordCountsOverTime: Array<{ date: string; avgWords: number }>
  }
}

export default function CorpseAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'moderation'>('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/corpse')
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      } else {
        setError('Error al cargar las analíticas')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="bg-muted h-4 w-3/4 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted mb-2 h-8 w-1/2 rounded"></div>
                <div className="bg-muted h-3 w-full rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <XCircle className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">Error al cargar analíticas</h3>
          <p className="text-muted-foreground text-center">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2"
          >
            Reintentar
          </button>
        </CardContent>
      </Card>
    )
  }

  const { metrics, trends } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Analíticas de Calidad - Cadáver Exquisito
          </h2>
          <p className="text-muted-foreground">
            Métricas de rendimiento y calidad para el sistema de escritura colaborativa.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('overview')}
          >
            Resumen
          </Button>
          <Button
            variant={activeView === 'trends' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('trends')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Tendencias
          </Button>
          <Button
            variant={activeView === 'moderation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('moderation')}
          >
            <PieChart className="mr-2 h-4 w-4" />
            Moderación
          </Button>
        </div>
      </div>

      {activeView === 'overview' && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Finalización</CardTitle>
                <Target className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.completionRate}%</div>
                <p className="text-muted-foreground text-xs">
                  {metrics.completedStories} de {metrics.totalStories} historias completadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Palabras Promedio</CardTitle>
                <FileText className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageWordsPerSegment}</div>
                <p className="text-muted-foreground text-xs">por segmento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprobación Moderación</CardTitle>
                <CheckCircle className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.moderationApprovalRate}%</div>
                <p className="text-muted-foreground text-xs">
                  {metrics.approvedModerations} de {metrics.totalModerations} aprobadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contribuyentes Promedio</CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageContributors}</div>
                <p className="text-muted-foreground text-xs">por historia</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Promedio de Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.averageSubmissionTime} min</div>
                <p className="text-muted-foreground text-xs">desde inicio hasta finalización</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Abandono</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.abandonmentRate}%</div>
                <p className="text-muted-foreground text-xs">historias no completadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Palabras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.averageWordCount.toLocaleString()}
                </div>
                <p className="text-muted-foreground text-xs">acumulado en todas las historias</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeView === 'trends' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias (últimos 30 días)</CardTitle>
              <CardDescription>
                Datos históricos de actividad - Instala recharts para gráficos visuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded border p-4 text-center">
                    <div className="text-lg font-semibold">Historias por Día</div>
                    <div className="text-muted-foreground mt-2 text-sm">
                      {trends.storiesOverTime.slice(-7).map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {new Date(item.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                          </span>
                          <span>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded border p-4 text-center">
                    <div className="text-lg font-semibold">Tasa de Finalización</div>
                    <div className="text-muted-foreground mt-2 text-sm">
                      {trends.completionRatesOverTime.slice(-7).map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {new Date(item.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                          </span>
                          <span>{item.rate.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded border p-4 text-center">
                    <div className="text-lg font-semibold">Palabras Promedio</div>
                    <div className="text-muted-foreground mt-2 text-sm">
                      {trends.wordCountsOverTime.slice(-7).map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {new Date(item.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                          </span>
                          <span>{item.avgWords.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === 'moderation' && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Moderación</CardTitle>
            <CardDescription>Distribución de decisiones de moderación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded border p-4">
                  <div className="flex items-center">
                    <CheckCircle className="mr-3 h-8 w-8 text-green-500" />
                    <div>
                      <div className="font-semibold">Aprobadas</div>
                      <div className="text-muted-foreground text-sm">historias publicadas</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{metrics.approvedModerations}</div>
                </div>
                <div className="flex items-center justify-between rounded border p-4">
                  <div className="flex items-center">
                    <XCircle className="mr-3 h-8 w-8 text-red-500" />
                    <div>
                      <div className="font-semibold">Rechazadas</div>
                      <div className="text-muted-foreground text-sm">requieren revisión</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.totalModerations - metrics.approvedModerations}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold">{metrics.moderationApprovalRate}%</div>
                  <div className="text-muted-foreground">Tasa de aprobación</div>
                  <Badge
                    variant={metrics.moderationApprovalRate >= 70 ? 'default' : 'secondary'}
                    className="mt-2"
                  >
                    {metrics.moderationApprovalRate >= 70 ? 'Excelente' : 'Requiere atención'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
