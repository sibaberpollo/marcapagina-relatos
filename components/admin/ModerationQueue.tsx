'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, XCircle, Eye, Users, Clock, FileText } from 'lucide-react'

interface CorpseSegment {
  id: string
  content: string
  wordCount: number
  position: number
  author: {
    id: string
    name: string
    email: string
  }
}

interface CorpseMetrics {
  totalWords: number
  avgWordsPerSegment: number
  uniqueAuthors: number
  completionTime: number | null
  segmentsCount: number
}

interface PendingCorpse {
  id: string
  title: string
  prompt: string | null
  status: string
  createdAt: string
  endedAt: string | null
  segments: CorpseSegment[]
  authors: Array<{
    user: {
      name: string | null
      email: string | null
    }
  }>
  metrics: CorpseMetrics
}

export default function ModerationQueue() {
  const [pendingCorpses, setPendingCorpses] = useState<PendingCorpse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCorpse, setSelectedCorpse] = useState<PendingCorpse | null>(null)
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved')
  const [feedback, setFeedback] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPendingCorpses()
  }, [])

  const fetchPendingCorpses = async () => {
    try {
      const response = await fetch('/api/moderation')
      if (response.ok) {
        const data = await response.json()
        setPendingCorpses(data)
      }
    } catch (error) {
      console.error('Error fetching pending corpses:', error)
      alert('Error: No se pudieron cargar las historias pendientes.')
    } finally {
      setLoading(false)
    }
  }

  const handleModeration = async () => {
    if (!selectedCorpse) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/moderation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corpseId: selectedCorpse.id,
          decision,
          feedback: feedback.trim() || null,
          reason: reason || null,
        }),
      })

      if (response.ok) {
        alert(`Historia ${decision === 'approved' ? 'aprobada' : 'rechazada'} exitosamente.`)

        // Remove from pending list
        setPendingCorpses((prev) => prev.filter((c) => c.id !== selectedCorpse.id))
        setSelectedCorpse(null)
        setFeedback('')
        setReason('')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Error al procesar la moderación.'}`)
      }
    } catch (error) {
      console.error('Error submitting moderation:', error)
      alert('Error al procesar la moderación.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="bg-muted h-4 w-3/4 rounded"></div>
              <div className="bg-muted h-3 w-1/2 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted h-16 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (pendingCorpses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No hay historias pendientes</h3>
          <p className="text-muted-foreground text-center">
            Todas las historias colaborativas han sido revisadas.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {pendingCorpses.map((corpse) => (
        <Card key={corpse.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="mb-2 text-xl">{corpse.title}</CardTitle>
                <CardDescription>
                  {corpse.prompt && (
                    <p className="mb-2">
                      <strong>Prompt:</strong> {corpse.prompt}
                    </p>
                  )}
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {corpse.metrics.uniqueAuthors} autores
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {corpse.metrics.totalWords} palabras
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {corpse.metrics.completionTime
                        ? `${corpse.metrics.completionTime} min`
                        : 'Tiempo desconocido'}
                    </div>
                  </div>
                </CardDescription>
              </div>
              <Badge variant="secondary">Pendiente</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Creado: {new Date(corpse.createdAt).toLocaleDateString('es-ES')}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCorpse(corpse)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Revisar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{corpse.title}</DialogTitle>
                    <DialogDescription>
                      Revisa la historia completa antes de tomar una decisión
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Story Preview */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Historia Completa</h4>
                      <div className="bg-muted space-y-4 rounded-lg p-4">
                        {corpse.segments.map((segment, index) => (
                          <div key={segment.id} className="border-primary border-l-2 pl-4">
                            <div className="text-muted-foreground mb-1 text-sm">
                              Segmento {index + 1} - {segment.author.name} ({segment.wordCount}{' '}
                              palabras)
                            </div>
                            <p className="text-sm leading-relaxed">{segment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{corpse.metrics.totalWords}</div>
                        <div className="text-muted-foreground text-sm">Palabras totales</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {corpse.metrics.avgWordsPerSegment}
                        </div>
                        <div className="text-muted-foreground text-sm">Promedio por segmento</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{corpse.metrics.uniqueAuthors}</div>
                        <div className="text-muted-foreground text-sm">Autores únicos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{corpse.metrics.segmentsCount}</div>
                        <div className="text-muted-foreground text-sm">Segmentos</div>
                      </div>
                    </div>

                    {/* Moderation Form */}
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex gap-2">
                        <Button
                          variant={decision === 'approved' ? 'default' : 'outline'}
                          onClick={() => setDecision('approved')}
                          className="flex-1"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aprobar
                        </Button>
                        <Button
                          variant={decision === 'rejected' ? 'destructive' : 'outline'}
                          onClick={() => setDecision('rejected')}
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                      </div>

                      {decision === 'rejected' && (
                        <div className="space-y-2">
                          <label htmlFor="reason-select" className="text-sm font-medium">
                            Razón del rechazo
                          </label>
                          <select
                            id="reason-select"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Selecciona una razón</option>
                            <option value="quality">Calidad insuficiente</option>
                            <option value="appropriateness">Contenido inapropiado</option>
                            <option value="incomplete">Historia incompleta</option>
                            <option value="other">Otra razón</option>
                          </select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {decision === 'approved'
                            ? 'Comentarios (opcional)'
                            : 'Feedback para los autores'}
                        </label>
                        <Textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder={
                            decision === 'approved'
                              ? 'Comentarios adicionales...'
                              : 'Explica por qué se rechaza la historia...'
                          }
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={handleModeration}
                        disabled={submitting || (decision === 'rejected' && !reason)}
                        className="w-full"
                      >
                        {submitting
                          ? 'Procesando...'
                          : `Confirmar ${decision === 'approved' ? 'aprobación' : 'rechazo'}`}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
