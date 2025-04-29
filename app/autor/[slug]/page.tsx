// app/autor/[slug]/page.tsx

import { Authors, allAuthors, allRelatos, allArticulos } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent, sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AuthorTabContent from '@/components/AuthorTabContent'
import { Suspense } from 'react'

export const generateStaticParams = async () => {
  return allAuthors.map((author) => ({
    slug: author.slug,
  }))
}

export async function generateMetadata({ params }) {
  const author = allAuthors.find((p) => p.slug === params.slug)
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

export default async function Page({ params, searchParams }) {
  const author = allAuthors.find((p) => p.slug === params.slug)
  if (!author) {
    return notFound()
  }

  const mainContent = coreContent(author)
  const authorRelatos = allRelatos.filter((r) => r.author.includes(params.slug))
  const authorArticulos = allArticulos.filter((a) => a.author.includes(params.slug))
  const relatosCore = allCoreContent(sortPosts(authorRelatos))
  const articulosCore = allCoreContent(sortPosts(authorArticulos))

  // Determinar el tab por defecto según el autor
  const defaultTab = (author.defaultTab === 'relatos' || author.defaultTab === 'series' || author.defaultTab === 'articulos') 
    ? author.defaultTab 
    : 'relatos'

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />
      
      {/* Componente de tabs para filtrar contenido */}
      <Suspense fallback={<div className="p-4 text-center">Cargando contenido...</div>}>
        <AuthorTabContent 
          relatos={relatosCore} 
          articulos={articulosCore} 
          authorSlug={params.slug} 
          defaultTab={defaultTab}
        />
      </Suspense>
    </AuthorLayout>
  )
}
