'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GraduationCap, Users, Vote, Clock, ExternalLink } from 'lucide-react'
import type { ExquisiteCorpse, CorpseAuthor, CorpseSegment } from '@prisma/client'

interface CompletedCorpseViewerProps {
  corpse: ExquisiteCorpse
  segments: (CorpseSegment & {
    author: { id: string; name: string | null; image: string | null }
  })[]
  authors: (CorpseAuthor & {
    user: { id: string; name: string | null; image: string | null }
  })[]
  votingInfo: {
    votesToEnd: number
    totalAuthors: number
    majorityThreshold: number
    completedByVote: boolean
  }
  isModerator: boolean
  currentUser: { id: string; name: string | null; image: string | null } | null
}

export function CompletedCorpseViewer({
  corpse,
  segments,
  authors,
  votingInfo,
  isModerator,
  currentUser,
}: CompletedCorpseViewerProps) {
  const [isGraduating, setIsGraduating] = React.useState(false)

  const handleGraduate = async () => {
    setIsGraduating(true)
    try {
      // TODO: Implement graduation logic
      console.log('Graduating corpse to Transtextos:', corpse.id)
      // This would call an API to move the corpse to Transtextos
    } catch (error) {
      console.error('Error graduating corpse:', error)
    } finally {
      setIsGraduating(false)
    }
  }

  const totalWords = segments.reduce((sum, segment) => sum + segment.wordCount, 0)
  const completionDate = corpse.endedAt || new Date()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            Micronarrativa Completa
          </span>
          {votingInfo.completedByVote && (
            <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:border-gray-600 dark:text-gray-200">
              <Vote className="mr-1 h-3 w-3" />
              Completada por votación
            </span>
          )}
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{corpse.title}</h1>

        {corpse.prompt && (
          <p className="text-lg text-gray-600 dark:text-gray-400">{corpse.prompt}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {authors.length} colaborador{authors.length !== 1 ? 'es' : ''}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Completada {completionDate.toLocaleDateString('es-ES')}
          </div>
          <div>{totalWords} palabras totales</div>
        </div>
      </div>

      {/* Voting Information */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          <Vote className="h-5 w-5" />
          Información de Votación
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{votingInfo.votesToEnd}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Votos para terminar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{votingInfo.totalAuthors}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Colaboradores totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{votingInfo.majorityThreshold}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Umbral de mayoría (60%)</div>
          </div>
        </div>
        {votingInfo.completedByVote && (
          <div className="mt-4 rounded-md bg-green-50 p-3 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-200">
              Esta micronarrativa fue completada por decisión mayoritaria de los colaboradores.
            </p>
          </div>
        )}
      </div>

      {/* The Story */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
          La Narrativa Completa
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {segments.map((segment, index) => (
            <div key={segment.id} className="mb-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  {segment.author.image ? (
                    <Image
                      src={segment.author.image}
                      alt={segment.author.name || 'Autor'}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {(segment.author.name || 'A').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/autor/${segment.author.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {segment.author.name || 'Autor anónimo'}
                  </Link>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Segmento {index + 1} • {segment.wordCount} palabras
                  </div>
                </div>
              </div>

              <div className="ml-11">
                <div className="leading-relaxed text-gray-900 dark:text-gray-100">
                  {segment.content}
                </div>
                {index < segments.length - 1 && <Separator className="mt-4" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contributors */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          <Users className="h-5 w-5" />
          Colaboradores
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {authors.map((author) => (
            <div key={author.userId} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                {author.user.image ? (
                  <Image
                    src={author.user.image}
                    alt={author.user.name || 'Autor'}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {(author.user.name || 'A').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/autor/${author.userId}`}
                  className="block truncate font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {author.user.name || 'Autor anónimo'}
                </Link>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {author.hasContributed ? 'Contribuyó' : 'No contribuyó'}
                  {author.voteToEnd && ' • Votó para terminar'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moderation Actions */}
      {isModerator && (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            <GraduationCap className="h-5 w-5" />
            Acciones de Moderación
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Como moderador, puedes graduar esta micronarrativa a Transtextos para que forme parte
              del feed principal.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleGraduate}
                disabled={isGraduating}
                className="flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                {isGraduating ? 'Graduando...' : 'Graduar a Transtextos'}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/transtextos" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Ver Transtextos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
