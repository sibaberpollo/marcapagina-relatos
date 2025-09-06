import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSerieBySlug, getAllSeries } from '@/lib/sanity'
import siteMetadata from '@/data/siteMetadata'
import { BookOpen, Clock, ArrowRight, User, Calendar } from 'lucide-react'

interface SeriePageProps {
  params: Promise<{ slug: string }>
}

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: SeriePageProps): Promise<Metadata> {
  const { slug } = await params
  const { serie } = await getSerieBySlug(slug)

  if (!serie) {
    return {
      title: 'Serie no encontrada',
      description: 'La serie solicitada no existe.',
    }
  }

  const title = `${serie.title} - Serie Literaria`
  const description =
    serie.description ||
    `Serie literaria "${serie.title}" con ${serie.relatos?.length || 0} relatos en Marca Página.`
  const url = `${siteMetadata.siteUrl}/serie/${slug}`

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: siteMetadata.title,
      images: [
        {
          url: `${siteMetadata.siteUrl}/static/images/marcapagina_card.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteMetadata.siteUrl}/static/images/marcapagina_card.png`],
    },
    alternates: {
      canonical: url,
    },
  }
}

// Generar rutas estáticas para SEO
export async function generateStaticParams() {
  const series = await getAllSeries()

  return series.map((serie) => ({
    slug: serie.slug.current,
  }))
}

export default async function SeriePage({ params }: SeriePageProps) {
  const { slug } = await params
  const { serie, relatosDeSerie } = await getSerieBySlug(slug)

  if (!serie) {
    notFound()
  }

  const totalReadingTime = relatosDeSerie.reduce(
    (total, relato) => total + (relato.readingTime?.minutes || 5),
    0
  )
  const firstStory = relatosDeSerie[0]
  const mainAuthor = serie.authors?.[0]

  // JSON-LD estructurado para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: serie.title,
    description: serie.description,
    url: `${siteMetadata.siteUrl}/serie/${slug}`,
    author: serie.authors?.map((author) => ({
      '@type': 'Person',
      name: author.name,
      url: `${siteMetadata.siteUrl}/autor/${author.slug.current}`,
    })),
    numberOfItems: relatosDeSerie.length,
    hasPart: relatosDeSerie.map((relato, index) => ({
      '@type': 'CreativeWork',
      name: relato.title,
      description: relato.summary,
      position: index + 1,
      url: `${siteMetadata.siteUrl}/relato/${relato.slug.current}`,
      author: {
        '@type': 'Person',
        name: relato.author.name,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        {/* Header de la Serie */}
        <header className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            <span
              className="rounded-full border px-4 py-2 text-sm font-medium text-black"
              style={{
                backgroundColor: 'var(--color-accent)',
                borderColor: 'var(--color-accent)',
              }}
            >
              Serie Literaria
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            {serie.title}
          </h1>

          {serie.description && (
            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {serie.description}
            </p>
          )}

          {/* Stats de la Serie */}
          <div className="mb-6 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{relatosDeSerie.length} relatos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>~{totalReadingTime} min</span>
            </div>
            {mainAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/autor/${mainAuthor.slug.current}`}
                  className="flex items-center gap-2 transition-colors hover:text-gray-700 dark:hover:text-[var(--color-accent)]"
                >
                  {mainAuthor.avatar && (
                    <img
                      src={mainAuthor.avatar}
                      alt={mainAuthor.name}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <span>{mainAuthor.name}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Botón Comenzar Serie */}
          {firstStory && (
            <Link href={`/relato/${firstStory.slug.current}`}>
              <button
                className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium text-black transition-all duration-200 hover:opacity-90 hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                }}
              >
                <span>Comenzar serie</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          )}
        </header>

        {/* Lista de Relatos de la Serie */}
        <div className="mb-16 space-y-4">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            Cronología de la Serie
          </h2>

          {relatosDeSerie.map((relato, index) => (
            <div key={relato.slug.current} className="group">
              <Link
                href={`/relato/${relato.slug.current}`}
                className="block rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:hover:border-[var(--color-accent)] dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-4">
                  {/* Número del Relato */}
                  <div className="series-story-number flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-600 transition-all dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {index + 1}
                  </div>

                  {/* Información del Relato */}
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-[var(--color-accent)]">
                      {relato.title}
                    </h3>

                    {relato.summary && (
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {relato.summary}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{relato.readingTime?.minutes || 5} min</span>
                      </div>
                      {relato.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(relato.date).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{relato.author.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex-shrink-0 text-gray-400 transition-colors group-hover:text-gray-600 dark:group-hover:text-[var(--color-accent)]">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
