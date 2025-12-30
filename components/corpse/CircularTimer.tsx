'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CircularTimerProps {
  timeRemaining: number
  totalTime: number
  size?: number
  className?: string
}

export function CircularTimer({
  timeRemaining,
  totalTime,
  size = 120,
  className,
}: CircularTimerProps) {
  const radius = (size - 8) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (timeRemaining / totalTime) * circumference

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const isWarning = timeRemaining <= 30
  const isCritical = timeRemaining <= 10

  return (
    <div className={cn('relative', className)}>
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        aria-labelledby="timer-label"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-1000 ease-linear',
            isCritical ? 'text-red-500' : isWarning ? 'text-orange-500' : 'text-blue-500'
          )}
        />
      </svg>
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div
            className={cn(
              'font-mono text-2xl font-bold',
              isCritical
                ? 'text-red-600 dark:text-red-400'
                : isWarning
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-900 dark:text-gray-100'
            )}
            id="timer-label"
          >
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">restante</div>
        </div>
      </div>
    </div>
  )
}
