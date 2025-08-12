"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

type Props = {
  authorSlug: string
  authorName: string
  authorImage?: string
  href?: string
  isFollowing?: boolean
  onToggle?: (authorSlug: string, next: boolean) => Promise<void> | void
}

export default function AuthorFollowCard({ authorSlug, authorName, authorImage, href, isFollowing: isFollowingProp, onToggle }: Props) {
  const [isFollowing, setIsFollowing] = useState<boolean>(!!isFollowingProp)
  const [loading, setLoading] = useState<boolean>(false)

  // Mantener sincronizado con el prop si viene de un padre (usado en /autores)
  useEffect(() => {
    if (typeof isFollowingProp === 'boolean') setIsFollowing(isFollowingProp)
  }, [isFollowingProp])

  // Fallback: si no recibimos props de control, consultamos una sola vez para este autor
  useEffect(() => {
    if (typeof isFollowingProp === 'boolean') return
    let mounted = true
    fetch('/api/follow', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        const set = new Set<string>((data?.follows || []).map((f: any) => f.authorSlug))
        setIsFollowing(set.has(authorSlug))
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [authorSlug, isFollowingProp])

  async function toggleFollow() {
    setLoading(true)
    try {
      if (onToggle) {
        await onToggle(authorSlug, !isFollowing)
        return
      }
      if (!isFollowing) {
        await fetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ authorSlug }),
        })
        setIsFollowing(true)
      } else {
        await fetch(`/api/follow?authorSlug=${encodeURIComponent(authorSlug)}`, { method: 'DELETE' })
        setIsFollowing(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden h-full bg-white dark:bg-gray-950">
      {/* Header del card: avatar centrado arriba y nombre centrado debajo */}
      <Link href={href || `/autor/${authorSlug}`} className="block p-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
            {authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base sm:text-lg font-semibold">{initials(authorName)}</span>
            )}
          </div>
          <div className="w-full">
            <div className="truncate font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
              {authorName}
            </div>
          </div>
        </div>
      </Link>

      {/* Footer del card (acciones) */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-start gap-3 bg-white/60 dark:bg-gray-950/60">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFollow()
          }}
          aria-pressed={isFollowing}
          disabled={loading}
          className={`inline-flex items-center justify-center rounded-full p-2 transition-colors ${
            isFollowing
              ? 'text-yellow-500 hover:text-yellow-400'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
          }`}
          aria-label={isFollowing ? 'Dejar de seguir' : 'Seguir'}
          title={isFollowing ? 'Dejar de seguir' : 'Seguir'}
        >
          <Star className={`w-5 h-5 ${isFollowing ? 'fill-yellow-400 stroke-yellow-500' : ''}`} />
        </button>
      </div>
    </div>
  )
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '')
  return letters.join('') || 'A'
}


