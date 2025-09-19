'use client'

import Link from '@/components/common/Link'

interface RelatoItem {
  title: string
  description: string
  href: string
  authorName: string
  authorHref: string
  publishedAt: string
}

interface ChronologicalLayoutProps {
  items: RelatoItem[]
  itemsPerPage?: number
  currentPage?: number
  basePath?: string
}

export default function ChronologicalLayout({
  items,
  itemsPerPage = 10,
  currentPage = 1,
  basePath = '/cronologico',
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
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
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
                <div className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
                  {day}
                </div>
                <div className="text-sm font-medium text-gray-600 md:text-base dark:text-gray-400">
                  {month}
                </div>
              </div>

              {/* Columna de contenido */}
              <div>
                <h2 className="mb-2 text-xl font-bold md:text-2xl">
                  <Link href={item.href} className="hover:underline">
                    {item.title}
                  </Link>
                </h2>
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Por:{' '}
                  <Link href={item.authorHref} className="hover:underline">
                    {item.authorName}
                  </Link>
                </div>
                <p className="line-clamp-2 text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </div>
          </article>
        )
      })}

      {/* Paginación mejorada */}
      {totalPages > 1 && (
        <nav className="pt-8 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-1">
            {/* Botón Anterior */}
            <Link
              href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : '#'}
              className={`rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${
                currentPage === 1 ? 'pointer-events-none cursor-not-allowed opacity-50' : ''
              }`}
            >
              ← Anterior
            </Link>

            {/* Números de página con puntos suspensivos */}
            {getVisiblePages().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    ...
                  </span>
                )
              }

              const pageNum = page as number
              return (
                <Link
                  key={pageNum}
                  href={`${basePath}?page=${pageNum}`}
                  className={`min-w-[40px] rounded-md px-3 py-2 text-center text-sm transition-colors ${
                    currentPage === pageNum
                      ? 'bg-gray-900 font-medium text-white dark:bg-gray-100 dark:text-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}

            {/* Botón Siguiente */}
            <Link
              href={currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : '#'}
              className={`rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${
                currentPage === totalPages
                  ? 'pointer-events-none cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              Siguiente →
            </Link>
          </div>

          {/* Información de página */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Página {currentPage} de {totalPages} ({items.length} relatos en total)
          </div>
        </nav>
      )}
    </div>
  )
}
