'use client'

import { useState } from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: string
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span className="group relative inline-block">
      <span
        className="hover:text-primary-500 dark:hover:text-primary-400 cursor-help border-b border-dashed border-gray-500 dark:border-gray-400"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      <div
        className={`absolute z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 pt-8 text-sm text-gray-800 shadow-lg transition-opacity duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${
          show ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        title="Haz clic en el botón para cerrar"
      >
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 flex items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Cerrar
        </button>
        {content}
      </div>
    </span>
  )
}
