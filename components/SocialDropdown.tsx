"use client"

import siteMetadata from '@/data/siteMetadata'
import { Instagram, Facebook, Share2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const socialLinks = [
  {
    href: siteMetadata.instagram,
    label: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    href: siteMetadata.twitter,
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: siteMetadata.facebook,
    label: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
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
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-0 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg w-40 py-1 z-50">
          {socialLinks.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
