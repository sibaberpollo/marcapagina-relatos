'use client'

import { useState } from 'react'

interface CustomTooltipProps {
  text: string
  tooltip: string
  addSpace?: boolean
}

export default function CustomTooltip({
  text,
  tooltip,
  addSpace = true
}: CustomTooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span className="relative inline-block">
      <span
        className="
          border-b border-dashed border-gray-500 dark:border-gray-400 
          cursor-help hover:text-[#333333] dark:hover:text-primary-400
        "
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {text}
      </span>
      <span
        role="tooltip"
        className={`
          absolute z-50 w-64 p-3 mt-2 text-sm text-gray-800 bg-white
          border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800
          dark:text-gray-200 dark:border-gray-700 transition-opacity
          duration-200 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        {tooltip}
      </span>
      {addSpace && ' '}
    </span>
  )
}
