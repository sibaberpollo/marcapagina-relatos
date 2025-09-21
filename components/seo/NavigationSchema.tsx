import siteMetadata from '@/data/siteMetadata'

const navigationItems = [
  { name: 'Inicio', url: `${siteMetadata.siteUrl}/` },
  { name: 'Narrativa', url: `${siteMetadata.siteUrl}/transtextos` },
  { name: 'Autores', url: `${siteMetadata.siteUrl}/autores` },
  { name: 'Relatos', url: `${siteMetadata.siteUrl}/posts` },
  { name: 'Series', url: `${siteMetadata.siteUrl}/series` },
  { name: 'Acerca de', url: `${siteMetadata.siteUrl}/acerca-de` },
  { name: 'Contacto', url: `${siteMetadata.siteUrl}/contacto` },
]

export default function NavigationSchema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${siteMetadata.siteUrl}#navigation`,
    name: 'Navegación Principal',
    url: siteMetadata.siteUrl,
    hasPart: navigationItems.map((item, index) => ({
      '@type': 'WebPage',
      '@id': `${item.url}#webpage`,
      name: item.name,
      url: item.url,
      position: index + 1,
      isPartOf: {
        '@id': `${siteMetadata.siteUrl}#website`
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}