import LoadingSpinner from '@/components/LoadingSpinner'
import SectionContainer from '@/components/SectionContainer'

export default function Loading() {
  return (
    <SectionContainer>
      <div className="space-y-2 pt-6 pb-4 md:space-y-5">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-3/4"></div>
      </div>
      <LoadingSpinner />
    </SectionContainer>
  )
} 