// app/autor/[slug]/page.tsx

import { getAutorBySlug, getAllAutores, getRelatosByAutor, getSeriesByAutor } from '../../../lib/sanity'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import AuthorTabContent from '@/components/AuthorTabContent'
import { Suspense } from 'react'
import { type Authors } from 'contentlayer/generated'

// Generar rutas estáticas para todos los autores
export async function generateStaticParams() {
  const autores = await getAllAutores()
  return autores.map((autor) => ({
    slug: autor.slug.current,
  }))
}

// Generar metadata para SEO
export async function generateMetadata({ params }) {
  // Aseguramos que params es esperado (awaited)
  const paramsCopy = await Promise.resolve(params);
  const slug = paramsCopy.slug;
  
  const author = await getAutorBySlug(slug)
  
  if (!author) {
    return {
      title: 'Autor no encontrado',
      description: 'No se encontró el autor',
    }
  }
  
  return genPageMetadata({
    title: author.name,
    description: `Perfil y obras de ${author.name}`,
  })
}

export default async function Page({ params }) {
  // Aseguramos que params es esperado (awaited)
  const paramsCopy = await Promise.resolve(params);
  const slug = paramsCopy.slug;
  
  const author = await getAutorBySlug(slug)
  
  if (!author) {
    return notFound()
  }
  
  // Obtener relatos del autor
  const relatos = await getRelatosByAutor(slug)
  
  // Convertir los datos de Sanity al formato esperado por AuthorTabContent
  const formatearRelatos = relatos.map(relato => ({
    slug: relato.slug.current,
    title: relato.title,
    summary: relato.summary || '',
    // De momento no tenemos series en el mismo formato, pero lo manejaremos más adelante
    series: undefined
  }))
  
  // Obtener series del autor (para agrupar relatos)
  const seriesData = await getSeriesByAutor(slug)
  
  // Para cada serie, marcamos sus relatos con el nombre de la serie
  seriesData.forEach(serie => {
    serie.relatos.forEach(relato => {
      // Buscar el relato en formatearRelatos
      const index = formatearRelatos.findIndex(r => r.slug === relato.slug.current)
      if (index !== -1) {
        formatearRelatos[index].series = serie.title
      }
    })
  })
  
  // Articles/Artículos: de momento un array vacío ya que no hemos implementado este tipo de contenido
  const articulos = []
  
  // Determinar el tab por defecto según el autor
  const defaultTab = (author.defaultTab === 'relatos' || author.defaultTab === 'series' || author.defaultTab === 'articulos') 
    ? author.defaultTab 
    : 'relatos'
  
  // Simulamos un objeto de tipo Authors para el AuthorLayout
  const authorContent: Omit<Authors, '_id' | '_raw' | 'body'> = {
    name: author.name,
    avatar: author.avatar || '',
    occupation: author.occupation || '',
    company: author.company || '',
    email: author.email || '',
    twitter: author.twitter || '',
    bluesky: author.bluesky || '',
    linkedin: author.linkedin || '',
    github: author.github || '',
    website: author.website || '',
    // Propiedades adicionales requeridas por el tipo Authors
    type: 'Authors',
    defaultTab: author.defaultTab || 'relatos',
    slug: slug,
    path: `/autor/${slug}`,
    filePath: '',
    toc: [],
    // Estos valores no se usan en el componente, pero son requeridos por el tipo
    readingTime: { text: '', minutes: 0, time: 0, words: 0 }
  } as Omit<Authors, '_id' | '_raw' | 'body'>

  return (
    <AuthorLayout content={authorContent}>
      {/* Mostrar la biografía del autor */}
      {author.bio && (
        <div className="mb-8">
          <p className="text-gray-700 dark:text-gray-300">{author.bio}</p>
        </div>
      )}
      
      {/* Componente de tabs para filtrar contenido */}
      <Suspense fallback={<div className="p-4 text-center">Cargando contenido...</div>}>
        <AuthorTabContent 
          relatos={formatearRelatos} 
          articulos={articulos}
          authorSlug={slug}
          defaultTab={defaultTab}
        />
      </Suspense>
    </AuthorLayout>
  )
}
 