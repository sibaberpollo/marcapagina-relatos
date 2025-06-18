'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import CustomLink from './Link'

interface LanguageDropdownProps {
  isMobile?: boolean
  inMobileMenu?: boolean
}

export default function LanguageDropdown({ isMobile = false, inMobileMenu = false }: LanguageDropdownProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getBasePath = () => (pathname.startsWith('/en/') ? pathname.slice(3) : pathname)
  const basePath = getBasePath()
  const hasTranslations = ['/memes-merch-descargas'].includes(basePath)
  const currentLocale = pathname.startsWith('/en/') ? 'en' : 'es'

  // Force re-render cuando cambie el pathname
  useEffect(() => {
    // Este efecto fuerza una actualización cuando cambia la URL
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!hasTranslations) {
    return null
  }

  // Si está en el menú móvil, mostrar una versión simple sin dropdown
  if (inMobileMenu) {
    return (
      <div className="flex gap-3">
        <CustomLink
          href={basePath}
          className={`px-3 py-2 rounded-md font-semibold border text-sm transition-colors ${
            currentLocale === 'es' 
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => {
            if (currentLocale === 'en') {
              window.location.href = basePath
            }
          }}
        >
          ES
        </CustomLink>
        <CustomLink
          href={`/en${basePath}`}
          className={`px-3 py-2 rounded-md font-semibold border text-sm transition-colors ${
            currentLocale === 'en' 
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => {
            if (currentLocale === 'es') {
              window.location.href = `/en${basePath}`
            }
          }}
        >
          EN
        </CustomLink>
      </div>
    )
  }

  const buttonClasses = isMobile
    ? 'flex items-center px-2 py-1 rounded-md font-semibold border text-xs leading-none text-gray-700 dark:text-gray-200'
    : 'flex items-center px-3 py-2 rounded-md font-semibold border text-sm text-gray-700 dark:text-gray-200'

  const dropdownClasses =
    'absolute right-0 top-full mt-0 w-28 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-50 overflow-hidden'

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={buttonClasses} aria-label="Cambiar idioma">
        {currentLocale.toUpperCase()}
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className={dropdownClasses}>
          <div className="py-1">
            <CustomLink
              href={basePath}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => {
                setIsOpen(false)
                if (currentLocale === 'en') {
                  window.location.href = basePath
                }
              }}
            >
              ES
            </CustomLink>
            <CustomLink
              href={`/en${basePath}`}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => {
                setIsOpen(false)
                if (currentLocale === 'es') {
                  window.location.href = `/en${basePath}`
                }
              }}
            >
              EN
            </CustomLink>
          </div>
        </div>
      )}
    </div>
  )
}
