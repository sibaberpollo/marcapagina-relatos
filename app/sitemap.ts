// File: app/sitemap.ts

import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import {
  getAllRelatos,
  getAllArticulos,
  getAllAutores,
  getAllMicrocuentos,
  getAllSeries,
} from '../lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Asegurarse de que la URL no termine con slash
  const siteUrl = siteMetadata.siteUrl.endsWith('/')
    ? siteMetadata.siteUrl.slice(0, -1)
    : siteMetadata.siteUrl

  // Fecha actual en ISO completa para lastModified
  const nowIso = new Date().toISOString()

  // Rutas estáticas (home, acerca-de y publica)
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl, // página principal
      lastModified: nowIso,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/acerca-de`, // tu About
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/en/acerca-de`, // about page in English
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/publica`, // la nueva página de publica
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/autores`, // la nueva página de autores
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/criterios-editoriales`, // la página de criterios editoriales
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/cronologico`, // la página de criterios editoriales
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/playlist`, // página de playlist
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/transtextos`, // página principal de Transtextos
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/transtextos/acerca-de`, // página "Acerca de" de Transtextos
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/contacto`, // página de contacto
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/en/contacto`, // página de contacto
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/memes-merch-descargas`, // página de memes en español
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/en/memes-merch-descargas`, // página de memes en inglés
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/horoscopo`, // página de horóscopo
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/horoscopo/cancer`, // página de horóscopo
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/horoscopo/leo`, // página de horóscopo
      lastModified: nowIso,
    },
    {
      url: `${siteUrl}/series`, // página principal de series
      lastModified: nowIso,
    },
  ]

  // Obtener todo en paralelo
  const [relatos, articulos, autores, microcuentos, series] = await Promise.all([
    getAllRelatos(),
    getAllArticulos(),
    getAllAutores(),
    getAllMicrocuentos(),
    getAllSeries(),
  ])
  const relatosRoutes: MetadataRoute.Sitemap = relatos.map((relato) => ({
    url: `${siteUrl}/relato/${relato.slug.current}`,
    lastModified: relato.date ? new Date(relato.date).toISOString() : nowIso,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const articulosRoutes: MetadataRoute.Sitemap = articulos.map((articulo) => ({
    url: `${siteUrl}/articulo/${articulo.slug.current}`,
    lastModified: articulo.date ? new Date(articulo.date).toISOString() : nowIso,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Calcular lastModified de autores a partir de su contenido más reciente
  const latestByAuthor = new Map<string, string>()
  for (const r of relatos) {
    const a = r.author?.slug?.current
    const d = r.date
    if (a && d) {
      const prev = latestByAuthor.get(a)
      if (!prev || new Date(d) > new Date(prev)) latestByAuthor.set(a, d)
    }
  }
  for (const a of articulos) {
    const slug = a.author?.slug?.current
    const d = a.date
    if (slug && d) {
      const prev = latestByAuthor.get(slug)
      if (!prev || new Date(d) > new Date(prev)) latestByAuthor.set(slug, d)
    }
  }
  const autoresRoutes: MetadataRoute.Sitemap = autores.map((autor) => ({
    url: `${siteUrl}/autor/${autor.slug.current}`,
    lastModified: latestByAuthor.get(autor.slug.current)
      ? new Date(latestByAuthor.get(autor.slug.current) as string).toISOString()
      : nowIso,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const microcuentosRoutes: MetadataRoute.Sitemap = microcuentos.map((microcuento) => ({
    url: `${siteUrl}/microcuento/${microcuento.href.split('/').pop()}`,
    lastModified: microcuento.publishedAt
      ? new Date(microcuento.publishedAt).toISOString()
      : nowIso,
    changeFrequency: 'monthly',
  }))

  const seriesRoutes: MetadataRoute.Sitemap = series.map((serie) => ({
    url: `${siteUrl}/serie/${serie.slug.current}`,
    lastModified: nowIso,
    changeFrequency: 'weekly',
  }))

  // Unir todas las rutas en el sitemap
  return [
    ...routes,
    ...relatosRoutes,
    ...articulosRoutes,
    ...autoresRoutes,
    ...microcuentosRoutes,
    ...seriesRoutes,
  ]
}
