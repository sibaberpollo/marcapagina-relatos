'use client';

/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'

const CustomLink = ({ href, className = '', ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const pathname = usePathname()
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')
  const isActive = isInternalLink && pathname === href
  const shouldShowActiveBorder = isActive && !className.includes('decoration-none')
  const activeClass = shouldShowActiveBorder ? 'border-b-2 border-accent' : ''
  const combinedClass = `${className} ${activeClass}`.trim()

  if (isInternalLink) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className={combinedClass} {...rest} />
      </Link>
    )
  }

  if (isAnchorLink) {
    return <a className={combinedClass} href={href} {...rest} />
  }

  return (
    <a className={combinedClass} target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}

export default CustomLink

