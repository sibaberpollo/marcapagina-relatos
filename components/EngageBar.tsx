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
  const [shareCount, setShareCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const key = `share:${contentType}:${slug}`
    const v = window.localStorage.getItem(key)
    return v ? parseInt(v, 10) || 0 : 0
  })

  function bumpShareCount() {
    const next = shareCount + 1
    setShareCount(next)
    if (typeof window !== 'undefined') {
      const key = `share:${contentType}:${slug}`
      window.localStorage.setItem(key, String(next))
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-xl border border-black bg-[var(--color-accent)] p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">Reacciona</p>
            <p className="text-[11px] sm:text-xs text-gray-900">
              Guarda lo que lees y lo que te gusta para construir tu biblioteca y recibir mejores recomendaciones.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ReactionBar slug={slug} contentType={contentType} showHeading={false} renderMode="buttons" />
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Compartir"
                className="relative h-12 w-12 rounded-lg bg-white text-gray-900 border border-black hover:bg-[var(--color-accent)] transition-colors flex items-center justify-center"
              >
                <Share2 className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded bg-black text-[var(--color-accent)]">
                  {shareCount}
                </span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-black bg-white shadow-lg z-50">
                  <ul className="py-1 text-sm text-gray-900">
                    <li>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareBaseUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 hover:bg-gray-100"
                        onClick={bumpShareCount}
                      >
                        Compartir en Facebook
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareBaseUrl)}&text=${encodeURIComponent(title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 hover:bg-gray-100"
                        onClick={bumpShareCount}
                      >
                        Compartir en X
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(shareBaseUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 hover:bg-gray-100"
                        onClick={bumpShareCount}
                      >
                        WhatsApp
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(shareBaseUrl)
                          setOpen(false)
                          bumpShareCount()
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
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
      </div>
    </div>
  )
}


