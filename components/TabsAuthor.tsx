'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

type Tab = 'relatos' | 'series' | 'articulos'

interface TabsAuthorProps {
  onTabChange: (tab: Tab) => void
  initialTab?: Tab
}

export default function TabsAuthor({ onTabChange, initialTab = 'relatos' }: TabsAuthorProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Determinar el tab activo desde los parámetros de búsqueda o usar el initialTab
  const tabParam = searchParams.get('tab') as Tab | null
  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam && (tabParam === 'relatos' || tabParam === 'series' || tabParam === 'articulos')
      ? tabParam
      : initialTab
  )

  // Actualizar la URL cuando cambie el tab
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    onTabChange(tab)

    // Crear un nuevo URLSearchParams y establecer el tab
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)

    // Actualizar la URL con el nuevo parámetro sin recargar la página
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Escuchar cambios en los parámetros de búsqueda para mantener sincronizado el estado
  useEffect(() => {
    if (tabParam && (tabParam === 'relatos' || tabParam === 'series' || tabParam === 'articulos')) {
      setActiveTab(tabParam)
      onTabChange(tabParam)
    }
  }, [tabParam, onTabChange])

  return (
    <div className="tabs mb-6 flex border-b border-[var(--color-gray-200)] dark:border-[var(--color-gray-700)]">
      <button
        onClick={() => handleTabChange('relatos')}
        className={`mr-2 rounded-t-lg px-4 py-2 font-medium transition-colors duration-200 ${
          activeTab === 'relatos'
            ? 'bg-black text-[var(--color-accent)] dark:bg-[var(--color-gray-700)] dark:text-[var(--color-text-dark)]'
            : 'bg-transparent text-[var(--color-text-light)] hover:bg-gray-100 hover:text-black dark:text-[var(--color-text-dark)] dark:hover:bg-[var(--color-gray-700)]'
        } `}
      >
        Relatos
      </button>
      <button
        onClick={() => handleTabChange('series')}
        className={`mr-2 rounded-t-lg px-4 py-2 font-medium transition-colors duration-200 ${
          activeTab === 'series'
            ? 'bg-black text-[var(--color-accent)] dark:bg-[var(--color-gray-700)] dark:text-[var(--color-text-dark)]'
            : 'bg-transparent text-[var(--color-text-light)] hover:bg-gray-100 hover:text-black dark:text-[var(--color-text-dark)] dark:hover:bg-[var(--color-gray-700)]'
        } `}
      >
        Series
      </button>
      <button
        onClick={() => handleTabChange('articulos')}
        className={`rounded-t-lg px-4 py-2 font-medium transition-colors duration-200 ${
          activeTab === 'articulos'
            ? 'bg-black text-[var(--color-accent)] dark:bg-[var(--color-gray-700)] dark:text-[var(--color-text-dark)]'
            : 'bg-transparent text-[var(--color-text-light)] hover:bg-gray-100 hover:text-black dark:text-[var(--color-text-dark)] dark:hover:bg-[var(--color-gray-700)]'
        } `}
      >
        No ficción
      </button>
    </div>
  )
}
