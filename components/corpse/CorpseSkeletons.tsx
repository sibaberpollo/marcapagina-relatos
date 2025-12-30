import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ContributionSkeletonProps {
  className?: string
}

export function ContributionSkeleton({ className }: ContributionSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Status Card Skeleton */}
      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

      {/* Writing Interface Skeleton */}
      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-32 w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  )
}

interface WaitingRoomSkeletonProps {
  className?: string
}

export function WaitingRoomSkeleton({ className }: WaitingRoomSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Status Card */}
      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

interface CorpseCardSkeletonProps {
  className?: string
}

export function CorpseCardSkeleton({ className }: CorpseCardSkeletonProps) {
  return (
    <div className={cn('rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800', className)}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}