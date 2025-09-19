'use client'

import siteMetadata from '@/data/siteMetadata'
import { Instagram, Facebook, Share2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const socialLinks = [
  {
    href: siteMetadata.instagram,
    label: 'Instagram',
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    href: siteMetadata.twitter,
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: siteMetadata.facebook,
    label: 'Facebook',
    icon: <Facebook className="h-5 w-5" />,
  },
]

export default function SocialDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative hidden sm:block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Compartir"
        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Share2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-0 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          {socialLinks.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
