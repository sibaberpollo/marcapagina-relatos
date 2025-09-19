'use client'
import { useState } from 'react'

export default function DescripcionToggle({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <p
        className={`text-lg leading-7 text-gray-700 transition-all dark:text-gray-300 ${
          expanded ? '' : 'line-clamp-2'
        }`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <button
        className="mt-2 flex items-center gap-2 rounded bg-gray-200 px-3 py-1.5 font-medium text-black shadow-sm transition-colors hover:bg-gray-300 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        style={{
          backgroundColor: 'var(--color-gray-200)',
          color: 'var(--color-gray-900)',
        }}
        onClick={() => setExpanded((v) => !v)}
        type="button"
      >
        {expanded ? (
          <>
            Mostrar menos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </>
        ) : (
          <>
            Mostrar más
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}
