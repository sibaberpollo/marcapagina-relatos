'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { socketManager } from '@/lib/socket'
import { useCorpseTranslations } from '@/lib/i18n'
import { CircularTimer } from './CircularTimer'
import { WordCounter } from './WordCounter'
import { clientContentValidator } from '@/lib/contentValidation'
import { CorpseErrorBoundary } from '@/components/common/ErrorBoundary'
import { ContributionSkeleton } from './CorpseSkeletons'
import {
  useCorpseErrorHandler,
  useNetworkStatus,
  useAsyncOperation,
} from '@/lib/corpseErrorHandling'
import { toast } from '@/components/ui/use-toast'
import type { ExquisiteCorpse, CorpseAuthor, CorpseSegment } from '@prisma/client'
import type { StatusUpdatedPayload, TimerStartedPayload } from '@/types/socketEvents'

interface ContributionInterfaceProps {
  corpseId: string
  corpse: ExquisiteCorpse & {
    authors: (CorpseAuthor & { user: { id: string; name: string | null; image: string | null } })[]
    segments: (CorpseSegment & {
      author: { id: string; name: string | null; image: string | null }
    })[]
  }
  userId: string
  author: CorpseAuthor
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
    isCurrentUser: boolean
  }>
  currentContributor?: {
    userId: string
    position: number
    hasContributed: boolean
  }
  nextContributor?: {
    userId: string
    position: number
    hasContributed: boolean
  }
  timeRemaining?: number
}

