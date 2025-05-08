// app/relato/[slug]/page.tsx
import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import seriesMetadata from '@/data/seriesMetadata'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClientFixedNavWrapper from '@/components/ClientFixedNavWrapper'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { getRelatoBySlug, getRelatosByAutor, getAllRelatos } from '../../../lib/sanity'
import { PortableText } from '@portabletext/react'

const defaultLayout = 'PostLayout'
const layouts = { PostSimple, PostLayout, PostBanner }

// Componentes personalizados para el PortableText de Sanity
const ptComponents = {
  types: {
    image: ({value}: any) => (
      <img 
        src={value.imageUrl || value.asset?.url} 
        alt={value.alt || ''} 
        className="w-full rounded-lg my-4"
      />
    ),
    callout: ({value}: any) => (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg my-4">
        <p className="italic">{value.text}</p>
      </div>
    )
  },
  marks: {
    link: ({value, children}: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a href={value?.href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : ''}>
          {children}
        </a>
      )
    }
  }
} as any // Usamos as any para evitar errores de tipado

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const { slug } = props.params
  const post = await getRelatoBySlug(slug)
  
  if (!post) return

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.date).toISOString()
  
  const imageList = post.image 
    ? [post.image] 
    : [siteMetadata.socialBanner]
  
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img
  }))

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'es_ES',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: siteMetadata.siteUrl + `/relato/${slug}`,
      images: ogImages,
      authors: [post.author.name]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: ogImages.map(({ url }) => url)
    }
  }
}

export const generateStaticParams = async () => {
  const relatos = await getAllRelatos()
  return relatos.map((relato) => ({
    slug: relato.slug.current
  }))
}

