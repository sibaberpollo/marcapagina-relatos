import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/admin/*', '/_next/*'],
    },
    sitemap: `${siteMetadata.siteUrl}sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
