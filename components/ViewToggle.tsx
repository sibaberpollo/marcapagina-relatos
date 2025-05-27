'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, CalendarClock } from 'lucide-react'

export default function ViewToggle() {
  const pathname = usePathname()
  const isChronological = pathname === '/cronologico'

  return (
    <div className="flex gap-2 mb-6">
      <Link
        href="/"
        className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
          !isChronological
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        Por cards
      </Link>
      <Link
        href="/cronologico"
        className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
          isChronological
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <CalendarClock className="w-4 h-4" />
        Cronológica
      </Link>
    </div>
  )
} 