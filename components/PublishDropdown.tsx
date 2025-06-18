"use client";

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import CustomLink from './Link'

interface PublishDropdownProps {
  isMobile?: boolean
}

export default function PublishDropdown({ isMobile = false }: PublishDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const buttonClasses = isMobile
    ?
        'flex items-center px-2 py-1 rounded-md font-semibold bg-primary-500 text-black dark:text-gray-900 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 shadow transition-colors border border-primary-500 dark:border-primary-400 text-xs leading-none'
    :
        'ml-2 flex items-center px-4 py-2 rounded-md font-semibold bg-primary-500 text-black dark:text-gray-900 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 shadow transition-colors border-2 border-primary-500 dark:border-primary-400'

  const dropdownClasses = isMobile
    ? "absolute right-0 top-full mt-0 w-48 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-50 overflow-hidden"
    : "absolute right-0 top-full mt-0 w-48 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-50 overflow-hidden"

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        Publica
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className={dropdownClasses}>
          <div className="py-1">
            <CustomLink
              href="/publica"
              className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Formulario
            </CustomLink>
            <CustomLink
              href="/criterios-editoriales"
              className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Criterios editoriales
            </CustomLink>
          </div>
        </div>
      )}
    </div>
  )
} 