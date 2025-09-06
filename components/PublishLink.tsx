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
  const baseClasses =
    'font-bold flex items-center gap-2 px-3 py-1 rounded-lg bg-black text-[var(--color-accent)] hover:bg-gray-800 transition-colors duration-200 dark:border-2 dark:border-[var(--color-accent)]'
  const visibilityClasses = isMobile
    ? 'sm:hidden'
    : variant === 'desktop'
      ? 'hidden sm:inline-flex'
      : ''

  return (
    <Link href={href} onClick={onClick} className={`${visibilityClasses} ${baseClasses}`}>
      {label}
    </Link>
  )
}
