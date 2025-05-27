'use client'

import Link from '@/components/Link'

interface RelatoItem {
  title: string
  description: string
  href: string
  authorName: string
  publishedAt: string
}

interface ChronologicalLayoutProps {
  items: RelatoItem[]
  itemsPerPage?: number
  currentPage?: number
}

export default function ChronologicalLayout({ 
  items, 
  itemsPerPage = 10,
  currentPage = 1
}: ChronologicalLayoutProps) {
  const totalPages = Math.ceil(items.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('es-ES', { month: 'short' }).toUpperCase()
    return { day, month }
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {currentItems.map((item, index) => {
        const { day, month } = formatDate(item.publishedAt)
        
        return (
          <article key={index} className="py-6">
            <div className="grid grid-cols-[80px_1fr] gap-4 md:gap-6">
              {/* Columna de fecha */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {day}
                </div>
                <div className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400">
                  {month}
                </div>
              </div>
              
              {/* Columna de contenido */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  <Link
                    href={item.href}
                    className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {item.title}
                  </Link>
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Por: {item.authorName}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        )
      })}
      
      {/* Paginación */}
      {totalPages > 1 && (
        <nav className="pt-8 pb-4">
          <div className="flex items-center justify-center gap-2">
            {/* Botón Anterior */}
            <Link
              href={currentPage > 1 ? `/cronologico?page=${currentPage - 1}` : '#'}
              className={`px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              Anterior
            </Link>
            
            {/* Números de página */}
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1
                return (
                  <Link
                    key={pageNum}
                    href={`/cronologico?page=${pageNum}`}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currentPage === pageNum
                        ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </Link>
                )
              })}
            </div>
            
            {/* Botón Siguiente */}
            <Link
              href={currentPage < totalPages ? `/cronologico?page=${currentPage + 1}` : '#'}
              className={`px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              Siguiente
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
} 