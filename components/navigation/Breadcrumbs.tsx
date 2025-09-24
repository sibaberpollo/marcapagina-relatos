'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'

interface SerieContext {
  title: string
  currentIndex: number
  totalStories: number
}

interface BreadcrumbsProps {
  serieContext?: SerieContext
}

const labelMap: Record<string, string> = {
  relato: 'Relatos',
  articulo: 'Artículos',
  autores: 'Autores',
  autor: 'Autores', // autor individual también debe enlazar a /autores
  serie: 'Series', // serie individual debe enlazar a /series
  series: 'Series',
  'acerca-de': 'Acerca de',
  cronologico: 'Cronológico',
  playlist: 'Playlist',
  transtextos: 'Transtextos',
}

function formatLabel(segment: string) {
  return labelMap[segment] || segment.replace(/-/g, ' ')
}

function toTitleCase(str: string) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

// Función para obtener el nombre del autor desde Sanity
async function getAuthorName(slug: string): Promise<string> {
  // Solo ejecutar en el navegador
  if (typeof window === 'undefined') {
    return toTitleCase(slug)
  }

  try {
    const response = await fetch(`/api/author/${slug}`)
    if (response.ok) {
      const data = await response.json()
      return data.name || toTitleCase(slug)
    }
  } catch (error) {
    console.error('Error fetching author name:', error)
  }
  return toTitleCase(slug)
}

export default function Breadcrumbs({ serieContext }: BreadcrumbsProps = {}) {
  // ✅ TODOS LOS HOOKS AL PRINCIPIO - ANTES DE CUALQUIER EARLY RETURN
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [authorName, setAuthorName] = useState<string>('')

  // Preparar segments una vez
  const segments = pathname.split('/').filter(Boolean)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Obtener el nombre del autor solo después de que el componente esté montado
  useEffect(() => {
    if (mounted && segments[0] === 'autor' && segments.length > 1) {
      getAuthorName(segments[1]).then(setAuthorName)
    }
  }, [mounted, segments])

  // ✅ EARLY RETURNS DESPUÉS DE TODOS LOS HOOKS
  if (!mounted) return null
  if (pathname.startsWith('/biblioteca-personal')) return null
  if (segments.length === 0) return null

  let crumbs: { href: string; label: string; isSeries?: boolean }[] = []

  if (segments[0] === 'relato' && segments.length > 1) {
    crumbs.push({ href: '/cronologico', label: 'Todos los Relatos' })

    // Add series context if available
    if (serieContext) {
      crumbs.push({
        href: pathname, // For now, series don't have dedicated pages
        label: serieContext.title,
        isSeries: true,
      })
    }

    crumbs.push({ href: pathname, label: toTitleCase(segments[1]) })
  } else if (segments[0] === 'autor' && segments.length > 1) {
    // Para páginas de autor individual: /autor/slug
    crumbs.push({ href: '/autores', label: 'Autores' })
    crumbs.push({ href: pathname, label: authorName || toTitleCase(segments[1]) })
  } else if (segments[0] === 'autores' && segments.length > 1) {
    // Para páginas de autor individual: /autores/slug (si existiera)
    crumbs.push({ href: '/autores', label: 'Autores' })
    crumbs.push({ href: pathname, label: toTitleCase(segments[1]) })
  } else if (segments[0] === 'serie' && segments.length > 1) {
    // Para páginas de serie individual: /serie/slug
    crumbs.push({ href: '/series', label: 'Series' })
    crumbs.push({ href: pathname, label: toTitleCase(segments[1]) })
  } else {
    crumbs = segments.map((seg, index) => {
      // Para /autor sin slug específico, enlazar a /autores
      if (seg === 'autor' && index === 0) {
        return {
          href: '/autores',
          label: formatLabel(seg),
        }
      }
      return {
        href: '/' + segments.slice(0, index + 1).join('/'),
        label: formatLabel(seg),
      }
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${siteMetadata.siteUrl}${pathname}#breadcrumbs`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: {
          '@type': 'WebPage',
          '@id': `${siteMetadata.siteUrl}#webpage`,
          url: siteMetadata.siteUrl,
        },
      },
      ...crumbs.map((c, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: c.label,
        item: {
          '@type': 'WebPage',
          '@id': `${siteMetadata.siteUrl.replace(/\/$/, '')}${c.href}#webpage`,
          url: `${siteMetadata.siteUrl.replace(/\/$/, '')}${c.href}`,
        },
      })),
    ],
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="mt-4 mb-2">
        <div className="flex flex-col gap-2">
          {/* Main breadcrumb */}
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            {crumbs.map((c, idx) => (
              <li key={c.href} className="flex items-center gap-1">
                <span className="mx-1">/</span>
                {idx === crumbs.length - 1 ? (
                  <span
                    aria-current="page"
                    className={`${
                      c.isSeries
                        ? 'flex items-center gap-1 font-medium text-gray-700 dark:text-[var(--color-accent)]'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {c.isSeries && <BookOpen className="h-4 w-4" />}
                    {c.label}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className={`hover:underline ${
                      c.isSeries
                        ? 'flex items-center gap-1 font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-[var(--color-accent)]'
                        : ''
                    }`}
                  >
                    {c.isSeries && <BookOpen className="h-4 w-4" />}
                    {c.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>

          {/* Series progress indicator */}
          {serieContext && (
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span>Progreso en la serie:</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${(serieContext.currentIndex / serieContext.totalStories) * 100}%`,
                      backgroundColor: 'var(--color-accent)',
                    }}
                  ></div>
                </div>
                <span>
                  {serieContext.currentIndex} / {serieContext.totalStories}
                </span>
              </div>
            </div>
          )}
        </div>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
