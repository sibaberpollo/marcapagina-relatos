'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'

const labelMap: Record<string, string> = {
  relato: 'Relatos',
  articulo: 'Artículos',
  autores: 'Autores',
  autor: 'Autor',
  'acerca-de': 'Acerca de',
  cronologico: 'Cronológico',
  playlist: 'Playlist',
  transtextos: 'Transtextos',
}

function formatLabel(segment: string) {
  return labelMap[segment] || segment.replace(/-/g, ' ')
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const crumbs = segments.map((seg, index) => {
    return {
      href: '/' + segments.slice(0, index + 1).join('/'),
      label: formatLabel(seg),
    }
  })

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
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
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
