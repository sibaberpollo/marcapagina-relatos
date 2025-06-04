import siteMetadata from '@/data/siteMetadata'

export default function OrganizationSchema() {
  const sameAs = [
    siteMetadata.twitter,
    siteMetadata.github,
    siteMetadata.instagram,
    siteMetadata.threads,
    siteMetadata.bluesky,
    siteMetadata.facebook,
    siteMetadata.linkedin,
    siteMetadata.x,
    siteMetadata.youtube,
    siteMetadata.mastodon,
    siteMetadata.medium,
  ].filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteMetadata.title,
    url: siteMetadata.siteUrl,
    logo: siteMetadata.siteLogo,
    ...(sameAs.length > 0 && { sameAs }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
