'use client'

import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'

interface SEOProps {
  title: string
  description?: string
  ogType?: string
  ogImage?: string
  twImage?: string
  children?: React.ReactNode
}

export function PageSEO({ title, description, ogType, ogImage, twImage, children }: SEOProps) {
  const pathname = usePathname()
  const url = `${siteMetadata.siteUrl}${pathname}`
  const publishedAt = new Date().toISOString()

  return (
    <>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {twImage && <meta name="twitter:image" content={twImage} />}
      {children}
    </>
  )
} 