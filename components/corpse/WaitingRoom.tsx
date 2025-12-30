'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { socketManager } from '@/lib/socket'
import type { ExquisiteCorpse, CorpseAuthor, CorpseSegment } from '@prisma/client'

interface WaitingRoomProps {
  corpseId: string
  corpse: ExquisiteCorpse & {
    authors: (CorpseAuthor & { user: { id: string; name: string | null; image: string | null } })[]
    segments: (CorpseSegment & {
      author: { id: string; name: string | null; image: string | null }
    })[]
  }
  userId: string | null
  isAuthor: boolean
}

interface CorpseState {
  corpse: {
    id: string
    title: string
    status: 'active' | 'ended' | 'completed' | 'pending_moderation'
    maxContributors: number
    currentContributorId?: string
  }
  queue: Array<{
    userId: string
    position: number
    hasContributed: boolean
    user: {
      id: string
      name?: string | null
      image?: string | null
    }
    joinedAt: Date
  }>
  currentContributor?: {
    userId: string
    position: number
    hasContributed: boolean
    user: {
      id: string
      name?: string | null
      image?: string | null
    }
  }
  nextContributor?: {
    userId: string
    position: number
    hasContributed: boolean
  }
  timeRemaining?: number
  votesToEnd: number
  totalAuthors: number
  threshold: number
  userVoted: boolean
}

