'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TabsAuthor from './TabsAuthor'
import { useSearchParams } from 'next/navigation'
import HighlightStroke from '@/components/common/HighlightStroke'
import { BookOpen, Clock, Share2, User, ArrowRight, Calendar } from 'lucide-react'

type Tab = 'relatos' | 'series' | 'articulos'

interface Content {
  slug: string
  title: string
  summary: string
  series?: string
  isExternal?: boolean
  externalUrl?: string
  source?: string
  image?: string
  status?: string
  readingTime?: number
  date?: string
}

interface SeriesGroup {
  name: string
  slug?: string
  relatos: Content[]
}

interface AuthorTabContentProps {
  relatos: Content[]
  articulos: Content[]
  series?: any[]
  authorSlug: string
  defaultTab?: Tab
}

export default function AuthorTabContent({
  relatos,
  articulos,
  series = [],
  authorSlug,
  defaultTab = 'relatos',
}: AuthorTabContentProps) {
  const searchParams = useSearchParams()

  // Obtener el tab de los parámetros de URL o usar el defaultTab
  const tabParam = searchParams.get('tab') as Tab | null
  const initialTab =
    tabParam && (tabParam === 'relatos' || tabParam === 'series' || tabParam === 'articulos')
      ? tabParam
      : defaultTab

  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  // Filtrar relatos y artículos por estado
  const publishedRelatos = relatos.filter(
    (relato) => relato.status === 'published' || !relato.status
  )
  const publishedArticulos = articulos.filter(
    (articulo) => articulo.status === 'published' || !articulo.status
  )

  // Separar relatos en sueltos y series
  const relatosSueltos = publishedRelatos.filter((relato) => !relato.series)

  // Usar las series completas de Sanity o crear grupos simples como fallback
  const seriesGroups: SeriesGroup[] =
    series.length > 0
      ? series.map((serie) => ({
          name: serie.title,
          slug: serie.slug?.current,
          relatos: serie.relatos
            .filter((r) => r.status === 'published' || !r.status)
            .map((r) => ({
              slug: r.slug.current,
              title: r.title,
              summary: r.summary || '',
              date: r.date,
              readingTime: r.readingTime,
            })),
        }))
      : (() => {
          // Fallback: agrupar por nombre de serie si no hay datos completos
          const seriesMap: Map<string, Content[]> = new Map()
          publishedRelatos.forEach((relato) => {
            if (relato.series) {
              if (!seriesMap.has(relato.series)) {
                seriesMap.set(relato.series, [])
              }
              seriesMap.get(relato.series)?.push(relato)
            }
          })

          return Array.from(seriesMap.entries()).map(([name, relatos]) => ({
            name,
            relatos,
          }))
        })()

  return (
    <div>
      <TabsAuthor onTabChange={setActiveTab} initialTab={initialTab} />

      {/* Contenido para el tab de Relatos */}
      {activeTab === 'relatos' && relatosSueltos.length > 0 && (
        <section className="mt-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mt-0 pt-0 text-3xl font-bold">Relatos</h2>
            <button
              onClick={() => {
                const url = `${window.location.origin}/autor/${authorSlug}?tab=relatos`
                navigator.clipboard.writeText(url)
                alert('Enlace copiado al portapapeles')
              }}
              className="flex items-center rounded-md border border-gray-200 bg-gray-100 p-2 text-sm hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Share2 className="mr-1 h-4 w-4" />
              Compartir
            </button>
          </div>
          <div className="space-y-8">
            {relatosSueltos.map((relato) => (
              <div key={relato.slug} className="border-b pb-6">
                <h3 className="mb-2 text-2xl font-semibold">
                  <Link
                    href={`/relato/${relato.slug}`}
                    className="!text-black no-underline hover:underline dark:!text-[var(--color-text-dark)]"
                  >
                    {relato.title}
                  </Link>
                </h3>
                <p className="mb-2 text-gray-600 dark:text-gray-400">{relato.summary}</p>
                <Link href={`/relato/${relato.slug}`}>
                  <HighlightStroke>Leer más &rarr;</HighlightStroke>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contenido para el tab de Series */}
      {activeTab === 'series' && (
        <div className="space-y-6">
          {/* Series Header */}
          <div className="border-b border-gray-200 pb-4 text-center dark:border-gray-700">
            <div className="mb-2 flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Series Literarias
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Relatos organizados en series temáticas o cronológicas
            </p>
          </div>

          {/* Enhanced Series Grid */}
          <div className="grid gap-6 md:gap-8">
            {seriesGroups.map((serie) => {
              const totalReadingTime = serie.relatos.reduce(
                (sum, relato) => sum + (relato.readingTime || 5),
                0
              )
              const firstStory = serie.relatos[0]

              return (
                <div
                  key={serie.name}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[var(--color-accent)]"
                >
                  {/* Serie Header */}
                  <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6 pb-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          <span
                            className="rounded-full border px-3 py-1 text-xs font-medium text-black"
                            style={{
                              backgroundColor: 'var(--color-accent)',
                              borderColor: 'var(--color-accent)',
                            }}
                          >
                            Serie · {serie.relatos.length} relatos
                          </span>
                        </div>
                        <Link
                          href={
                            serie.slug
                              ? `/serie/${serie.slug}`
                              : `/autor/${authorSlug}?tab=series&serie=${encodeURIComponent(serie.name)}`
                          }
                        >
                          <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-gray-700 hover:cursor-pointer dark:text-gray-100 dark:group-hover:text-[var(--color-accent)]">
                            {serie.name}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Series Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>~{totalReadingTime} min total</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{serie.relatos.length} relatos</span>
                      </div>
                    </div>
                  </div>

                  {/* Stories List */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {serie.relatos.map((relato, index) => (
                        <div key={relato.slug} className="group/story relative">
                          <Link
                            href={`/relato/${relato.slug}`}
                            className="block rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:hover:border-[var(--color-accent)] dark:hover:bg-gray-700"
                          >
                            <div className="flex items-center gap-4">
                              {/* Story Number */}
                              <div className="series-story-number flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-600 transition-all dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                {index + 1}
                              </div>

                              {/* Story Info */}
                              <div className="min-w-0 flex-1">
                                <h4 className="line-clamp-1 font-medium text-gray-900 transition-colors group-hover/story:text-gray-700 dark:text-gray-100 dark:group-hover/story:text-[var(--color-accent)]">
                                  {relato.title}
                                </h4>

                                {relato.summary && (
                                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                    {relato.summary}
                                  </p>
                                )}

                                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{relato.readingTime || 5} min</span>
                                  </div>
                                  {relato.date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {new Date(relato.date).toLocaleDateString('es-ES')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Arrow Indicator */}
                              <div className="flex-shrink-0 text-gray-400 transition-colors group-hover/story:text-gray-600 dark:group-hover/story:text-[var(--color-accent)]">
                                <ArrowRight className="h-5 w-5" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                      <Link
                        href={
                          serie.slug
                            ? `/serie/${serie.slug}`
                            : `/autor/${authorSlug}?tab=series&serie=${encodeURIComponent(serie.name)}`
                        }
                      >
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                          <BookOpen className="h-4 w-4" />
                          <span>Ver serie completa</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </Link>

                      {firstStory && (
                        <Link href={`/relato/${firstStory.slug}`}>
                          <button
                            className="flex w-full items-center justify-center gap-2 rounded-lg border px-6 py-3 font-medium text-black transition-all duration-200 hover:opacity-90 hover:shadow-md"
                            style={{
                              backgroundColor: 'var(--color-accent)',
                              borderColor: 'var(--color-accent)',
                            }}
                          >
                            <span>Comenzar a leer</span>
                            <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {seriesGroups.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📚</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                No hay series disponibles
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Este autor aún no ha publicado relatos organizados en series.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contenido para el tab de Artículos */}
      {activeTab === 'articulos' && publishedArticulos.length > 0 && (
        <section className="mt-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="mt-0 pt-0 text-3xl font-bold">No ficción</h2>
            <button
              onClick={() => {
                const url = `${window.location.origin}/autor/${authorSlug}?tab=articulos`
                navigator.clipboard.writeText(url)
                alert('Enlace copiado al portapapeles')
              }}
              className="flex items-center rounded-md bg-gray-100 p-2 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Compartir
            </button>
          </div>
          <div className="space-y-8">
            {publishedArticulos.map((articulo) => (
              <div key={articulo.slug} className="border-b pb-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  {articulo.image && (
                    <div className="flex-shrink-0 md:w-1/4">
                      <img
                        src={articulo.image}
                        alt={articulo.title}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="mb-2 text-2xl font-semibold">
                      {articulo.isExternal ? (
                        <a
                          href={articulo.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center !text-black no-underline hover:underline dark:!text-[var(--color-text-dark)]"
                        >
                          {articulo.title}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={`/articulo/${articulo.slug}`}
                          className="!text-black no-underline hover:underline dark:!text-[var(--color-text-dark)]"
                        >
                          {articulo.title}
                        </Link>
                      )}
                    </h3>
                    <p className="mb-2 text-gray-600 dark:text-gray-400">{articulo.summary}</p>
                    {articulo.isExternal ? (
                      <a
                        href={articulo.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 flex items-center font-medium"
                      >
                        <HighlightStroke>Leer en {articulo.source} &rarr;</HighlightStroke>
                      </a>
                    ) : (
                      <Link
                        href={`/articulo/${articulo.slug}`}
                        className="text-primary-500 font-medium"
                      >
                        <HighlightStroke>Leer más &rarr;</HighlightStroke>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mensaje si no hay contenido para el tab activo */}
      {activeTab === 'relatos' && relatosSueltos.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">
          No hay relatos disponibles de este autor.
        </p>
      )}
      {activeTab === 'series' && seriesGroups.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">Este autor no tiene series de relatos.</p>
      )}
      {activeTab === 'articulos' && publishedArticulos.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">
          No hay artículos disponibles de este autor.
        </p>
      )}
    </div>
  )
}
