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
        className={`absolute z-50 w-64 p-3 mt-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-opacity duration-200 ${
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {content}
      </div>
    </span>
  )
} 