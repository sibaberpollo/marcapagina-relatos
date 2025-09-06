import { Metadata } from 'next'
import Link from 'next/link'
import { getAllSeries } from '@/lib/sanity'
import siteMetadata from '@/data/siteMetadata'
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Series Literarias - Marca Página',
  description:
    'Explora nuestras series literarias: colecciones de relatos organizados temática o cronológicamente por nuestros autores.',
  openGraph: {
    type: 'website',
    title: 'Series Literarias - Marca Página',
    description:
      'Explora nuestras series literarias: colecciones de relatos organizados temática o cronológicamente por nuestros autores.',
    url: `${siteMetadata.siteUrl}/series`,
    siteName: siteMetadata.title,
    images: [
      {
        url: `${siteMetadata.siteUrl}/static/images/marcapagina_card.png`,
        width: 1200,
        height: 630,
        alt: 'Series Literarias - Marca Página',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Series Literarias - Marca Página',
    description:
      'Explora nuestras series literarias: colecciones de relatos organizados temática o cronológicamente por nuestros autores.',
    images: [`${siteMetadata.siteUrl}/static/images/marcapagina_card.png`],
  },
}

export default async function SeriesPage() {
  const series = await getAllSeries()

  // JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Series Literarias',
    description: 'Colección de series literarias en Marca Página',
    url: `${siteMetadata.siteUrl}/series`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: series.length,
      itemListElement: series.map((serie, index) => ({
        '@type': 'CreativeWorkSeries',
        position: index + 1,
        name: serie.title,
        description: serie.description,
        url: `${siteMetadata.siteUrl}/serie/${serie.slug.current}`,
        author: serie.authors?.map((author) => ({
          '@type': 'Person',
          name: author.name,
        })),
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto mb-16 max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        {/* Header */}
        <header className="mb-8 py-6 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Series Literarias
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Explora nuestras colecciones de relatos organizados temática o cronológicamente. Cada
            serie te lleva en un viaje narrativo único a través de múltiples capítulos.
          </p>
        </header>

        {/* Grid de Series */}
        {series.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {series.map((serie) => (
              <Link
                key={serie.slug.current}
                href={`/serie/${serie.slug.current}`}
                className="group"
              >
                <article className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[var(--color-accent)]">
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span
                        className="rounded-full border px-2 py-1 text-xs font-medium text-black"
                        style={{
                          backgroundColor: 'var(--color-accent)',
                          borderColor: 'var(--color-accent)',
                        }}
                      >
                        {serie.totalRelatos} relatos
                      </span>
                    </div>

                    <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-[var(--color-accent)]">
                      {serie.title}
                    </h2>

                    {serie.description && (
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {serie.description}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6">
                    {/* Autores */}
                    {serie.authors && serie.authors.length > 0 && (
                      <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{serie.authors.map((author) => author.name).join(', ')}</span>
                      </div>
                    )}

                    {/* Call to Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Explorar serie
                      </span>
                      <ArrowRight className="h-4 w-4 transform text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-gray-600 dark:group-hover:text-[var(--color-accent)]" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              No hay series disponibles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Las series se mostrarán aquí cuando estén disponibles.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
