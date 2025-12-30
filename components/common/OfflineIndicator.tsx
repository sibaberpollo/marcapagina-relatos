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
        'fixed top-4 right-4 z-50 rounded-md bg-red-600 px-4 py-2 text-white shadow-lg',
        'flex items-center gap-2 text-sm font-medium',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
      Sin conexión a internet
    </div>
  )
}
