'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface OfflineIndicatorProps {
  className?: string
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = React.useState(true)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Check initial status
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg',
        'flex items-center gap-2 text-sm font-medium',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      Sin conexión a internet
    </div>
  )
}