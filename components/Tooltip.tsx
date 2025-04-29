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
        className={`absolute z-50 w-64 p-3 pr-6 mt-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-opacity duration-200 ${
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        title="Haz clic en la X para cerrar"
      >
        <button 
          onClick={() => setShow(false)}
          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        {content}
      </div>
    </span>
  )
} 