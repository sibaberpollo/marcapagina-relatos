import siteMetadata from '@/data/siteMetadata'

interface RelatedLink {
  url: string
  title: string
  description?: string
  type: 'relato' | 'autor' | 'serie' | 'articulo'
}

interface InternalLinkingSchemaProps {
  currentUrl: string
  currentTitle: string
  relatedLinks: RelatedLink[]
}

export default function InternalLinkingSchema({
  currentUrl,
  currentTitle,
  relatedLinks
}: InternalLinkingSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${currentUrl}#webpage`,
    url: currentUrl,
    name: currentTitle,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteMetadata.siteUrl}#website`,
      url: siteMetadata.siteUrl,
      name: siteMetadata.title
    },
    relatedLink: relatedLinks.map(link => ({
      '@type': 'WebPage',
      url: link.url,
      name: link.title,
      ...(link.description && { description: link.description })
    })),
    significantLink: relatedLinks
      .filter(link => link.type === 'autor' || link.type === 'serie')
      .map(link => link.url)
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}