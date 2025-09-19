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
    <div className="thin-scrollbar relative mb-6 overflow-x-auto">
      <div className="flex gap-2 pb-1 whitespace-nowrap">
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
            isHome
              ? 'bg-[var(--color-gray-900)] text-[var(--color-text-dark)] dark:bg-[var(--color-gray-100)] dark:text-[var(--color-gray-900)]'
              : 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-800)] dark:text-[var(--color-gray-300)] dark:hover:bg-[var(--color-gray-700)]'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Destacados
        </Link>
        <Link
          href="/cronologico"
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
            isChronological
              ? 'bg-[var(--color-gray-900)] text-[var(--color-text-dark)] dark:bg-[var(--color-gray-100)] dark:text-[var(--color-gray-900)]'
              : 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-800)] dark:text-[var(--color-gray-300)] dark:hover:bg-[var(--color-gray-700)]'
          }`}
        >
          <CalendarClock className="h-4 w-4" />
          {`Todos${typeof total === 'number' ? ` (${total})` : ''}`}
        </Link>
        <Link
          href="/series"
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
            isSeries
              ? 'bg-[var(--color-gray-900)] text-[var(--color-text-dark)] dark:bg-[var(--color-gray-100)] dark:text-[var(--color-gray-900)]'
              : 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-800)] dark:text-[var(--color-gray-300)] dark:hover:bg-[var(--color-gray-700)]'
          }`}
        >
          <Waypoints className="h-4 w-4" />
          Series
        </Link>
        <Link
          href="/autores"
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
            isAutores
              ? 'bg-[var(--color-gray-900)] text-[var(--color-text-dark)] dark:bg-[var(--color-gray-100)] dark:text-[var(--color-gray-900)]'
              : 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-800)] dark:text-[var(--color-gray-300)] dark:hover:bg-[var(--color-gray-700)]'
          }`}
        >
          <PenLine className="h-4 w-4" />
          Autores
        </Link>
      </div>
    </div>
  )
}
