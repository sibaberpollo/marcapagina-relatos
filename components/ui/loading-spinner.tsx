import * as React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps extends React.ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg'
}

function LoadingSpinner({ className, size = 'md', ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div
      className={cn(
        'border-t-accent animate-spin rounded-full border-2 border-gray-300',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export { LoadingSpinner }
