'use client'

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

// Seguimiento deshabilitado temporalmente para primer release
export default function AuthorFollowCard({ authorSlug, authorName, authorImage, href }: Props) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Mantener sincronizado con el prop si viene de un padre (usado en /autores)
  useEffect(() => {}, [])

  // Fallback: si no recibimos props de control, consultamos una sola vez para este autor
  useEffect(() => {}, [authorSlug])

  async function toggleFollow() {
    /* disabled */
  }

  return (
    <div className="h-full overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Header del card: avatar centrado arriba y nombre centrado debajo */}
      <Link href={href || `/autor/${authorSlug}`} className="block p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-200 sm:h-20 sm:w-20 dark:bg-gray-800">
            {authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authorImage} alt={authorName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-base font-semibold sm:text-lg">{initials(authorName)}</span>
            )}
          </div>
          <div className="w-full">
            <div className="truncate text-sm font-semibold text-gray-900 sm:text-base dark:text-gray-100">
              {authorName}
            </div>
          </div>
        </div>
      </Link>

      {/* Footer del card (acciones) */}
      <div className="flex items-center justify-start gap-3 border-t border-gray-200 bg-white/60 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/60">
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
          <Star className={`h-5 w-5`} />
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
