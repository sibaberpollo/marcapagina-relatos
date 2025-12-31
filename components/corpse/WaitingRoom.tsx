'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { socketManager } from '@/lib/socket'
import { useCorpseTranslations } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { ExquisiteCorpse, CorpseAuthor, CorpseSegment } from '@prisma/client'
import { ContributorProfile, ContributorCard } from './ContributorProfile'

interface WaitingRoomProps {
  corpseId: string
  corpse: ExquisiteCorpse & {
    authors: (CorpseAuthor & {
      user: { id: string; name: string | null; image: string | null }
    })[]
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
  const translations = useCorpseTranslations()
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
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Cargando sala de espera...</p>
        </div>
      </div>
    )
  }

  if (!corpseState) return null

  const isFull = corpseState.queue.length >= corpse.maxContributors
  const canJoin = !isAuthor && !isFull && corpse.status === 'active'
  const canVote = isAuthor && corpse.status === 'active' && !corpseState.userVoted

  // Loading state while translations load
  if (!translations) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Cargando sala de espera...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Screen reader status updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {translations.waitingRoom.statusLabel}:{' '}
        {corpse.status === 'active' ? translations.waitingRoom.status.active : corpse.status}.
        {corpseState.queue.length} de {corpse.maxContributors}{' '}
        {translations.waitingRoom.participants}.{canJoin && translations.waitingRoom.canJoin}
        {canVote && translations.waitingRoom.canVote}
      </div>

      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          {corpse.title}
        </h1>
        {corpse.prompt && (
          <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">{corpse.prompt}</p>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {translations.waitingRoom.statusLabel}:{' '}
            {corpse.status === 'active' ? translations.waitingRoom.status.active : corpse.status}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {corpseState.queue.length} de {corpse.maxContributors}{' '}
            {translations.waitingRoom.participants}
          </span>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/50">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Progress */}
      <section className="mb-6 sm:mb-8" aria-labelledby="progress-heading">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2
              id="progress-heading"
              className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-100"
            >
              {translations.waitingRoom.progress}
            </h2>
            <div
              className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"
              role="progressbar"
              aria-valuenow={corpseState.queue.filter((q) => q.hasContributed).length}
              aria-valuemin={0}
              aria-valuemax={corpseState.queue.length}
              aria-label={`${translations.waitingRoom.progress}: ${
                corpseState.queue.filter((q) => q.hasContributed).length
              } de ${corpseState.queue.length} ${translations.waitingRoom.contributionsCompleted}`}
            >
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (corpseState.queue.filter((q) => q.hasContributed).length /
                      corpseState.queue.length) *
                    100
                  }%`,
                }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {corpseState.queue.filter((q) => q.hasContributed).length} de{' '}
              {corpseState.queue.length} {translations.waitingRoom.contributionsCompleted}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Current Contributor */}
      {corpseState.currentContributor && (
        <section className="mb-8" aria-labelledby="current-contributor-heading">
          <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
            <h2
              id="current-contributor-heading"
              className="mb-4 text-xl font-semibold text-green-900 dark:text-green-100"
            >
              {translations.waitingRoom.writingNow}
            </h2>
            <ContributorCard
              userId={corpseState.currentContributor.userId}
              name={corpseState.currentContributor.user.name || null}
              image={corpseState.currentContributor.user.image || null}
              hasContributed={corpseState.currentContributor.hasContributed}
              isCurrentContributor={true}
              timeRemaining={corpseState.timeRemaining}
            />
          </div>
        </section>
      )}

      {/* Queue */}
      <section className="mb-6 sm:mb-8" aria-labelledby="queue-heading">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2
              id="queue-heading"
              className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-100"
            >
              {translations.waitingRoom.queue}
            </h2>
            {corpseState.queue.length === 0 ? (
              <p className="text-sm text-gray-500 sm:text-base dark:text-gray-400">
                {translations.waitingRoom.noParticipants}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {corpseState.queue.map((participant) => (
                  <ContributorCard
                    key={participant.userId}
                    userId={participant.userId}
                    name={participant.user.name || null}
                    image={participant.user.image || null}
                    hasContributed={participant.hasContributed}
                    isCurrentContributor={
                      participant.userId === corpseState.currentContributor?.userId
                    }
                    timeRemaining={
                      participant.userId === corpseState.currentContributor?.userId
                        ? corpseState.timeRemaining
                        : undefined
                    }
                    className={cn(participant.userId === userId && 'ring-2 ring-blue-500')}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Actions */}
      <div
        className="flex flex-col gap-3 sm:flex-row"
        role="group"
        aria-label="Acciones disponibles"
      >
        {canJoin && (
          <Button
            onClick={handleJoinQueue}
            disabled={isJoining}
            size="lg"
            className="min-h-[44px] flex-1 sm:px-6"
            aria-describedby={isFull ? 'queue-full-message' : undefined}
          >
            {isJoining ? (
              <>
                <LoadingSpinner size="sm" className="mr-2 border-white border-t-transparent" />
                {translations.waitingRoom.joining}
              </>
            ) : (
              translations.waitingRoom.joinQueue
            )}
          </Button>
        )}

        {canVote && (
          <Button
            onClick={handleVoteToEnd}
            disabled={isVoting}
            variant="outline"
            size="lg"
            className="min-h-[44px] border-red-300 text-red-700 hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-100 sm:px-6 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20 dark:active:bg-red-800/30"
          >
            {isVoting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2 border-red-500 border-t-transparent" />
                {translations.waitingRoom.voting}
              </>
            ) : (
              translations.waitingRoom.voteToEnd
            )}
          </Button>
        )}
      </div>

      {/* Voting Status */}
      {isAuthor && (
        <div className="mt-8">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {translations.waitingRoom.votesToEnd
                .replace('{{votes}}', corpseState.votesToEnd.toString())
                .replace('{{threshold}}', corpseState.threshold.toString())}
              {corpseState.userVoted && ` ${translations.waitingRoom.alreadyVoted}`}
            </p>
          </div>
        </div>
      )}

      {/* Previous Segments Preview */}
      {corpse.segments.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {translations.waitingRoom.previousSegments}
          </h2>
          <div className="space-y-4">
            {corpse.segments.slice(0, 3).map((segment) => (
              <Card key={segment.id} className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  {segment.author.image && (
                    <Image
                      src={segment.author.image}
                      alt={segment.author.name || translations.waitingRoom.anonymous}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {segment.author.name || translations.waitingRoom.anonymous}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {segment.wordCount} {translations.waitingRoom.words}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {segment.content.length > 200
                    ? `${segment.content.substring(0, 200)}...`
                    : segment.content}
                </p>
              </Card>
            ))}
            {corpse.segments.length > 3 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {translations.waitingRoom.andMore.replace(
                  '{{count}}',
                  (corpse.segments.length - 3).toString()
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
