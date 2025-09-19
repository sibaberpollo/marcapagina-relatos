'use client'

import { useEffect, useState } from 'react'
import { ThumbsUp, Bookmark } from 'lucide-react'
import { useSession } from 'next-auth/react'
import LoginModal from '../../auth/LoginModal'

type ReactionType = 'UP' | 'DOUBLE'

type Props = {
  slug: string
  contentType?: string
  compact?: boolean
  className?: string
  showHeading?: boolean
  renderMode?: 'full' | 'buttons'
}

export default function ReactionBar({
  slug,
  contentType = 'relato',
  compact = false,
  className = '',
  showHeading = true,
  renderMode = 'full',
}: Props) {
  const { status } = useSession()
  const [counts, setCounts] = useState<{ up: number; double: number }>({ up: 0, double: 0 })
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null)
  const [loading, setLoading] = useState(false)
  const [isRead, setIsRead] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginIntent, setLoginIntent] = useState<'READ' | ReactionType | null>(null)
  const CHANNEL = 'engage:update'

  async function fetchCounts() {
    const res = await fetch(
      `/api/reactions?slug=${encodeURIComponent(slug)}&contentType=${encodeURIComponent(contentType)}`,
      { cache: 'no-store' }
    )
    if (res.ok) {
      const json = await res.json()
      setCounts(json.counts)
      setUserReaction(json.userReaction)
      setIsRead(!!json.isRead)
    }
  }

  useEffect(() => {
    fetchCounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // Sincronizar con otras instancias (modal/footer) vía CustomEvent
  useEffect(() => {
    function onSync(e: Event) {
      const detail = (e as CustomEvent).detail as { slug: string; contentType: string }
      if (detail?.slug === slug && detail?.contentType === contentType) {
        fetchCounts()
      }
    }
    window.addEventListener(CHANNEL, onSync as EventListener)
    return () => window.removeEventListener(CHANNEL, onSync as EventListener)
  }, [slug, contentType])

  async function react(type: ReactionType) {
    setLoading(true)
    try {
      if (status === 'unauthenticated') {
        setLoginIntent(type)
        setLoginOpen(true)
        return
      }
      if (userReaction === type) {
        // toggle off
        const res = await fetch('/api/reactions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, contentType }),
        })
        if (res.status === 401) {
          setLoginOpen(true)
          return
        }
        if (res.ok) {
          setUserReaction(null)
          await fetchCounts()
          window.dispatchEvent(new CustomEvent(CHANNEL, { detail: { slug, contentType } }))
        }
      } else {
        const res = await fetch('/api/reactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, contentType, type }),
        })
        if (res.status === 401) {
          setLoginOpen(true)
          return
        }
        if (res.ok) {
          setUserReaction(type)
          // Marcar como leído automáticamente al reaccionar
          try {
            await fetch('/api/read', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slug, contentType, progress: 1 }),
            })
            setIsRead(true)
          } catch (_) {}
          await fetchCounts()
          window.dispatchEvent(new CustomEvent(CHANNEL, { detail: { slug, contentType } }))
        }
      }
    } finally {
      setLoading(false)
    }
  }

  async function toggleRead() {
    setLoading(true)
    try {
      if (status === 'unauthenticated') {
        setLoginIntent('READ')
        setLoginOpen(true)
        return
      }
      if (isRead) {
        const res = await fetch('/api/read', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, contentType }),
        })
        if (res.status === 401) {
          setLoginOpen(true)
          return
        }
        if (res.ok) {
          setIsRead(false)
          window.dispatchEvent(new CustomEvent(CHANNEL, { detail: { slug, contentType } }))
        }
      } else {
        const res = await fetch('/api/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, contentType, progress: 1 }),
        })
        if (res.status === 401) {
          setLoginOpen(true)
          return
        }
        if (res.ok) {
          setIsRead(true)
          window.dispatchEvent(new CustomEvent(CHANNEL, { detail: { slug, contentType } }))
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // Construir callbackUrl con intención pendiente
  function buildCallbackUrl(): string | undefined {
    if (typeof window === 'undefined' || !loginIntent) return undefined
    const url = new URL(window.location.href)
    url.searchParams.set('intent', loginIntent === 'READ' ? 'read' : loginIntent.toLowerCase())
    url.searchParams.set('slug', slug)
    url.searchParams.set('contentType', contentType)
    url.searchParams.set('r', Math.random().toString(36).slice(2))
    return url.toString()
  }

  // Al volver logueado con intent en la URL, ejecutar la acción pendiente 1 sola vez
  useEffect(() => {
    if (status !== 'authenticated') return
    try {
      const params = new URLSearchParams(window.location.search)
      const intent = params.get('intent')
      const qSlug = params.get('slug')
      const qType = params.get('contentType')
      if (!intent || qSlug !== slug || qType !== contentType) return
      ;(async () => {
        if (intent === 'read') {
          await fetch('/api/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, contentType, progress: 1 }),
          })
        } else if (intent === 'up' || intent === 'double') {
          await fetch('/api/reactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, contentType, type: intent.toUpperCase() }),
          })
          // También marcar leído
          await fetch('/api/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, contentType, progress: 1 }),
          })
        }
        await fetchCounts()
        window.dispatchEvent(new CustomEvent(CHANNEL, { detail: { slug, contentType } }))
        // Limpiar parámetros de la URL
        const clean = new URL(window.location.href)
        clean.searchParams.delete('intent')
        clean.searchParams.delete('slug')
        clean.searchParams.delete('contentType')
        clean.searchParams.delete('r')
        window.history.replaceState(null, '', clean.toString())
      })()
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, slug, contentType])

  const buttons = (
    <div className="flex items-center justify-around gap-4 sm:gap-6">
      <button
        disabled={loading}
        onClick={toggleRead}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-lg border border-black bg-white text-gray-900 transition-colors`}
        aria-label="Marcar como leído"
      >
        <span className="relative inline-flex h-5 w-5">
          {!isRead ? (
            <Bookmark className="h-5 w-5 text-gray-900" />
          ) : (
            <>
              <Bookmark
                className="absolute inset-0 h-5 w-5 text-[var(--color-accent)]"
                fill="currentColor"
                stroke="none"
              />
              <Bookmark
                className="absolute inset-0 h-5 w-5 text-black"
                fill="none"
                stroke="currentColor"
              />
            </>
          )}
        </span>
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-[10px] whitespace-nowrap text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
          {isRead ? 'Marcado como leído' : 'Marcar como leído'}
        </span>
      </button>
      <button
        disabled={loading}
        onClick={() => react('UP')}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-lg border border-black bg-white text-gray-900 transition-colors`}
        aria-label="Me gustó"
      >
        <span className="relative inline-flex h-5 w-5">
          {userReaction !== 'UP' ? (
            <ThumbsUp className="h-5 w-5 text-gray-900" />
          ) : (
            <>
              <ThumbsUp
                className="absolute inset-0 h-5 w-5 text-[var(--color-accent)]"
                fill="currentColor"
                stroke="none"
              />
              <ThumbsUp
                className="absolute inset-0 h-5 w-5 text-black"
                fill="none"
                stroke="currentColor"
              />
            </>
          )}
        </span>
        {!compact && (
          <span className="absolute -top-1 -right-1 rounded bg-black px-1.5 py-0.5 text-[10px] leading-none text-[var(--color-accent)]">
            {counts.up}
          </span>
        )}
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-[10px] whitespace-nowrap text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
          Like
        </span>
      </button>
      <button
        disabled={loading}
        onClick={() => react('DOUBLE')}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-lg border border-black bg-white text-gray-900 transition-colors`}
        aria-label="Me encantó"
      >
        <div className="relative flex items-center">
          <span className="relative inline-flex h-5 w-5">
            {userReaction !== 'DOUBLE' ? (
              <ThumbsUp className="h-5 w-5 text-gray-900" />
            ) : (
              <>
                <ThumbsUp
                  className="absolute inset-0 h-5 w-5 text-[var(--color-accent)]"
                  fill="currentColor"
                  stroke="none"
                />
                <ThumbsUp
                  className="absolute inset-0 h-5 w-5 text-black"
                  fill="none"
                  stroke="currentColor"
                />
              </>
            )}
          </span>
          <span className="relative -ml-2 inline-flex h-4 w-4">
            {userReaction !== 'DOUBLE' ? (
              <ThumbsUp className="h-4 w-4 text-gray-900" />
            ) : (
              <>
                <ThumbsUp
                  className="absolute inset-0 h-4 w-4 text-[var(--color-accent)]"
                  fill="currentColor"
                  stroke="none"
                />
                <ThumbsUp
                  className="absolute inset-0 h-4 w-4 text-black"
                  fill="none"
                  stroke="currentColor"
                />
              </>
            )}
          </span>
        </div>
        {!compact && (
          <span className="absolute -top-1 -right-1 rounded bg-black px-1.5 py-0.5 text-[10px] leading-none text-[var(--color-accent)]">
            {counts.double}
          </span>
        )}
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-[10px] whitespace-nowrap text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
          Superlike
        </span>
      </button>
    </div>
  )

  const callbackUrl = buildCallbackUrl()
  if (renderMode === 'buttons')
    return (
      <>
        {buttons}
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          callbackUrl={callbackUrl}
        />
      </>
    )

  return (
    <div className={`w-full ${className}`}>
      {showHeading && (
        <p className="font-small mb-2 text-center text-xs text-gray-500 sm:mb-3 sm:text-sm dark:text-gray-300">
          REACCIONA
        </p>
      )}
      <div className="mx-auto max-w-xs sm:max-w-none">{buttons}</div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} callbackUrl={callbackUrl} />
    </div>
  )
}
