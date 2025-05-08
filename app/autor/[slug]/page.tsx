// app/autor/[slug]/page.tsx

import { getAutorBySlug, getAllAutores, getRelatosByAutor, getSeriesByAutor } from '../../../lib/sanity'
import SanityAuthorLayout from '@/layouts/SanityAuthorLayout'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import SanityAuthorTabContent from '@/components/SanityAuthorTabContent'
import { Suspense } from 'react'

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
  
  // Obtener relatos y series del autor
  const relatos = await getRelatosByAutor(slug)
  const series = await getSeriesByAutor(slug)
  
  // Determinar el tab por defecto según el autor
  const defaultTab = (author.defaultTab === 'relatos' || author.defaultTab === 'series') 
    ? author.defaultTab 
    : 'relatos'

  return (
    <SanityAuthorLayout autor={author}>
      {/* Mostrar la biografía del autor */}
      <div className="mb-8">
        {author.bio ? (
          <p className="text-gray-700 dark:text-gray-300">{author.bio}</p>
        ) : (
          <p className="text-gray-500 italic">No hay biografía disponible.</p>
        )}
      </div>
      
      {/* Componente de tabs para filtrar contenido */}
      <Suspense fallback={<div className="p-4 text-center">Cargando contenido...</div>}>
        <SanityAuthorTabContent 
          relatos={relatos} 
          series={series}
          authorSlug={slug}
          defaultTab={defaultTab}
        />
      </Suspense>
    </SanityAuthorLayout>
  )
}
 