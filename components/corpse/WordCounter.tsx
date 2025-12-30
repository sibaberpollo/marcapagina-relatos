'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface WordCounterProps {
  current: number
  min: number
  max: number
  className?: string
}

export function WordCounter({ current, min, max, className }: WordCounterProps) {
  const progress = Math.min((current - min) / (max - min), 1)
  const isValid = current >= min && current <= max
  const isUnder = current < min
  const isOver = current > max

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Palabras requeridas: {min}-{max}
        </span>
        <span
          className={cn(
            'font-medium',
            isValid
              ? 'text-green-600 dark:text-green-400'
              : isUnder
                ? 'text-red-600 dark:text-red-400'
                : 'text-orange-600 dark:text-orange-400'
          )}
        >
          {current} palabras
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            isValid ? 'bg-green-500' : isUnder ? 'bg-red-500' : 'bg-orange-500'
          )}
          style={{
            width: `${Math.max(0, Math.min(100, progress * 100))}%`,
            transform: isOver ? `scaleX(${Math.min(1, current / max)})` : 'scaleX(1)',
          }}
        />
      </div>

      {/* Status message */}
      {!isValid && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isUnder && `Necesitas ${min - current} palabras más`}
          {isOver && `Tienes ${current - max} palabras de más`}
        </div>
      )}
    </div>
  )
}
