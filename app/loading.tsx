import LoadingSpinner from '@/components/LoadingSpinner'
import SectionContainer from '@/components/SectionContainer'

export default function Loading() {
  return (
    <SectionContainer>
      <div className="space-y-2 pt-6 pb-4 md:space-y-5">
        {/* Spinner de navegación */}
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
        
        {/* Skeleton del contenido */}
        <div className="animate-pulse">
          {/* Skeleton del título */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          
          {/* Skeleton del grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
} 