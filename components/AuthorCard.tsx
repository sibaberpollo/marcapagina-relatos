'use client'

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
    <div className="h-full overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
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
    </div>
  )
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '')
  return letters.join('') || 'A'
}
