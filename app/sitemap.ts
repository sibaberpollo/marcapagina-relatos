// File: app/sitemap.ts

import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getAllRelatos, getAllArticulos, getAllAutores } from '../lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    {
      url: `${siteUrl}/criterios-editoriales`, // la página de criterios editoriales
      lastModified: today,
    },
  ]

  // Obtener todos los relatos desde Sanity
  const relatos = await getAllRelatos()
  const relatosRoutes = relatos.map((relato) => ({
    url: `${siteUrl}/relato/${relato.slug.current}`,
    lastModified: relato.date || today,
  }))

  // Obtener todos los artículos desde Sanity
  const articulos = await getAllArticulos()
  const articulosRoutes = articulos.map((articulo) => ({
    url: `${siteUrl}/articulo/${articulo.slug.current}`,
    lastModified: articulo.date || today,
  }))

  // Obtener todos los autores desde Sanity
  const autores = await getAllAutores()
  const autoresRoutes = autores.map((autor) => ({
    url: `${siteUrl}/autor/${autor.slug.current}`,
    lastModified: today,
  }))

  // Unir todas las rutas en el sitemap
  return [...routes, ...relatosRoutes, ...articulosRoutes, ...autoresRoutes]
}
