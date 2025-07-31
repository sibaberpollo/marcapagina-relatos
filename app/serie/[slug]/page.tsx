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
      description: 'La serie solicitada no existe.'
    }
  }

  const title = `${serie.title} - Serie Literaria`
  const description = serie.description || `Serie literaria "${serie.title}" con ${serie.relatos?.length || 0} relatos en Marca Página.`
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

  const totalReadingTime = relatosDeSerie.reduce((total, relato) => total + (relato.readingTime?.minutes || 5), 0)
  const firstStory = relatosDeSerie[0]
  const mainAuthor = serie.authors?.[0]

  // JSON-LD estructurado para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: serie.title,
    description: serie.description,
    url: `${siteMetadata.siteUrl}/serie/${slug}`,
    author: serie.authors?.map(author => ({
      '@type': 'Person',
      name: author.name,
      url: `${siteMetadata.siteUrl}/autor/${author.slug.current}`
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
        name: relato.author.name
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        {/* Breadcrumbs */}
        <nav className="mt-4 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:underline">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/series" className="hover:underline">Series</Link>
            </li>
            <li>/</li>
            <li className="text-gray-700 dark:text-gray-300" aria-current="page">
              {serie.title}
            </li>
          </ol>
        </nav>

        {/* Header de la Serie */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            <span 
              className="px-4 py-2 text-sm font-medium rounded-full border text-black"
              style={{
                backgroundColor: 'var(--color-accent)',
                borderColor: 'var(--color-accent)'
              }}
            >
              Serie Literaria
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {serie.title}
          </h1>
          
          {serie.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6">
              {serie.description}
            </p>
          )}

          {/* Stats de la Serie */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{relatosDeSerie.length} relatos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>~{totalReadingTime} min total</span>
            </div>
            {mainAuthor && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <Link 
                  href={`/autor/${mainAuthor.slug.current}`}
                  className="hover:text-gray-700 dark:hover:text-[var(--color-accent)] transition-colors"
                >
                  {mainAuthor.name}
                </Link>
              </div>
            )}
          </div>

          {/* Botón Comenzar Serie */}
          {firstStory && (
            <Link href={`/relato/${firstStory.slug.current}`}>
              <button 
                className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 hover:shadow-md border text-black hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)'
                }}
              >
                <span>Comenzar serie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </header>

        {/* Lista de Relatos de la Serie */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            Cronología de la Serie
          </h2>
          
          {relatosDeSerie.map((relato, index) => (
            <div key={relato.slug.current} className="group">
              <Link 
                href={`/relato/${relato.slug.current}`}
                className="block p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-[var(--color-accent)] hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Número del Relato */}
                  <div className="series-story-number flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-sm font-semibold border border-gray-200 dark:border-gray-600 transition-all">
                    {index + 1}
                  </div>
                  
                  {/* Información del Relato */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-[var(--color-accent)] transition-colors line-clamp-1 mb-2">
                      {relato.title}
                    </h3>
                    
                    {relato.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {relato.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{relato.readingTime?.minutes || 5} min</span>
                      </div>
                      {relato.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(relato.date).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{relato.author.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow Indicator */}
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-[var(--color-accent)] transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer con autores */}
        {serie.authors && serie.authors.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {serie.authors.length === 1 ? 'Autor' : 'Autores'} de la serie
            </h3>
            <div className="flex flex-wrap gap-4">
              {serie.authors.map((author) => (
                <Link 
                  key={author.slug.current}
                  href={`/autor/${author.slug.current}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  {author.avatar && (
                    <img 
                      src={author.avatar} 
                      alt={author.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {author.name}
                    </div>
                    {author.occupation && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {author.occupation}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}