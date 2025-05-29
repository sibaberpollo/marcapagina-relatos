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

  // Función para generar números de página visibles
  const getVisiblePages = (): (number | string)[] => {
    const delta = 2 // Número de páginas a mostrar a cada lado de la actual
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    // Siempre incluir primera página
    range.push(1)

    // Calcular el rango alrededor de la página actual
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    // Siempre incluir última página (si no es la primera)
    if (totalPages > 1) {
      range.push(totalPages)
    }

    // Agregar puntos suspensivos donde sea necesario
    let prev = 0
    for (const page of range) {
      if (page - prev === 2) {
        rangeWithDots.push(prev + 1)
      } else if (page - prev !== 1) {
        rangeWithDots.push('...')
      }
      rangeWithDots.push(page)
      prev = page
    }

    return rangeWithDots
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
                  Por: <Link href={`/autor/${item.authorName.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                    {item.authorName}
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        )
      })}
      
      {/* Paginación mejorada */}
      {totalPages > 1 && (
        <nav className="pt-8 pb-4">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {/* Botón Anterior */}
            <Link
              href={currentPage > 1 ? `/cronologico?page=${currentPage - 1}` : '#'}
              className={`px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              ← Anterior
            </Link>
            
            {/* Números de página con puntos suspensivos */}
            {getVisiblePages().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`dots-${index}`} className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                )
              }
              
              const pageNum = page as number
              return (
                <Link
                  key={pageNum}
                  href={`/cronologico?page=${pageNum}`}
                  className={`px-3 py-2 text-sm rounded-md transition-colors min-w-[40px] text-center ${
                    currentPage === pageNum
                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}
            
            {/* Botón Siguiente */}
            <Link
              href={currentPage < totalPages ? `/cronologico?page=${currentPage + 1}` : '#'}
              className={`px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              Siguiente →
            </Link>
          </div>
          
          {/* Información de página */}
          <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            Página {currentPage} de {totalPages} ({items.length} relatos en total)
          </div>
        </nav>
      )}
    </div>
  )
} 