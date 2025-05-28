import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMicrocuentoBySlug, getRelatedMicrocuentos, getAllMicrocuentoSlugs } from '@/lib/sanity'
import AlternativeLayout from '@/layouts/AlternativeLayout'
import { PortableText } from '@portabletext/react'
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
    title: `${microcuento.title} - ${siteMetadata.title}`,
    description: microcuento.description,
    openGraph: {
      title: microcuento.title,
      description: microcuento.description,
      type: 'article',
      authors: [microcuento.author],
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

  return (
    <AlternativeLayout
      content={{
        title: microcuento.title,
        author: microcuento.author,
        description: microcuento.description,
        image: microcuento.image,
        bgColor: microcuento.bgColor,
        tags: microcuento.tags,
        publishedAt: microcuento.publishedAt
      }}
      prev={prev || undefined}
      next={next || undefined}
    >
      <PortableText value={microcuento.body} />
    </AlternativeLayout>
  )
} 