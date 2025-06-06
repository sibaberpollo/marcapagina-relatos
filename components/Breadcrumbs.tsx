'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

const labelMap: Record<string, string> = {
  relato: 'Relatos',
  articulo: 'Artículos',
  autores: 'Autores',
  autor: 'Autores', // autor individual también debe enlazar a /autores
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

export default function Breadcrumbs({ force = false }: { force?: boolean } = {}) {
  const pathname = usePathname()
  const [authorName, setAuthorName] = useState<string>('')
  
  if (!force && pathname.startsWith('/relato/')) return null
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  // Obtener el nombre del autor si estamos en una página de autor
  useEffect(() => {
    if (segments[0] === 'autor' && segments.length > 1) {
      getAuthorName(segments[1]).then(setAuthorName)
    }
  }, [segments])

  let crumbs: { href: string; label: string }[] = []

  if (segments[0] === 'relato' && segments.length > 1) {
    crumbs.push({ href: '/cronologico', label: 'Todos los Relatos' })
    crumbs.push({ href: pathname, label: toTitleCase(segments[1]) })
  } else if (segments[0] === 'autor' && segments.length > 1) {
    // Para páginas de autor individual: /autor/slug
    crumbs.push({ href: '/autores', label: 'Autores' })
    crumbs.push({ href: pathname, label: authorName || toTitleCase(segments[1]) })
  } else if (segments[0] === 'autores' && segments.length > 1) {
    // Para páginas de autor individual: /autores/slug (si existiera)
    crumbs.push({ href: '/autores', label: 'Autores' })
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
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: siteMetadata.siteUrl,
      },
      ...crumbs.map((c, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: c.label,
        item: siteMetadata.siteUrl.replace(/\/$/, '') + c.href,
      })),
    ],
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="mt-4 mb-2 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:underline">
              Inicio
            </Link>
          </li>
          {crumbs.map((c, idx) => (
            <li key={c.href} className="flex items-center gap-1">
              <span className="mx-1">/</span>
              {idx === crumbs.length - 1 ? (
                <span aria-current="page" className="text-gray-700 dark:text-gray-300">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
