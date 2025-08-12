'use client'

import { useEffect, useState } from 'react'
import { ThumbsUp, CheckCircle2 } from 'lucide-react'

type ReactionType = 'UP' | 'DOUBLE'

type Props = {
  slug: string
  contentType?: string
  compact?: boolean
  className?: string
  showHeading?: boolean
  renderMode?: 'full' | 'buttons'
}

export default function ReactionBar({ slug, contentType = 'relato', compact = false, className = '', showHeading = true, renderMode = 'full' }: Props) {
  const [counts, setCounts] = useState<{ up: number; double: number }>({ up: 0, double: 0 })
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null)
  const [loading, setLoading] = useState(false)
  const [isRead, setIsRead] = useState(false)
  const CHANNEL = 'engage:update'

  async function fetchCounts() {
    const res = await fetch(`/api/reactions?slug=${encodeURIComponent(slug)}&contentType=${encodeURIComponent(contentType)}`, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      setCounts(json.counts)
      setUserReaction(json.userReaction)
    }
    const r = await fetch(`/api/read?slug=${encodeURIComponent(slug)}&contentType=${encodeURIComponent(contentType)}`, { cache: 'no-store' })
    if (r.ok) {
      const j = await r.json()
      setIsRead(!!j.isRead)
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
      if (userReaction === type) {
        // toggle off
        const res = await fetch('/api/reactions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, contentType }),
        })
        if (res.status === 401) {
          window.location.href = '/api/auth/signin'
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
          window.location.href = '/api/auth/signin'
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
      if (isRead) {
        const res = await fetch('/api/read', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, contentType }),
        })
        if (res.status === 401) { window.location.href = '/api/auth/signin'; return }
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
        if (res.status === 401) { window.location.href = '/api/auth/signin'; return }
        if (res.ok) {
          setIsRead(true)
          window.dispatchEvent(new CustomEvent(CHANNEL, { detail: { slug, contentType } }))
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const buttons = (
      <div className="flex items-center justify-around gap-6">
        <button
          disabled={loading}
          onClick={toggleRead}
          className={`relative p-3 rounded-lg transition-colors border border-black ${
            isRead
              ? 'bg-[var(--color-accent)] text-gray-900 hover:brightness-95'
              : 'bg-white text-gray-900 hover:bg-[var(--color-accent)]'
          }`}
          aria-label="Marcar como leído"
        >
          <CheckCircle2 className={`h-5 w-5`} />
        </button>
        <button
          disabled={loading}
          onClick={() => react('UP')}
          className={`relative p-3 rounded-lg transition-colors border border-black ${
            userReaction === 'UP'
              ? 'bg-[var(--color-accent)] text-gray-900 hover:brightness-95'
              : 'bg-white text-gray-900 hover:bg-[var(--color-accent)]'
          }`}
          aria-label="Me gustó"
        >
          <ThumbsUp className={`h-5 w-5`} />
          {!compact && (
            <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded bg-black text-[var(--color-accent)]">
              {counts.up}
            </span>
          )}
        </button>
        <button
          disabled={loading}
          onClick={() => react('DOUBLE')}
          className={`relative p-3 rounded-lg transition-colors border border-black ${
            userReaction === 'DOUBLE'
              ? 'bg-[var(--color-accent)] text-gray-900 hover:brightness-95'
              : 'bg-white text-gray-900 hover:bg-[var(--color-accent)]'
          }`}
          aria-label="Me encantó"
        >
          <div className="relative flex items-center">
            <ThumbsUp className={`h-5 w-5`} />
            <ThumbsUp className={`h-4 w-4 -ml-2`} />
          </div>
          {!compact && (
            <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded bg-black text-[var(--color-accent)]">
              {counts.double}
            </span>
          )}
        </button>
      </div>
  )

  if (renderMode === 'buttons') return buttons

  return (
    <div className={`w-full ${className}`}>
      {showHeading && (
        <p className="text-center text-sm font-small text-gray-500 dark:text-gray-300 mb-3">REACCIONA</p>
      )}
      {buttons}
    </div>
  )
}


