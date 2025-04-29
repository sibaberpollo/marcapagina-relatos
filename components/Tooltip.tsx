'use client'

import { useState } from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: string
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span className="relative inline-block group">
      <span
        className="border-b border-dashed border-gray-500 dark:border-gray-400 cursor-help hover:text-primary-500 dark:hover:text-primary-400"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      <div
        className={`absolute z-50 w-72 p-3 pt-8 mt-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-opacity duration-200 ${
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        title="Haz clic en el botón para cerrar"
      >
        <button 
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 px-2 py-1 flex items-center justify-center text-xs rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600 font-medium"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Cerrar
        </button>
        {content}
      </div>
    </span>
  )
} 