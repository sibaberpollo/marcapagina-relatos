'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User, PenTool, FileText, Clock } from 'lucide-react'

interface ContributorProfileProps {
  userId: string
  name: string | null
  image: string | null
  contributionCount?: number
  bio?: string
  showStats?: boolean
  className?: string
}

export function ContributorProfile({
  userId,
  name,
  image,
  contributionCount = 0,
  bio,
  showStats = false,
  className = '',
}: ContributorProfileProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        {image ? (
          <Image
            src={image}
            alt={name || 'Autor'}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {(name || 'A').charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/autor/${userId}`}
          className="block truncate font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {name || 'Autor anónimo'}
        </Link>
        {bio && <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{bio}</p>}
        {showStats && contributionCount > 0 && (
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <PenTool className="h-3 w-3" />
              <span>{contributionCount} contribuciones</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ContributorCardProps extends ContributorProfileProps {
  hasContributed: boolean
  isCurrentContributor: boolean
  timeRemaining?: number
}

export function ContributorCard({
  userId,
  name,
  image,
  contributionCount = 0,
  hasContributed,
  isCurrentContributor,
  timeRemaining,
  className = '',
}: ContributorCardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800 ${
        isCurrentContributor ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <ContributorProfile
          userId={userId}
          name={name}
          image={image}
          contributionCount={contributionCount}
          showStats={true}
        />
        <div className="ml-2 flex flex-col items-end gap-1">
          {isCurrentContributor && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Clock className="mr-1 h-3 w-3" />
              {timeRemaining ? `${Math.ceil(timeRemaining / 1000)}s` : 'Escribiendo'}
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              hasContributed
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {hasContributed ? 'Contribuyó' : 'Esperando'}
          </span>
        </div>
      </div>
    </div>
  )
}