export function ContributionInterface({
  corpseId,
  corpse,
  userId,
  author,
}: ContributionInterfaceProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const translations = useCorpseTranslations()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSkipping, setIsSkipping] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [corpseState, setCorpseState] = React.useState<CorpseState | null>(null)
  const [draft, setDraft] = React.useState('')
  const [validationWarnings, setValidationWarnings] = React.useState<string[]>([])
  const [wordCount, setWordCount] = React.useState(0)
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null)

  // Refs for focus management and accessibility
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const submitButtonRef = React.useRef<HTMLButtonElement>(null)
  const skipButtonRef = React.useRef<HTMLButtonElement>(null)

  // Focus management effect
  React.useEffect(() => {
    if (corpseState?.currentContributor?.userId === userId && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [corpseState?.currentContributor?.userId, userId])

  const fetchCorpseState = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/corpse/${corpseId}/contribute`)
      if (!response.ok) {
        throw new Error('Failed to fetch corpse state')
      }

      const data = await response.json()
      setCorpseState(data.state)
      setDraft(data.draft || '')

      // Update time remaining if user is current contributor
      if (data.isCurrentContributor && data.state.timeRemaining) {
        setTimeRemaining(data.state.timeRemaining)
      } else {
        setTimeRemaining(null)
      }

      // Update word count
      updateWordCount(data.draft || '')
    } catch (error) {
      console.error('Error fetching corpse state:', error)
      setError(
        translations?.contributionInterface?.fetchError || 'Error al obtener el estado actual'
      )
    }
  }, [corpseId])

  const updateWordCount = (text: string) => {
    const count = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    setWordCount(count)
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setDraft(text)
    updateWordCount(text)

    // Real-time validation
    const validation = clientContentValidator.validate(text)
    setValidationWarnings(validation.warnings || [])

    // Clear error when user starts typing again
    if (error) {
      setError(null)
    }

    // Auto-save to localStorage as backup
    try {
      localStorage.setItem(`corpse-draft-${corpseId}`, text)
    } catch (error) {
      console.warn('Failed to save draft to localStorage:', error)
    }
  }

  // Keyboard navigation and shortcuts
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      if (isWordCountValid && !isSubmitting) {
        handleSubmit()
      }
    }
    // Escape to skip (if available)
    else if (event.key === 'Escape' && !isSubmitting && !isSkipping) {
      event.preventDefault()
      handleSkip()
    }
  }

  // Memoized handlers for real-time updates with proper typing
  const handleUserJoined = React.useCallback(() => {
    fetchCorpseState()
  }, [fetchCorpseState])

  const handleSegmentSubmitted = React.useCallback(() => {
    fetchCorpseState()
  }, [fetchCorpseState])

  const handleStatusUpdated = React.useCallback(
    (data: StatusUpdatedPayload) => {
      if (data.status === 'ended' || data.status === 'completed') {
        router.push(`/micronarrativas/${corpseId}`)
      }
      fetchCorpseState()
    },
    [router, corpseId, fetchCorpseState]
  )

  const handleQueueUpdated = React.useCallback(() => {
    fetchCorpseState()
  }, [fetchCorpseState])

  const handleTimerExpired = React.useCallback(() => {
    fetchCorpseState()
  }, [fetchCorpseState])

  const handleTimerStarted = React.useCallback(
    (data: TimerStartedPayload) => {
      if (data.userId === userId) {
        setTimeRemaining(data.duration)
      }
    },
    [userId]
  )

  const saveDraftToAPI = React.useCallback(async () => {
    if (!draft.trim()) return

    try {
      const response = await fetch(`/api/corpse/${corpseId}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save-draft', content: draft }),
      })

      if (!response.ok) {
        throw new Error('Failed to save draft')
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }, [corpseId, draft])

  const initializeContribution = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Join WebSocket room
      await socketManager.joinCorpse(corpseId)

      // Fetch initial state
      await fetchCorpseState()
    } catch (error) {
      console.error('Error initializing contribution:', error)
      setError(
        translations?.contributionInterface?.initError ||
          'Error al cargar la interfaz de contribución'
      )
    } finally {
      setIsLoading(false)
    }
  }, [corpseId, fetchCorpseState])

  // Handle real-time updates
  React.useEffect(() => {
    if (!corpseId) return

    // Set up event listeners with proper typing
    socketManager.onUserJoined(handleUserJoined)
    socketManager.onSegmentSubmitted(handleSegmentSubmitted)
    socketManager.onStatusUpdated(handleStatusUpdated)
    socketManager.onQueueUpdated(handleQueueUpdated)
    socketManager.on('timer-expired', handleTimerExpired)
    socketManager.on('timer-started', handleTimerStarted)

    return () => {
      socketManager.off('user-joined', handleUserJoined)
      socketManager.off('segment-submitted', handleSegmentSubmitted)
      socketManager.off('status-updated', handleStatusUpdated)
      socketManager.off('queue-updated', handleQueueUpdated)
      socketManager.off('timer-expired', handleTimerExpired)
      socketManager.off('timer-started', handleTimerStarted)
    }
  }, [
    corpseId,
    fetchCorpseState,
    handleUserJoined,
    handleSegmentSubmitted,
    handleStatusUpdated,
    handleQueueUpdated,
    handleTimerExpired,
    handleTimerStarted,
  ])

  // Initialize component
  React.useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.push('/?login=true')
      return
    }

    initializeContribution()
  }, [status, session, router, initializeContribution])

  // Timer countdown effect
  React.useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Timer expired
          fetchCorpseState()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining, fetchCorpseState])

  // Auto-save draft every 30 seconds
  React.useEffect(() => {
    if (!draft.trim()) return

    const interval = setInterval(() => {
      saveDraftToAPI()
    }, 30000)

    return () => clearInterval(interval)
  }, [draft, saveDraftToAPI])

  const handleSubmit = async () => {
    if (!corpseState?.currentContributor || corpseState.currentContributor.userId !== userId) {
      setError(translations?.contributionInterface?.notYourTurn || 'No es tu turno para contribuir')
      return
    }

    // Client-side validation
    const validation = clientContentValidator.validate(draft)
    if (!validation.isValid) {
      setError(validation.error || 'Error de validación')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await socketManager.submitSegment(corpseId, draft, validation.wordCount)

      // Clear draft
      setDraft('')
      localStorage.removeItem(`corpse-draft-${corpseId}`)
      updateWordCount('')

      // Clear time remaining
      setTimeRemaining(null)
    } catch (error) {
      console.error('Error submitting segment:', error)
      setError(
        translations?.contributionInterface?.submitError ||
          'Error al enviar el segmento. Inténtalo de nuevo.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    if (!corpseState?.currentContributor || corpseState.currentContributor.userId !== userId) {
      setError(translations?.contributionInterface?.notYourTurnSkip || 'No es tu turno para saltar')
      return
    }

    try {
      setIsSkipping(true)
      setError(null)

      await socketManager.skipTurn(corpseId)

      // Clear draft
      setDraft('')
      localStorage.removeItem(`corpse-draft-${corpseId}`)
      updateWordCount('')

      // Clear time remaining
      setTimeRemaining(null)
    } catch (error) {
      console.error('Error skipping turn:', error)
      setError(
        translations?.contributionInterface?.skipError ||
          'Error al saltar el turno. Inténtalo de nuevo.'
      )
    } finally {
      setIsSkipping(false)
    }
  }

  // Loading state
  if (fetchStateOperation.loading && !corpseState) {
    return <ContributionSkeleton />
  }

  // Error state
  if (error && !corpseState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!corpseState) return null

  const isCurrentUserTurn = corpseState.currentContributor?.userId === userId
  const isWordCountValid = wordCount >= 50 && wordCount <= 100

  // Loading state while translations load
  if (!translations) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cargando interfaz de contribución...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Screen reader status updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isCurrentUserTurn ? 'Es tu turno para contribuir' : 'Esperando tu turno'}
        {timeRemaining !== null &&
          `Tiempo restante: ${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`}
      </div>

      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          {translations.contributionInterface.contributeTo} "{corpse.title}"
        </h1>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          {translations.contributionInterface.instructions}
        </p>
      </header>

      {/* Status and Timer */}
      <div className="mb-6">
        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6 dark:bg-gray-800">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {translations.contributionInterface.yourPosition}:{' '}
                {corpseState.queue.find((q) => q.isCurrentUser)?.position || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {translations.contributionInterface.status}:{' '}
                {corpse.status === 'active'
                  ? translations.waitingRoom.status.active
                  : corpse.status}
              </div>
            </div>
            {timeRemaining !== null && isCurrentUserTurn && (
              <div className="flex items-center justify-center">
                <CircularTimer
                  timeRemaining={timeRemaining}
                  totalTime={120}
                  size={60}
                  className="sm:hidden"
                />
                <CircularTimer
                  timeRemaining={timeRemaining}
                  totalTime={120}
                  size={80}
                  className="hidden sm:block"
                />
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(corpseState.queue.filter((q) => q.hasContributed).length / corpse.authors.length) * 100}%`,
              }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {corpseState.queue.filter((q) => q.hasContributed).length} de {corpse.authors.length}{' '}
            contribuciones completadas
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/50">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && !error && (
        <div className="mb-6 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/50">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {translations?.validation?.suggestionsTitle ||
                  'Sugerencias para mejorar tu contribución:'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <ul className="list-inside list-disc space-y-1">
                  {validationWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Writing Interface */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6 dark:bg-gray-800">
        <div className="mb-4">
          <label
            htmlFor="contribution"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {translations.contributionInterface.contributionLabel}
          </label>
          <textarea
            ref={textareaRef}
            id="contribution"
            value={draft}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={!isCurrentUserTurn}
            placeholder={
              isCurrentUserTurn
                ? translations.contributionInterface.contributionPlaceholder
                : translations.contributionInterface.waitingPlaceholder
            }
            className={cn(
              'min-h-[120px] w-full resize-none rounded-md border px-3 py-3 text-base focus:ring-2 focus:outline-none sm:h-64',
              !isCurrentUserTurn
                ? 'cursor-not-allowed bg-gray-100 opacity-50 dark:bg-gray-700'
                : 'bg-white focus:ring-blue-500 dark:bg-gray-900',
              'border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-100'
            )}
            aria-describedby="word-count-help contribution-instructions"
            aria-label="Campo de texto para tu contribución a la micronarrativa"
          />
        </div>

        {/* Instructions for screen readers */}
        <div id="contribution-instructions" className="sr-only">
          {translations.contributionInterface.contributionInstructions}
        </div>

        {/* Word Counter */}
        <WordCounter current={wordCount} min={50} max={100} />

        {/* Status */}
        <div className="flex justify-end">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isCurrentUserTurn
              ? translations.contributionInterface.yourTurn
              : translations.contributionInterface.waitingTurn}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isCurrentUserTurn && (
        <div
          className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          role="group"
          aria-label="Acciones de contribución"
        >
          <button
            ref={submitButtonRef}
            onClick={handleSubmit}
            disabled={isSubmitting || !isWordCountValid}
            className={cn(
              'min-h-[44px] flex-1 rounded-md px-4 py-3 text-base font-medium transition-colors sm:px-6',
              isSubmitting || !isWordCountValid
                ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800'
            )}
            aria-describedby={!isWordCountValid ? 'word-count-help' : undefined}
          >
            {isSubmitting ? (
              <>
                <div
                  className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden="true"
                ></div>
                {translations.contributionInterface.submitting}
              </>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {translations.contributionInterface.submitButton}
                </span>
                <span className="sm:hidden">
                  {translations.contributionInterface.submitButtonShort}
                </span>
              </>
            )}
          </button>

          <button
            ref={skipButtonRef}
            onClick={handleSkip}
            disabled={isSkipping}
            className={cn(
              'min-h-[44px] rounded-md border px-4 py-3 text-base font-medium transition-colors sm:px-6',
              isSkipping
                ? 'cursor-not-allowed border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600'
            )}
          >
            {isSkipping ? (
              <>
                <div
                  className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"
                  aria-hidden="true"
                ></div>
                {translations.contributionInterface.skipping}
              </>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {translations.contributionInterface.skipButton}
                </span>
                <span className="sm:hidden">
                  {translations.contributionInterface.skipButtonShort}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Previous Segments Preview */}
      {corpse.segments.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Segmentos anteriores
          </h2>
          <div className="space-y-4">
            {corpse.segments.map((segment) => (
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
                  {segment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
