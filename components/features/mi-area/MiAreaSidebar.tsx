'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/biblioteca-personal', label: 'Inicio' },
  { href: '/biblioteca-personal/siguiendo', label: 'Siguiendo' },
  { href: '/biblioteca-personal/leidos', label: 'Leídos' },
]

export default function MiAreaSidebar() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navegación de mi área" className="w-full">
      {/* Mobile: barra horizontal scrollable */}
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2 md:hidden dark:border-gray-800 dark:bg-gray-950">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Desktop: sidebar vertical */}
      <ul className="hidden gap-1 py-2 md:flex md:flex-col">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
