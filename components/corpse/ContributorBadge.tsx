'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from 'lucide-react'

interface ContributorBadgeProps {
  userId: string
  name: string | null
  image: string | null
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

export function ContributorBadge({
  userId,
  name,
  image,
  size = 'md',
  showTooltip = false,
}: ContributorBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <Link
      href={`/autor/${userId}`}
      className={`group relative inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 ${
        showTooltip ? 'cursor-pointer' : ''
      }`}
      title={showTooltip ? `Ver perfil de ${name || 'autor'}` : undefined}
    >
      <div
        className={`flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${sizeClasses[size]}`}
      >
        {image ? (
          <Image
            src={image}
            alt={name || 'Autor'}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className={`font-semibold text-gray-600 dark:text-gray-300 ${textClasses[size]}`}>
            {(name || 'A').charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span className="max-w-20 truncate font-medium">{name || 'Anónimo'}</span>
    </Link>
  )
}

interface ContributorListProps {
  contributors: Array<{
    userId: string
    name: string | null
    image: string | null
  }>
  maxVisible?: number
  size?: 'sm' | 'md' | 'lg'
}

export function ContributorList({
  contributors,
  maxVisible = 3,
  size = 'md',
}: ContributorListProps) {
  const visibleContributors = contributors.slice(0, maxVisible)
  const remainingCount = contributors.length - maxVisible

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleContributors.map((contributor) => (
        <ContributorBadge
          key={contributor.userId}
          userId={contributor.userId}
          name={contributor.name}
          image={contributor.image}
          size={size}
          showTooltip={true}
        />
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1 text-sm text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <User className="h-4 w-4" />
          <span>+{remainingCount} más</span>
        </div>
      )}
    </div>
  )
}
