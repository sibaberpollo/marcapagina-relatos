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

  const progressPercentage = Math.max(0, Math.min(100, progress * 100))
  const statusText = isValid
    ? 'Conteo de palabras válido'
    : isUnder
      ? `Necesitas ${min - current} palabras más`
      : `Tienes ${current - max} palabras de más`

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
          aria-live="polite"
          aria-atomic="true"
        >
          {current} palabras
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={`Progreso del conteo de palabras: ${current} de ${max} palabras requeridas`}
      >
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            isValid ? 'bg-green-500' : isUnder ? 'bg-red-500' : 'bg-orange-500'
          )}
          style={{
            width: `${progressPercentage}%`,
            transform: isOver ? `scaleX(${Math.min(1, current / max)})` : 'scaleX(1)',
          }}
        />
      </div>

      {/* Status message */}
      <div
        className="text-xs text-gray-500 dark:text-gray-400"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {!isValid && statusText}
      </div>
    </div>
  )
}
