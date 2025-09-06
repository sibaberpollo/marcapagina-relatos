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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold tracking-wide text-gray-900 uppercase sm:text-sm">
              Reacciona
            </p>
            <p className="text-[11px] text-gray-900 sm:text-xs">
              Guarda lo que lees y lo que te gusta para construir tu biblioteca y recibir mejores
              recomendaciones.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ReactionBar
              slug={slug}
              contentType={contentType}
              showHeading={false}
              renderMode="buttons"
            />
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Compartir"
                className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-black bg-white text-gray-900 transition-colors hover:bg-[var(--color-accent)]"
              >
                <Share2 className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 rounded bg-black px-1.5 py-0.5 text-[10px] leading-none text-[var(--color-accent)]">
                  {shareCount}
                </span>
              </button>
              {open && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-black bg-white shadow-lg">
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
                        className="w-full px-3 py-2 text-left hover:bg-gray-100"
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
