'use client'

import { useEffect, useRef, useState } from 'react'
import { Share2 } from 'lucide-react'
import ReactionBar from './ReactionBar'

type Props = {
  slug: string
  title: string
  contentType?: string
  className?: string
}

export default function EngageBar({ slug, title, contentType = 'relato', className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const shareBaseUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : ''

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        <p className="sr-only md:not-sr-only md:mr-4 text-sm font-small text-gray-700 dark:text-gray-200 uppercase tracking-wide">Reacciona</p>
        <ReactionBar slug={slug} contentType={contentType} showHeading={false} renderMode="buttons" />
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Compartir"
            className="p-3 rounded-lg bg-white text-gray-900 border border-black hover:bg-[var(--color-accent)] transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50">
              <ul className="py-1 text-sm">
                <li>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareBaseUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Compartir en Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareBaseUrl)}&text=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Compartir en X
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareBaseUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareBaseUrl)
                      setOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Copiar enlace
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