export default async function Page(props: {
  params: { slug: string }
}) {
  const { slug } = props.params
  const post = await getRelatoBySlug(slug)
  
  if (!post) return notFound()
  
  // Obtener todos los relatos del mismo autor
  const autorRelatos = await getRelatosByAutor(post.author.slug.current)
  
  let prev: { path: string; title: string } | undefined = undefined
  let next: { path: string; title: string } | undefined = undefined
  let seriesRelatos: any[] = []

  if (post.series) {
    // Filtramos los relatos de la misma serie y los ordenamos por seriesOrder
    seriesRelatos = autorRelatos
      .filter(p => p.series === post.series)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))

    console.log('Relatos de la serie encontrados:', seriesRelatos.length)

    const idx = seriesRelatos.findIndex(p => p.slug.current === slug)
    if (idx > 0) {
      prev = {
        path: `relato/${seriesRelatos[idx - 1].slug.current}`,
        title: seriesRelatos[idx - 1].title
      }
    }
    if (idx < seriesRelatos.length - 1) {
      next = {
        path: `relato/${seriesRelatos[idx + 1].slug.current}`,
        title: seriesRelatos[idx + 1].title
      }
    }
  } else {
    // Usamos todos los relatos del autor ordenados por fecha
    const sortedRelatos = [...autorRelatos].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    const idx = sortedRelatos.findIndex(p => p.slug.current === slug)
    if (idx > 0) {
      prev = {
        path: `relato/${sortedRelatos[idx - 1].slug.current}`,
        title: sortedRelatos[idx - 1].title
      }
    }
    if (idx < sortedRelatos.length - 1) {
      next = {
        path: `relato/${sortedRelatos[idx + 1].slug.current}`,
        title: sortedRelatos[idx + 1].title
      }
    }
  }

  // Preparar el formato que esperan los componentes
  const authorDetails = [{
    name: post.author.name,
    avatar: post.author.avatar,
    occupation: post.author.occupation || '',
    company: post.author.company || '',
    twitter: post.author.twitter || '',
    linkedin: post.author.linkedin || '',
    github: post.author.github || '',
    slug: post.author.slug.current,
    // Campos adicionales requeridos para compatibilidad con CoreContent<Authors>
    type: 'authors',
    path: `/autor/${post.author.slug.current}`,
    defaultTab: 'relatos',
    readingTime: { text: '', minutes: 0, time: 0, words: 0 },
    filePath: '',
    url: `/autor/${post.author.slug.current}`,
    toc: []
  }] as any // Usamos 'as any' para evitar problemas de tipado
  
  // Obtener relatos relacionados
  let relatedPosts: any[] = []
  if (post.series) {
    relatedPosts = autorRelatos
      .filter(p => p.series === post.series && p.slug.current !== slug)
      .map(formatRelatedPost)
  } else {
    relatedPosts = autorRelatos
      .filter(p => !p.series && p.slug.current !== slug)
      .map(formatRelatedPost)
  }

  // Formatear el contenido principal
  const mainContent = {
    title: post.title,
    date: post.date,
    tags: post.tags || [],
    draft: false,
    summary: post.summary || '',
    images: post.image ? [post.image] : [],
    image: post.image, // Imagen destacada
    authors: [post.author.name],
    slug: post.slug.current,
    path: `relato/${post.slug.current}`,
    // Incluimos series como parte del objeto content, no como prop separado
    series: post.series,
    seriesOrder: post.seriesOrder,
    // Para que MDXLayoutRenderer funcione con el contenido de Sanity
    body: { 
      code: `
        function MDXContent() {
          return null;
        }
      `
    },
    toc: [] // Sanity no proporciona TOC, usamos array vacío
  }

  console.log('Post data:', {
    title: post.title,
    image: post.image,
    authorDetails: authorDetails[0],
    series: post.series,
    content: mainContent,
    body: post.body // Agregamos el cuerpo para ver su formato
  })

  // Preparar JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.summary,
    image: post.image,
    url: siteMetadata.siteUrl + `/relato/${slug}`,
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name }))
  }
  
  // Determinar el layout - usamos PostLayout por defecto
  const Layout = layouts[defaultLayout]

  // Función auxiliar para formatear relatos relacionados
  function formatRelatedPost(relato) {
    return {
      title: relato.title,
      path: `relato/${relato.slug.current}`,
      slug: relato.slug.current
    }
  }

  // Formatear relatos para la serie (si existe)
  const formattedSeriesRelatos = seriesRelatos.map(relato => ({
    title: relato.title,
    slug: relato.slug.current,
    path: `relato/${relato.slug.current}`,
    seriesOrder: relato.seriesOrder || 0
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout 
        content={mainContent} 
        authorDetails={authorDetails} 
        next={next} 
        prev={prev}
      >
        <div className="prose dark:prose-invert max-w-none">
          <PortableText value={post.body} components={ptComponents} />
        </div>
        {post.series && formattedSeriesRelatos.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Serie: {post.series}</h2>
            {seriesMetadata[post.series] && (
              <p className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400 mb-4">
                {seriesMetadata[post.series].description}
              </p>
            )}
            <div className="space-y-0">
              {formattedSeriesRelatos.map((relato, index) => (
                <div key={relato.slug} className="relative pl-10">
                  {/* Línea punteada estilizada */}
                  <div
                    className="absolute left-4 top-0 bottom-0 w-0.5"
                    style={{
                      borderLeft: '2px dotted #bdbdbd',
                      height: index === formattedSeriesRelatos.length - 1 ? '1.25rem' : '100%',
                    }}
                  />
                  {/* Punto destacado centrado */}
                  <div
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-black ${
                      relato.slug === slug ? 'bg-[#faff00]' : 'bg-white'
                    }`}
                  />
                  <Link
                    href={`/relato/${relato.slug}`}
                    className="block hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-black dark:text-white">
                        {relato.seriesOrder}. {relato.title}
                        {relato.slug === slug && (
                          <span className="ml-2 px-2 py-0.5 bg-black text-[#faff00] rounded text-sm">
                            (Leyendo)
                          </span>
                        )}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </Layout>
      
      <ClientFixedNavWrapper 
        title={post.title} 
        authorAvatar={post.author.avatar} 
        authorName={post.author.name}
        slug={slug}
        relatedPosts={relatedPosts}
        author={post.author.slug.current}
        pathPrefix="relato"
        readingTime={post.readingTime || { text: "5 min", minutes: 5, time: 300000, words: 1000 }}
        seriesName={post.series}
      />
    </>
  )
} 
