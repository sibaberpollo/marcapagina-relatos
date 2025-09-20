import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMicrocuentoBySlug, getRelatedMicrocuentos, getAllMicrocuentoSlugs } from '@/lib/sanity'
import AlternativeLayout from '@/layouts/AlternativeLayout'
import { PortableText } from '@portabletext/react'
import { ptComponents } from '@/components/content/PortableTextComponents'
import siteMetadata from '@/data/siteMetadata'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllMicrocuentoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const microcuento = await getMicrocuentoBySlug(slug)

  if (!microcuento) {
    return {
      title: 'Microcuento no encontrado',
    }
  }

  return {
    title: microcuento.title,
    description: microcuento.description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: microcuento.title,
      description: microcuento.description,
      siteName: siteMetadata.title,
      locale: 'es_ES',
      type: 'article',
      publishedTime: microcuento.publishedAt,
      modifiedTime: microcuento.publishedAt,
      url: `${siteMetadata.siteUrl}/microcuento/${slug}`,
      images: microcuento.image ? [microcuento.image] : [siteMetadata.socialBanner],
      authors: [microcuento.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: microcuento.title,
      description: microcuento.description,
      images: microcuento.image ? [microcuento.image] : [siteMetadata.socialBanner],
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/microcuento/${slug}`,
    },
  }
}

export default async function MicrocuentoPage({ params }: PageProps) {
  const { slug } = await params
  const microcuento = await getMicrocuentoBySlug(slug)

  if (!microcuento) {
    notFound()
  }

  const { prev, next } = await getRelatedMicrocuentos(slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${siteMetadata.siteUrl}/microcuento/${slug}`,
    name: microcuento.title,
    headline: microcuento.title,
    author: {
      '@type': 'Person',
      name: microcuento.author
    },
    datePublished: microcuento.publishedAt,
    dateModified: microcuento.publishedAt,
    description: microcuento.description,
    genre: 'Microcuento',
    inLanguage: 'es-ES',
    image: microcuento.image,
    url: `${siteMetadata.siteUrl}/microcuento/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      url: siteMetadata.siteUrl
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteMetadata.siteUrl}/microcuento/${slug}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlternativeLayout
      content={{
        title: microcuento.title,
        author: microcuento.author,
        description: microcuento.description,
        image: microcuento.image,
        bgColor: microcuento.bgColor,
        tags: microcuento.tags,
        publishedAt: microcuento.publishedAt,
      }}
      prev={prev || undefined}
      next={next || undefined}
      >
        <PortableText value={microcuento.body} components={ptComponents} />
      </AlternativeLayout>
    </>
  )
}
