import 'css/prism.css'
import 'katex/dist/katex.css'

import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import TranstextosHeader from '@/components/TranstextosHeader'
import ClientFixedNavWrapper from '@/components/ClientFixedNavWrapper'
import PostSimple from '@/layouts/PostSimple'
import AlternativeLayout from '@/layouts/AlternativeLayout'
import PostBanner from '@/layouts/PostBanner'
import { getArticuloBySlug, getArticulosByAutor, getAllArticulos } from '../../../lib/sanity'
import { PortableText } from '@portabletext/react'
import { ptComponents } from '@/components/PortableTextComponents'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const defaultLayout = 'AlternativeLayout'
const layouts = { PostSimple, AlternativeLayout, PostBanner }

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  // Aseguramos que params sea awaited antes de usarlo
  const params = await props.params
  const { slug } = params
  const post = await getArticuloBySlug(slug)

  if (!post) return

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.date).toISOString()

  const imageList = post.image ? [post.image] : [siteMetadata.socialBanner]

  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img,
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
      url: siteMetadata.siteUrl + `/articulo/${slug}`,
      images: ogImages,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: ogImages.map(({ url }) => url),
    },
  }
}

export const generateStaticParams = async () => {
  const articulos = await getAllArticulos()
  return articulos.map((articulo) => ({
    slug: articulo.slug.current,
  }))
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  // Aseguramos que params sea awaited antes de usarlo
  const params = await props.params
  const { slug } = params
  const post = await getArticuloBySlug(slug)

  if (!post) return notFound()

  // Obtener todos los artículos del mismo autor
  const autorArticulos = await getArticulosByAutor(post.author.slug.current)

  let prev: { title: string; slug: { current: string } } | undefined = undefined
  let next: { title: string; slug: { current: string } } | undefined = undefined

  // Para artículos, no hay series, así que simplemente ordenamos por fecha
  const sortedArticulos = [...autorArticulos].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const idx = sortedArticulos.findIndex((p) => p.slug.current === slug)
  if (idx > 0) {
    prev = {
      title: sortedArticulos[idx - 1].title,
      slug: { current: sortedArticulos[idx - 1].slug.current },
    }
  }
  if (idx < sortedArticulos.length - 1) {
    next = {
      title: sortedArticulos[idx + 1].title,
      slug: { current: sortedArticulos[idx + 1].slug.current },
    }
  }

  // Preparar el formato que esperan los componentes
  const authorDetails = [
    {
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
      defaultTab: 'articulos',
      readingTime: { text: '', minutes: 0, time: 0, words: 0 },
      filePath: '',
      url: `/autor/${post.author.slug.current}`,
      toc: [],
    },
  ] as any // Usamos 'as any' para evitar problemas de tipado

  // Obtener artículos relacionados
  const relatedPosts: any[] = autorArticulos
    .filter((p) => p.slug.current !== slug)
    .map(formatRelatedPost)

  // Preparar JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.summary,
    image: post.image,
    url: siteMetadata.siteUrl + `/articulo/${slug}`,
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name })),
  }

  // Formatear el contenido principal
  const mainContent = {
    title: post.title,
    author: post.author.name,
    date: post.date,
    tags: [],
    draft: false,
    summary: post.summary || '',
    description: post.summary || '',
    images: post.image ? [post.image] : [],
    image: post.image, // Imagen destacada
    authors: [post.author.name],
    slug: post.slug.current,
    path: `articulo/${post.slug.current}`,
    bgColor: '#000000', // Color por defecto para artículos
    publishedAt: post.date,
    // Para que MDXLayoutRenderer funcione con el contenido de Sanity
    body: {
      code: `
        function MDXContent() {
          return null;
        }
      `,
    },
    toc: [], // Sanity no proporciona TOC, usamos array vacío
    // Propiedades requeridas por CoreContent<Blog>
    type: 'Blog' as const,
    readingTime: post.readingTime || { text: '5 min read', minutes: 5, time: 300000, words: 1000 },
    filePath: `articulo/${post.slug.current}.md`,
    structuredData: jsonLd,
  }

  // Determinar el layout - usamos PostLayout por defecto
  const Layout = layouts[defaultLayout]

  // Función auxiliar para formatear artículos relacionados
  function formatRelatedPost(relato) {
    return {
      title: relato.title,
      path: `articulo/${relato.slug.current}`,
      slug: relato.slug.current,
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', item: `${siteMetadata.siteUrl}/` },
          { name: 'Artículos', item: `${siteMetadata.siteUrl}/posts` },
          { name: post.title, item: `${siteMetadata.siteUrl}/articulo/${slug}` },
        ]}
      />
      <Layout content={mainContent} next={next} prev={prev}>
        <div className="prose dark:prose-invert max-w-none">
          <PortableText value={post.body} components={ptComponents} />
        </div>
      </Layout>

      <ClientFixedNavWrapper
        title={post.title}
        authorAvatar={post.author.avatar}
        authorName={post.author.name}
        slug={slug}
        relatedPosts={relatedPosts}
        author={post.author.slug.current}
        pathPrefix="articulo"
        readingTime={post.readingTime}
      />
    </>
  )
}