export function WaitingRoom({ corpseId, corpse, userId, isAuthor }: WaitingRoomProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [corpseState, setCorpseState] = React.useState<CorpseState | null>(null)
  const [isJoining, setIsJoining] = React.useState(false)
  const [isVoting, setIsVoting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Build initial state from server data
  React.useEffect(() => {
    const queue = corpse.authors.map((author, index) => ({
      userId: author.userId,
      position: index + 1,
      hasContributed: author.hasContributed,
      user: author.user,
      joinedAt: author.joinedAt,
    }))

    // Determine current contributor
    let currentContributor: CorpseState['currentContributor']
    let nextContributor: CorpseState['nextContributor']

    if (corpse.status === 'active' && queue.length > 0) {
      const lastSegment = corpse.segments[corpse.segments.length - 1]
      if (lastSegment) {
        const lastAuthorIndex = queue.findIndex((q) => q.userId === lastSegment.authorId)
        const nextIndex = (lastAuthorIndex + 1) % queue.length
        currentContributor = {
          userId: queue[nextIndex].userId,
          position: queue[nextIndex].position,
          hasContributed: queue[nextIndex].hasContributed,
          user: queue[nextIndex].user,
        }
        nextContributor = {
          userId: queue[(nextIndex + 1) % queue.length].userId,
          position: queue[(nextIndex + 1) % queue.length].position,
          hasContributed: queue[(nextIndex + 1) % queue.length].hasContributed,
        }
      } else {
        currentContributor = {
          userId: queue[0].userId,
          position: queue[0].position,
          hasContributed: queue[0].hasContributed,
          user: queue[0].user,
        }
        nextContributor = queue[1]
          ? {
              userId: queue[1].userId,
              position: queue[1].position,
              hasContributed: queue[1].hasContributed,
            }
          : undefined
      }
    }

    const votingStatus = {
      votesToEnd: corpse.authors.filter((a) => a.voteToEnd).length,
      totalAuthors: corpse.authors.length,
      threshold: Math.ceil(corpse.authors.length * 0.6),
      userVoted: userId
        ? (corpse.authors.find((a) => a.userId === userId)?.voteToEnd ?? false)
        : false,
    }

    setCorpseState({
      corpse: {
        id: corpse.id,
        title: corpse.title,
        status: corpse.status,
        maxContributors: corpse.maxContributors,
        currentContributorId: currentContributor?.userId,
      },
      queue,
      currentContributor,
      nextContributor,
      votesToEnd: votingStatus.votesToEnd,
      totalAuthors: votingStatus.totalAuthors,
      threshold: votingStatus.threshold,
      userVoted: votingStatus.userVoted,
    })
    setIsLoading(false)
  }, [corpse, userId])

  // Fetch voting status
  const fetchVotingStatus = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/corpse/${corpseId}/voting-status`)
      if (!response.ok) throw new Error('Failed to fetch voting status')

      const votingStatus = await response.json()
      setCorpseState((prev) =>
        prev
          ? {
              ...prev,
              votesToEnd: votingStatus.votesToEnd,
              totalAuthors: votingStatus.totalAuthors,
              threshold: votingStatus.threshold,
              userVoted: votingStatus.userVoted,
            }
          : null
      )
    } catch (error) {
      console.error('Error fetching voting status:', error)
    }
  }, [corpseId])

  // Memoized event handlers for real-time updates
  const handleUserJoined = React.useCallback(
    (data: { userId: string; user: { id: string; name?: string; image?: string } }) => {
      setCorpseState((prev) => {
        if (!prev) return prev

        const newAuthor = {
          userId: data.userId,
          position: prev.queue.length + 1,
          hasContributed: false,
          user: data.user,
          joinedAt: new Date(),
        }

        return {
          ...prev,
          queue: [...prev.queue, newAuthor],
          totalAuthors: prev.totalAuthors + 1,
          threshold: Math.ceil((prev.totalAuthors + 1) * 0.6),
        }
      })
    },
    []
  )

  const handleSegmentSubmitted = React.useCallback(() => {
    // Refresh the entire state when a segment is submitted
    window.location.reload()
  }, [])

  const handleStatusUpdated = React.useCallback(
    (data: { status: 'active' | 'ended' | 'completed' | 'pending_moderation' }) => {
      if (
        data.status === 'ended' ||
        data.status === 'completed' ||
        data.status === 'pending_moderation'
      ) {
        router.push(`/micronarrativas/${corpseId}`)
      }
      setCorpseState((prev) =>
        prev
          ? {
              ...prev,
              corpse: { ...prev.corpse, status: data.status },
            }
          : null
      )
    },
    [router, corpseId]
  )

  const handleQueueUpdated = React.useCallback(
    (data: {
      currentContributorId?: string
      votesToEnd?: number
      totalAuthors?: number
      threshold?: number
    }) => {
      setCorpseState((prev) => {
        if (!prev) return prev

        // Update current contributor
        return {
          ...prev,
          currentContributorId: data.currentContributorId,
          currentContributor: prev.queue.find((q) => q.userId === data.currentContributorId),
          votesToEnd: data.votesToEnd ?? prev.votesToEnd,
          totalAuthors: data.totalAuthors ?? prev.totalAuthors,
          threshold: data.threshold ?? prev.threshold,
        }
      })
    },
    []
  )

  // WebSocket setup
  React.useEffect(() => {
    if (!corpseId) return

    const initializeWebSocket = async () => {
      try {
        await socketManager.joinCorpse(corpseId)
      } catch (error) {
        console.error('Error joining WebSocket room:', error)
      }
    }

    initializeWebSocket()

    // Set up event listeners
    socketManager.on('user-joined', handleUserJoined)
    socketManager.on('segment-submitted', handleSegmentSubmitted)
    socketManager.on('status-updated', handleStatusUpdated)
    socketManager.on('queue-updated', handleQueueUpdated)

    return () => {
      socketManager.off('user-joined', handleUserJoined)
      socketManager.off('segment-submitted', handleSegmentSubmitted)
      socketManager.off('status-updated', handleStatusUpdated)
      socketManager.off('queue-updated', handleQueueUpdated)
    }
  }, [corpseId, handleUserJoined, handleSegmentSubmitted, handleStatusUpdated, handleQueueUpdated])

  // Join queue handler
  const handleJoinQueue = async () => {
    if (!session?.user || !userId) {
      router.push('/?login=true')
      return
    }

    try {
      setIsJoining(true)
      setError(null)

      // Use socket manager to join
      await socketManager.joinCorpse(corpseId)

      // Refresh the page to get updated state
      window.location.reload()
    } catch (error) {
      console.error('Error joining queue:', error)
      setError(error instanceof Error ? error.message : 'Error al unirse a la cola')
    } finally {
      setIsJoining(false)
    }
  }

  // Vote to end handler
  const handleVoteToEnd = async () => {
    if (!isAuthor) return

    try {
      setIsVoting(true)
      setError(null)

      await socketManager.voteToEnd(corpseId)

      // Refresh voting status
      await fetchVotingStatus()
    } catch (error) {
      console.error('Error voting to end:', error)
      setError(error instanceof Error ? error.message : 'Error al votar')
    } finally {
      setIsVoting(false)
    }
  }

  // Redirect to contribute if user is current contributor
  React.useEffect(() => {
    if (corpseState?.currentContributor?.userId === userId && corpse.status === 'active') {
      router.push(`/micronarrativas/${corpseId}/contribute`)
    }
  }, [corpseState?.currentContributor?.userId, userId, corpse.status, router, corpseId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Cargando sala de espera...</p>
        </div>
      </div>
    )
  }

  if (!corpseState) return null

  const isFull = corpseState.queue.length >= corpse.maxContributors
  const canJoin = !isAuthor && !isFull && corpse.status === 'active'
  const canVote = isAuthor && corpse.status === 'active' && !corpseState.userVoted

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{corpse.title}</h1>
        {corpse.prompt && <p className="text-gray-600 dark:text-gray-400">{corpse.prompt}</p>}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Estado: {corpse.status === 'active' ? 'Activa' : corpse.status}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {corpseState.queue.length} de {corpse.maxContributors} participantes
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/50">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Progress */}
      <div className="mb-8">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Progreso</h2>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(corpseState.queue.filter((q) => q.hasContributed).length / corpseState.queue.length) * 100}%`,
              }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {corpseState.queue.filter((q) => q.hasContributed).length} de {corpseState.queue.length}{' '}
            contribuciones completadas
          </div>
        </div>
      </div>

      {/* Current Contributor */}
      {corpseState.currentContributor && (
        <div className="mb-8">
          <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
            <h2 className="mb-4 text-xl font-semibold text-green-900 dark:text-green-100">
              Escribiendo ahora
            </h2>
            <div className="flex items-center gap-3">
              {corpseState.currentContributor.user.image && (
                <Image
                  src={corpseState.currentContributor.user.image}
                  alt={corpseState.currentContributor.user.name || 'Autor'}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  {corpseState.currentContributor.user.name || 'Anónimo'}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Posición {corpseState.currentContributor.position}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue */}
      <div className="mb-8">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Cola de participantes
          </h2>
          {corpseState.queue.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No hay participantes aún. ¡Sé el primero en unirte!
            </p>
          ) : (
            <div className="space-y-3">
              {corpseState.queue.map((participant) => (
                <div
                  key={participant.userId}
                  className={cn(
                    'flex items-center gap-3 rounded-lg p-3',
                    participant.userId === userId && 'bg-blue-50 dark:bg-blue-900/20',
                    participant.userId === corpseState.currentContributor?.userId &&
                      'bg-green-50 dark:bg-green-900/20'
                  )}
                >
                  <div className="relative">
                    {participant.user.image ? (
                      <Image
                        src={participant.user.image}
                        alt={participant.user.name || 'Autor'}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                    )}
                    {participant.hasContributed && (
                      <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                        <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        participant.userId === userId && 'text-blue-900 dark:text-blue-100',
                        participant.userId === corpseState.currentContributor?.userId &&
                          'text-green-900 dark:text-green-100'
                      )}
                    >
                      {participant.user.name || 'Anónimo'}
                      {participant.userId === userId && ' (Tú)'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Posición {participant.position} • Se unió{' '}
                      {new Date(participant.joinedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  {participant.userId === corpseState.currentContributor?.userId && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                      Escribiendo
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {canJoin && (
          <button
            onClick={handleJoinQueue}
            disabled={isJoining}
            className={cn(
              'flex-1 rounded-md px-6 py-3 font-medium transition-colors',
              isJoining
                ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
          >
            {isJoining ? (
              <>
                <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Uniéndose...
              </>
            ) : (
              'Unirse a la cola'
            )}
          </button>
        )}

        {canVote && (
          <button
            onClick={handleVoteToEnd}
            disabled={isVoting}
            className={cn(
              'rounded-md border px-6 py-3 font-medium transition-colors',
              isVoting
                ? 'cursor-not-allowed border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400'
                : 'border-red-300 text-red-700 hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20'
            )}
          >
            {isVoting ? (
              <>
                <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                Votando...
              </>
            ) : (
              'Votar para terminar'
            )}
          </button>
        )}
      </div>

      {/* Voting Status */}
      {isAuthor && (
        <div className="mt-8">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Votos para terminar: {corpseState.votesToEnd} de {corpseState.threshold} necesarios
              {corpseState.userVoted && ' (Ya votaste)'}
            </p>
          </div>
        </div>
      )}

      {/* Previous Segments Preview */}
      {corpse.segments.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Segmentos anteriores
          </h2>
          <div className="space-y-4">
            {corpse.segments.slice(0, 3).map((segment) => (
              <div key={segment.id} className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2">
                  {segment.author.image && (
                    <Image
                      src={segment.author.image}
                      alt={segment.author.name || 'Autor'}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {segment.author.name || 'Anónimo'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {segment.wordCount} palabras
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {segment.content.length > 200
                    ? `${segment.content.substring(0, 200)}...`
                    : segment.content}
                </p>
              </div>
            ))}
            {corpse.segments.length > 3 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Y {corpse.segments.length - 3} segmentos más...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
