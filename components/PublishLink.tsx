import Link from './Link'
import React from 'react'

type PublishLinkProps = {
  variant?: 'desktop' | 'mobile' | 'mobileNav'
  onClick?: () => void
}

export default function PublishLink({ variant = 'desktop', onClick }: PublishLinkProps) {
  const href = '/publica'
  const isMobile = variant === 'mobile'
  const label = isMobile ? 'Publica' : 'Publica con nosotros'
  const baseClasses = 'font-bold flex items-center gap-2 px-3 py-1 rounded-lg bg-black text-[#faff00] hover:bg-gray-800 transition-colors duration-200'
  const visibilityClasses = isMobile
    ? 'sm:hidden'
    : variant === 'desktop'
      ? 'hidden sm:inline-flex'
      : ''

  return (
    <Link href={href} onClick={onClick} className={`${visibilityClasses} ${baseClasses}`}>      
      {label}
      <span
        className="inline-flex items-center justify-center rounded-full ml-2"
        style={{ background: '#faff00', width: 22, height: 22 }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" fill="#222" />
          <path d="M17.71 6.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#222" />
        </svg>
      </span>
    </Link>
  )
} 