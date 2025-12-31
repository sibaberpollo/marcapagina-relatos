import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
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
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Writing Interface Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-32 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>

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
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
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
      </CardContent>
    </Card>
  )
}
