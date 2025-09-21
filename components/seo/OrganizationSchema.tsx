import siteMetadata from '@/data/siteMetadata'

export default function OrganizationSchema() {
  const sameAs = [
    siteMetadata.twitter,
    siteMetadata.github,
    siteMetadata.instagram,
    siteMetadata.spotify,
    siteMetadata.youtube,
    siteMetadata.threads,
    siteMetadata.bluesky,
    siteMetadata.facebook,
    siteMetadata.linkedin,
    siteMetadata.x,
    siteMetadata.mastodon,
    siteMetadata.medium,
  ].filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': siteMetadata.siteUrl,
        name: siteMetadata.title,
        url: siteMetadata.siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: siteMetadata.siteLogo,
        },
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteMetadata.siteUrl}#website`,
        url: siteMetadata.siteUrl,
        name: siteMetadata.title,
        publisher: { '@id': siteMetadata.siteUrl },
        inLanguage: siteMetadata.language,
        description: siteMetadata.description,
        mainEntity: {
          '@type': 'WebPage',
          '@id': `${siteMetadata.siteUrl}#webpage`,
          url: siteMetadata.siteUrl,
          name: siteMetadata.title,
          about: {
            '@type': 'Thing',
            name: 'Literatura',
            description: 'Relatos y microcuentos de autores emergentes'
          }
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
