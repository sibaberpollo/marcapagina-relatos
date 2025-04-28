import { MetadataRoute } from 'next'
import { allBlogs, allRelatos } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  // Asegurarse de que la URL no termine con slash
  const siteUrl = siteMetadata.siteUrl.endsWith('/')
    ? siteMetadata.siteUrl.slice(0, -1)
    : siteMetadata.siteUrl
  
  // URLs básicas - solo la página principal y acerca-de
  const routes = [
    {
      url: siteUrl, // URL principal sin slash adicional
      lastModified: new Date().toISOString().split('T')[0],
    },
    {
      url: `${siteUrl}/acerca-de`,
      lastModified: new Date().toISOString().split('T')[0],
    },
  ]
  
  // Blogs/Artículos
  const blogRoutes = allBlogs.map((post) => ({
    url: `${siteUrl}/${post.authors?.[0] || 'blog'}/${post.path}`,
    lastModified: post.date,
  }))
  
  // Relatos
  const relatosRoutes = allRelatos.map((relato) => ({
    url: `${siteUrl}/${relato.author[0]}/relato/${relato.slug}`,
    lastModified: relato.date,
  }))
  
  return [...routes, ...blogRoutes, ...relatosRoutes]
}
