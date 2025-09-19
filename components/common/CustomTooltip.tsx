'use client'

import { useState } from 'react'

interface CustomTooltipProps {
  text: string
  tooltip: string
  addSpace?: boolean
}

export default function CustomTooltip({ text, tooltip, addSpace = true }: CustomTooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span className="relative inline-block">
      <span
        className="dark:hover:text-primary-400 cursor-help border-b border-dashed border-gray-500 hover:text-[#333333] dark:border-gray-400"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {text}
      </span>
      <span
        role="tooltip"
        className={`absolute top-full left-1/2 z-50 mt-2 w-64 max-w-xs -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-lg transition-opacity duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${show ? 'opacity-100' : 'pointer-events-none opacity-0'} `}
      >
        {tooltip}
      </span>
      {addSpace && ' '}
    </span>
  )
}
