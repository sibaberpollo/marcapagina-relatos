// File: tailwind-nextjs-starter-blog/app/sitemap.ts

import { MetadataRoute } from 'next'
import { allBlogs, allRelatos } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  // Asegurarse de que la URL no termine con slash
  const siteUrl = siteMetadata.siteUrl.endsWith('/')
    ? siteMetadata.siteUrl.slice(0, -1)
    : siteMetadata.siteUrl

  // Fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0]

  // Rutas estáticas (home, acerca-de y publica)
  const routes: { url: string; lastModified: string }[] = [
    {
      url: siteUrl, // página principal
      lastModified: today,
    },
    {
      url: `${siteUrl}/acerca-de`, // tu About
      lastModified: today,
    },
    {
      url: `${siteUrl}/publica`, // la nueva página de publica
      lastModified: today,
    },
  ]

  // Rutas generadas por Contentlayer: blogs/artículos
  const blogRoutes = allBlogs.map((post) => ({
    url: `${siteUrl}/${post.authors?.[0] || 'blog'}/${post.path}`,
    lastModified: post.date,
  }))

  // Rutas generadas por Contentlayer: relatos
  const relatosRoutes = allRelatos.map((relato) => ({
    url: `${siteUrl}/${relato.author[0]}/relato/${relato.slug}`,
    lastModified: relato.date,
  }))

  // Unir todas las rutas en el sitemap
  return [...routes, ...blogRoutes, ...relatosRoutes]
}
