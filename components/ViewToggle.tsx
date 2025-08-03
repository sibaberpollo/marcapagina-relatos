'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, CalendarClock, PenLine, Waypoints } from 'lucide-react'

interface ViewToggleProps {
  total?: number
}

export default function ViewToggle({ total }: ViewToggleProps) {
  const pathname = usePathname()
  const isChronological = pathname === '/cronologico'
  const isAutores = pathname === '/autores'
  const isHome = pathname === '/'
  const isSeries = pathname === '/series'

  return (
    <div className="relative mb-6 overflow-x-auto thin-scrollbar">
      <div className="flex gap-2 pb-1 whitespace-nowrap">
        <Link
          href="/"
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            isHome
              ? 'bg-[var(--color-gray-900)] text-[var(--color-text-dark)] dark:bg-[var(--color-gray-100)] dark:text-[var(--color-gray-900)]'
              : 'bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-800)] text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] hover:bg-[var(--color-gray-200)] dark:hover:bg-[var(--color-gray-700)]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Destacados
        </Link>
        <Link
          href="/cronologico"
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            isChronological
              ? 'bg-[var(--color-gray-900)] text-[var(--color-text-dark)] dark:bg-[var(--color-gray-100)] dark:text-[var(--color-gray-900)]'
              : 'bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-800)] text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] hover:bg-[var(--color-gray-200)] dark:hover:bg-[var(--color-gray-700)]'
          }`}
        >
          <CalendarClock className="w-4 h-4" />
          {`Todos${typeof total === 'number' ? ` (${total})` : ''}`}
        </Link>
        <Link
          href="/series"
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            isSeries
              ? 'bg-[var(--color-gray-900)] text-[var(--color-text-dark)] dark:bg-[var(--color-gray-100)] dark:text-[var(--color-gray-900)]'
              : 'bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-800)] text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] hover:bg-[var(--color-gray-200)] dark:hover:bg-[var(--color-gray-700)]'
          }`}
        >
          <Waypoints className="w-4 h-4" />
          Series
        </Link>
        <Link
          href="/autores"
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            isAutores
              ? 'bg-[var(--color-gray-900)] text-[var(--color-text-dark)] dark:bg-[var(--color-gray-100)] dark:text-[var(--color-gray-900)]'
              : 'bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-800)] text-[var(--color-gray-700)] dark:text-[var(--color-gray-300)] hover:bg-[var(--color-gray-200)] dark:hover:bg-[var(--color-gray-700)]'
          }`}
        >
          <PenLine className="w-4 h-4" />
          Autores
        </Link>
      </div>
    </div>
  )
}
