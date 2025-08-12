"use client"

import Link from 'next/link'

type Props = {
  authorSlug: string
  authorName: string
  authorImage?: string
  href?: string
}

// Card simple de autor (seguir deshabilitado para primer release)
export default function AuthorCard({ authorSlug, authorName, authorImage, href }: Props) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden h-full bg-white dark:bg-gray-950">
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
    </div>
  )
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '')
  return letters.join('') || 'A'
}


