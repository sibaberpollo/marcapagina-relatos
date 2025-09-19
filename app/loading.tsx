import LoadingSpinner from '@/components/common/LoadingSpinner'
import SectionContainer from '@/components/layout/SectionContainer'

export default function Loading() {
  return (
    <SectionContainer>
      <div className="space-y-2 pt-6 pb-4 md:space-y-5">
        {/* Spinner de navegación */}
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>

        {/* Skeleton del contenido */}
        <div className="animate-pulse">
          {/* Skeleton del título */}
          <div className="mb-4 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-8 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>

          {/* Skeleton del grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
