// app/relato/[slug]/page.tsx
import 'css/prism.css'
import 'katex/dist/katex.css'
import 'css/drop-cap.css'

import { Metadata } from 'next'
import { cache } from 'react'
import siteMetadata from '@/data/siteMetadata'
import seriesMetadata from '@/data/seriesMetadata'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClientFixedNavWrapper from '@/components/navigation/ClientFixedNavWrapper'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import {
  getRelatoBySlug,
  getRelatosByAutor,
  getAllRelatos,
  getSerieDeRelato,
} from '../../../lib/sanity'
import { PortableText } from '@portabletext/react'
import { ptComponents } from '@/components/content/PortableTextComponents'
import {
  BookOpen,
  Clock,
  Calendar,
  Check,
  Play,
  PartyPopper,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

const defaultLayout = 'PostLayout'
const layouts = { PostSimple, PostLayout, PostBanner }

// Cache para evitar consultas repetidas
const getCachedRelatoData = cache(async (slug: string) => {
  const post = await getRelatoBySlug(slug)
  if (!post) return null

  // Ejecutar consultas en paralelo para mejorar performance
  const [autorRelatos, { serie, relatosDeSerie }] = await Promise.all([
    getRelatosByAutor(post.author.slug.current),
    getSerieDeRelato(slug),
  ])

  return { post, autorRelatos, serie, relatosDeSerie }
})

// Helper function para construir navegación
const buildNavigation = (
  slug: string,
  serie: any,
  relatosDeSerie: any[],
  autorRelatos: any[]
): { prev?: { path: string; title: string }; next?: { path: string; title: string } } => {
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
    // Optimización: evitar sort si ya está ordenado
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

  return { prev, next }
}

// Helper function para construir author details
const buildAuthorDetails = (author: any) =>
  [
    {
      name: author.name,
      avatar: author.avatar,
      occupation: author.occupation || '',
      company: author.company || '',
      twitter: author.twitter || '',
      linkedin: author.linkedin || '',
      github: author.github || '',
      slug: author.slug.current,
      type: 'Authors' as const,
      path: `/autor/${author.slug.current}`,
      defaultTab: 'relatos',
      readingTime: { text: '', minutes: 0, time: 0, words: 0 },
      filePath: '',
      url: `/autor/${author.slug.current}`,
      toc: [],
    },
  ] as any

// Helper function para construir related posts
const buildRelatedPosts = (
  slug: string,
  serie: any,
  relatosDeSerie: any[],
  autorRelatos: any[]
) => {
  if (serie && relatosDeSerie.length > 0) {
    return relatosDeSerie
      .filter((r) => r.slug.current !== slug)
      .map((r) => ({
        title: r.title,
        path: `relato/${r.slug.current}`,
        slug: r.slug.current,
      }))
  }

  return autorRelatos
    .filter((r) => r.slug.current !== slug)
    .map((r) => ({
      title: r.title,
      path: `relato/${r.slug.current}`,
      slug: r.slug.current,
    }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const { slug } = params
  const data = await getCachedRelatoData(slug)
  if (!data) return

  const { post } = data
  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.date).toISOString()
  const imageList = post.image ? [post.image] : [siteMetadata.socialBanner]
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img,
  }))

  return {
    title: post.title,
    description: post.summary,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'es_ES',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: `${siteMetadata.siteUrl}/relato/${slug}`,
      images: ogImages,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: ogImages.map(({ url }) => url),
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/relato/${slug}`,
    },
  }
}

export const generateStaticParams = async () => {
  const relatos = await getAllRelatos()
  return relatos.map((relato) => ({
    slug: relato.slug.current,
  }))
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params

  // Usar la función cacheada optimizada
  const data = await getCachedRelatoData(slug)
  if (!data) return notFound()

  const { post, autorRelatos, serie, relatosDeSerie } = data

  // Detectar si el relato pertenece a Transtextos
  const isTranstextos = post.site?.slug?.current === 'transtextos'

  // Usar helpers para reducir duplicación
  const { prev, next } = buildNavigation(slug, serie, relatosDeSerie, autorRelatos)
  const authorDetails = buildAuthorDetails(post.author)
  const relatedPosts = buildRelatedPosts(slug, serie, relatosDeSerie, autorRelatos)

  // Preparar props para el layout (memoizados)
  const showDropCap = post.showDropCap === true
  const autor = post.author ? { name: post.author.name, slug: post.author.slug?.current } : null

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
    seriesOrder: serie ? relatosDeSerie.findIndex((r) => r.slug.current === slug) + 1 : undefined,
    bgColor: post.bgColor,
    body: {
      code: `
        function MDXContent() {
          return null;
        }
      `,
    },
    toc: [],
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${siteMetadata.siteUrl}/relato/${slug}`,
    name: post.title,
    headline: post.title,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${siteMetadata.siteUrl}/autor/${post.author.slug.current}`
    },
    datePublished: post.date,
    dateModified: post.date,
    description: post.summary,
    genre: 'Literatura',
    inLanguage: 'es-ES',
    image: isTranstextos ? undefined : post.image,
    url: `${siteMetadata.siteUrl}/relato/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      url: siteMetadata.siteUrl
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteMetadata.siteUrl}/relato/${slug}`
    }
  }

  const Layout = layouts[defaultLayout]

  // Optimización: usar map más eficiente
  const formattedSeriesRelatos =
    relatosDeSerie?.map((r, index) => ({
      title: r.title,
      slug: r.slug.current,
      path: `relato/${r.slug.current}`,
      order: index + 1,
    })) || []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', item: `${siteMetadata.siteUrl}/` },
          { name: 'Relatos', item: `${siteMetadata.siteUrl}/posts` },
          { name: post.title, item: `${siteMetadata.siteUrl}/relato/${slug}` },
        ]}
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
        {serie && (
          <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
            {/* Progress Indicator */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Serie: {serie.title}
                  </h2>
                </div>
                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-sm text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  {serie.relatos.findIndex((r) => r.slug.current === params.slug) + 1} de{' '}
                  {serie.relatos.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((serie.relatos.findIndex((r) => r.slug.current === params.slug) + 1) / serie.relatos.length) * 100}%`,
                    backgroundColor: 'var(--color-accent)',
                  }}
                ></div>
              </div>

              {/* Series Description */}
              {serie.description && (
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {serie.description}
                </p>
              )}

              {/* Reading Time for Full Series */}
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    Serie completa: ~
                    {serie.relatos.reduce((total, relato) => total + (relato.readingTime || 5), 0)}{' '}
                    min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>{serie.relatos.length} relatos</span>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="mb-6 flex items-center justify-between">
              {(() => {
                const currentIndex = serie.relatos.findIndex((r) => r.slug.current === params.slug)
                const prevStory = currentIndex > 0 ? serie.relatos[currentIndex - 1] : null
                const nextStory =
                  currentIndex < serie.relatos.length - 1 ? serie.relatos[currentIndex + 1] : null

                return (
                  <>
                    <div className="flex-1">
                      {prevStory && (
                        <Link href={`/relato/${prevStory.slug.current}`}>
                          <button className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200 dark:bg-gray-600 dark:group-hover:bg-gray-700">
                              <ArrowLeft className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Anterior
                              </div>
                              <div className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {prevStory.title}
                              </div>
                            </div>
                          </button>
                        </Link>
                      )}
                    </div>

                    <div className="flex flex-1 justify-end">
                      {nextStory && (
                        <Link href={`/relato/${nextStory.slug.current}`}>
                          <button className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div className="text-right">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Siguiente
                              </div>
                              <div className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {nextStory.title}
                              </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200 dark:bg-gray-600 dark:group-hover:bg-gray-700">
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </button>
                        </Link>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Enhanced Timeline */}
            <div className="space-y-3">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Cronología de la Serie
                </h3>
              </div>
              {serie.relatos.map((relato, index) => {
                const isCurrent = relato.slug.current === params.slug
                const isRead =
                  index < serie.relatos.findIndex((r) => r.slug.current === params.slug)

                return (
                  <div
                    key={relato.slug.current}
                    className={`relative flex items-center gap-4 rounded-lg border p-4 transition-all duration-200 ${
                      isCurrent
                        ? 'border-gray-300 bg-gray-50 shadow-sm ring-2 ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:ring-gray-600'
                        : isRead
                          ? 'border-gray-200 bg-gray-50 opacity-75 dark:border-gray-700 dark:bg-gray-800'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                    } `}
                  >
                    {/* Status Icon */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                        isCurrent
                          ? 'border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-100'
                          : isRead
                            ? 'border-gray-300 bg-gray-200 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            : 'border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      } `}
                      style={
                        isCurrent ? { backgroundColor: 'var(--color-accent)', color: '#000' } : {}
                      }
                    >
                      {isCurrent ? (
                        <Play className="h-4 w-4" />
                      ) : isRead ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Story Info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4
                          className={`font-medium transition-colors ${
                            isCurrent
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-gray-900 dark:text-gray-100'
                          } `}
                        >
                          {relato.title}
                        </h4>
                        {isCurrent && (
                          <span
                            className="rounded-full border border-gray-300 px-2 py-1 text-xs text-black dark:border-gray-600"
                            style={{ backgroundColor: 'var(--color-accent)' }}
                          >
                            Leyendo ahora
                          </span>
                        )}
                      </div>

                      {relato.summary && (
                        <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                          {relato.summary}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{relato.readingTime || 5} min</span>
                        </div>
                        {relato.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(relato.date).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {!isCurrent ? (
                        <Link href={`/relato/${relato.slug.current}`}>
                          <button
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                              isRead
                                ? 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            } `}
                          >
                            {isRead ? 'Releer' : 'Leer'}
                          </button>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <BookOpen className="h-4 w-4" />
                          Actual
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Series Completion Badge */}
            {serie.relatos.findIndex((r) => r.slug.current === params.slug) ===
              serie.relatos.length - 1 && (
              <div
                className="mt-6 rounded-lg border border-gray-300 p-4 text-center dark:border-gray-600"
                style={{ backgroundColor: 'var(--color-accent)', color: '#000' }}
              >
                <div className="mb-2 flex items-center justify-center gap-2 font-medium">
                  <PartyPopper className="h-5 w-5" />
                  ¡Felicitaciones! Has terminado la serie completa
                </div>
                <p className="text-sm opacity-80">
                  Acabas de completar todos los {serie.relatos.length} relatos de "{serie.title}"
                </p>
              </div>
            )}
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
        readingTime={post.readingTime}
        seriesName={serie?.title}
      />
    </>
  )
}
