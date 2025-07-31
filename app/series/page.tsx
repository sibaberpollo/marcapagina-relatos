import { Metadata } from 'next'
import Link from 'next/link'
import { getAllSeries } from '@/lib/sanity'
import siteMetadata from '@/data/siteMetadata'
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Series Literarias - Marca Página',
  description: 'Explora nuestras series literarias: colecciones de relatos organizados temática o cronológicamente por nuestros autores.',
  openGraph: {
    type: 'website',
    title: 'Series Literarias - Marca Página',
    description: 'Explora nuestras series literarias: colecciones de relatos organizados temática o cronológicamente por nuestros autores.',
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
    description: 'Explora nuestras series literarias: colecciones de relatos organizados temática o cronológicamente por nuestros autores.',
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
        author: serie.authors?.map(author => ({
          '@type': 'Person',
          name: author.name
        }))
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        {/* Header */}
        <header className="py-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Series Literarias
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Explora nuestras colecciones de relatos organizados temática o cronológicamente. 
            Cada serie te lleva en un viaje narrativo único a través de múltiples capítulos.
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
                <article className="h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-[var(--color-accent)] transition-all duration-300 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full border text-black"
                        style={{
                          backgroundColor: 'var(--color-accent)',
                          borderColor: 'var(--color-accent)'
                        }}
                      >
                        {serie.totalRelatos} relatos
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-[var(--color-accent)] transition-colors">
                      {serie.title}
                    </h2>
                    
                    {serie.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                        {serie.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="px-6 pb-6">
                    {/* Autores */}
                    {serie.authors && serie.authors.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3" />
                        <span>
                          {serie.authors.map(author => author.name).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {/* Call to Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Explorar serie
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-[var(--color-accent)] transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No hay series disponibles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Las series se mostrarán aquí cuando estén disponibles.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ¿Quieres crear tu propia serie?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Si eres autor y tienes relatos relacionados, puedes organizarlos en una serie 
              para ofrecer una experiencia de lectura más rica a tus lectores.
            </p>
            <Link 
              href="/publica"
              className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 hover:shadow-md border text-black hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                borderColor: 'var(--color-accent)'
              }}
            >
              <span>Comienza a escribir</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}