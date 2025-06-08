'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ExpandableTextProps {
  children: React.ReactNode
  previewLines?: number
  className?: string
}

export default function ExpandableText({ 
  children, 
  previewLines = 2, 
  className = '' 
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={className}>
      {isExpanded ? (
        <div>{children}</div>
      ) : (
        <div 
          style={{ 
            display: '-webkit-box',
            WebkitLineClamp: previewLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {children}
        </div>
      )}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <span>
          {isExpanded ? 'Leer menos' : 'Leer más'}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
    </div>
  )
} 