// File: app/sitemap.ts

import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getAllRelatos, getAllArticulos, getAllAutores, getAllMicrocuentos, getAllSeries } from '../lib/sanity'

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
      url: `${siteUrl}/en/acerca-de`, // about page in English
      lastModified: today,
    },
    {
      url: `${siteUrl}/publica`, // la nueva página de publica
      lastModified: today,
    },
    {
      url: `${siteUrl}/autores`, // la nueva página de autores
      lastModified: today,
    },
    {
      url: `${siteUrl}/criterios-editoriales`, // la página de criterios editoriales
      lastModified: today,
    },
    {
      url: `${siteUrl}/cronologico`, // la página de criterios editoriales
      lastModified: today,
    },
    {
      url: `${siteUrl}/playlist`, // página de playlist
      lastModified: today,
    },
    {
      url: `${siteUrl}/transtextos`, // página principal de Transtextos
      lastModified: today,
    },
    {
      url: `${siteUrl}/transtextos/acerca-de`, // página "Acerca de" de Transtextos
      lastModified: today,
    },
    {
      url: `${siteUrl}/contacto`, // página de contacto
      lastModified: today,
    },
    {
      url: `${siteUrl}/en/contacto`, // página de contacto
      lastModified: today,
    },
    {
      url: `${siteUrl}/memes-merch-descargas`, // página de memes en español
      lastModified: today,
    },
    {
      url: `${siteUrl}/en/memes-merch-descargas`, // página de memes en inglés
      lastModified: today,
    },
    {
      url: `${siteUrl}/horoscopo`, // página de horóscopo
      lastModified: today,
    },
    {
      url: `${siteUrl}/horoscopo/cancer`, // página de horóscopo
      lastModified: today,
    },
    {
      url: `${siteUrl}/series`, // página principal de series
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

  // Obtener todos los microcuentos desde Sanity
  const microcuentos = await getAllMicrocuentos()
  const microcuentosRoutes = microcuentos.map((microcuento) => ({
    url: `${siteUrl}/microcuento/${microcuento.href.split('/').pop()}`,
    lastModified: microcuento.publishedAt || today,
  }))

  // Obtener todas las series desde Sanity
  const series = await getAllSeries()
  const seriesRoutes = series.map((serie) => ({
    url: `${siteUrl}/serie/${serie.slug.current}`,
    lastModified: today,
  }))

  // Unir todas las rutas en el sitemap
  return [...routes, ...relatosRoutes, ...articulosRoutes, ...autoresRoutes, ...microcuentosRoutes, ...seriesRoutes]
}
