// app/relato/[slug]/page.tsx
import 'css/prism.css'
import 'katex/dist/katex.css'
import 'css/drop-cap.css'

import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import seriesMetadata from '@/data/seriesMetadata'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import TranstextosHeader from '@/components/TranstextosHeader'
import ClientFixedNavWrapper from '@/components/ClientFixedNavWrapper'
import Breadcrumbs from '@/components/Breadcrumbs'
import SectionContainer from '@/components/SectionContainer'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import {
  getRelatoBySlug,
  getRelatosByAutor,
  getAllRelatos,
  getSerieDeRelato,
  getAllRelatosForChronologicalBySite,
  getSiteBySlug
} from '../../../lib/sanity'
import ChronologicalView from '@/components/ChronologicalView'
import { Rss } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { ptComponents } from '@/components/PortableTextComponents'

const defaultLayout = 'PostLayout'
const layouts = { PostSimple, PostLayout, PostBanner }

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const { slug } = params
  const post = await getRelatoBySlug(slug)
  if (!post) return

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.date).toISOString()
  const imageList = post.image ? [post.image] : [siteMetadata.socialBanner]
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
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const { slug } = params
  const post = await getRelatoBySlug(slug)
  if (!post) return notFound()

  // Detectar si el relato pertenece a Transtextos
  const isTranstextos = post.site?.slug?.current === 'transtextos'

  const autorRelatos = await getRelatosByAutor(post.author.slug.current)
  const { serie, relatosDeSerie } = await getSerieDeRelato(slug)

  // Nuevo: preparar props para el layout
  const showDropCap = post.showDropCap === true
  const autor = post.author ? { name: post.author.name, slug: post.author.slug?.current } : null;

  let prev: { path: string; title: string } | undefined
  let next: { path: string; title: string } | undefined

  if (serie && relatosDeSerie.length > 0) {
    const idx = relatosDeSerie.findIndex((r) => r.slug.current === slug)
    if (idx > 0) {
      const p = relatosDeSerie[idx - 1]
      prev = { path: `relato/${p.slug.current}`, title: p.title }
    }
    if (idx < relatosDeSerie.length - 1) {
      const n = relatosDeSerie[idx + 1]
      next = { path: `relato/${n.slug.current}`, title: n.title }
    }
  } else {
    const sorted = [...autorRelatos].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    const idx = sorted.findIndex((r) => r.slug.current === slug)
    if (idx > 0) {
      const p = sorted[idx - 1]
      prev = { path: `relato/${p.slug.current}`, title: p.title }
    }
    if (idx < sorted.length - 1) {
      const n = sorted[idx + 1]
      next = { path: `relato/${n.slug.current}`, title: n.title }
    }
  }

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
      type: 'authors',
      path: `/autor/${post.author.slug.current}`,
      defaultTab: 'relatos',
      readingTime: { text: '', minutes: 0, time: 0, words: 0 },
      filePath: '',
      url: `/autor/${post.author.slug.current}`,
      toc: []
    }
  ] as any

  let relatedPosts: any[] = []
  if (serie && relatosDeSerie.length > 0) {
    relatedPosts = relatosDeSerie
      .filter((r) => r.slug.current !== slug)
      .map((r) => ({
        title: r.title,
        path: `relato/${r.slug.current}`,
        slug: r.slug.current
      }))
  } else {
    relatedPosts = autorRelatos
      .filter((r) => r.slug.current !== slug)
      .map((r) => ({
        title: r.title,
        path: `relato/${r.slug.current}`,
        slug: r.slug.current
      }))
  }

  const mainContent = {
    title: post.title,
    date: post.date,
    tags: post.tags || [],
    draft: false,
    summary: post.summary || '',
    images: isTranstextos ? [] : post.image ? [post.image] : [],
    image: isTranstextos ? undefined : post.image,
    authors: [post.author.name],
    slug: post.slug.current,
    path: `relato/${post.slug.current}`,
    series: serie?.title,
    seriesOrder: serie
      ? relatosDeSerie.findIndex((r) => r.slug.current === slug) + 1
      : undefined,
    bgColor: post.bgColor,
    body: {
      code: `
        function MDXContent() {
          return null;
        }
      `
    },
    toc: []
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.summary,
    image: isTranstextos ? undefined : post.image,
    url: siteMetadata.siteUrl + `/relato/${slug}`,
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name }))
  }

  const Layout = layouts[defaultLayout]

  const formattedSeriesRelatos = (relatosDeSerie || []).map((r, index) => ({
    title: r.title,
    slug: r.slug.current,
    path: `relato/${r.slug.current}`,
    order: index + 1
  }))

  const siteInfo = await getSiteBySlug('transtextos')
  const allRelatosTranstextos = await getAllRelatosForChronologicalBySite('transtextos')
  const latestTranstextos = allRelatosTranstextos.slice(0, 5)
  const currentPage = 1

  return (
    <>
      {/* Mostrar el header apropiado según el sitio */}
      {isTranstextos ? <TranstextosHeader /> : <Header />}
      <SectionContainer>
        <Breadcrumbs force />
      </SectionContainer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        autor={autor}
        showDropCap={showDropCap}
      >
        <div className="prose dark:prose-invert max-w-none">
          <PortableText value={post.body} components={ptComponents} />
        </div>
        {serie && formattedSeriesRelatos.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Serie: {serie.title}</h2>
            {(seriesMetadata[serie.title]?.description || serie.description) && (
              <p className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400 mb-4">
                {seriesMetadata[serie.title]?.description || serie.description}
              </p>
            )}
            <div className="space-y-0">
              {formattedSeriesRelatos.map((relato, idx) => (
                <div key={relato.slug} className="relative pl-10">
                  <div
                    className="absolute left-4 top-0 bottom-0 w-0.5"
                    style={{
                      borderLeft: '2px dotted #bdbdbd',
                      height:
                        idx === formattedSeriesRelatos.length - 1
                          ? '1.25rem'
                          : '100%'
                    }}
                  />
                  <div
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-black ${
                      relato.slug === slug ? 'bg-[#faff00]' : 'bg-white'
                    }`}
                  />
                  <Link href={`/relato/${relato.slug}`} className="block hover:underline">
                    <div className="flex items-center">
                      <span className="font-medium text-black dark:text-white">
                        {relato.order}. {relato.title}
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

      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 flex items-center gap-2">
            {siteInfo?.title || 'Transtextos'}
            <Rss className="w-7 h-7" style={{ color: '#f26522' }} />
          </h1>
        </div>
        <div className="container">
          <ChronologicalView items={latestTranstextos} itemsPerPage={10} currentPage={currentPage} />
          <div className="mt-8 flex justify-center">
            <Link
              href="/transtextos"
              className="inline-block px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Ver todos
            </Link>
          </div>
        </div>
      </SectionContainer>
      <ClientFixedNavWrapper
        title={post.title}
        authorAvatar={post.author.avatar}
        authorName={post.author.name}
        slug={slug}
        relatedPosts={relatedPosts}
        author={post.author.slug.current}
        pathPrefix="relato"
        readingTime={post.readingTime}
        seriesName={serie?.title}
      />
    </>
  )
}
