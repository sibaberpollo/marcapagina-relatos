import { ReactNode } from 'react'
import Link from '@/components/common/Link'
import PageTitle from '@/components/common/PageTitle'
import SectionContainer from '@/components/layout/SectionContainer'
import AutoAvatar from '@/components/content/authors/AutoAvatar'
import EngageBar from '@/components/content/reactions/EngageBar'
import { PageSEO } from '@/components/seo/SEO'
import siteMetadata from '@/data/siteMetadata'

interface JsonPostLayoutProps {
  content: {
    title: string
    author: string
    description?: string
    image?: string
    bgColor: string
    tags?: string[]
    publishedAt?: string
    slug?: string
  }
  next?: { title: string; slug: { current: string } }
  prev?: { title: string; slug: { current: string } }
  children: ReactNode
}

export default function JsonPostLayout({ content, next, prev, children }: JsonPostLayoutProps) {
  const { title, author, description, image, bgColor, tags, publishedAt, slug } = content

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="relative">
      <PageSEO
        title={`${title} - ${siteMetadata.title}`}
        description={description}
        ogType="article"
      />
      <SectionContainer>
        <article>
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-8 text-center">
              <PageTitle>{title}</PageTitle>

              {/* Descripción y fecha debajo del título */}
              {(description || publishedAt) && (
                <div className="mt-4 space-y-2 border-b border-gray-200 pb-6 dark:border-gray-700">
                  {description && (
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                  )}
                  {publishedAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {formatDate(publishedAt)}
                    </p>
                  )}

                  {/* Botones de compartir debajo de la fecha */}
                  {/* No mostramos barra de reacciones/compartir en tipos no 'relato' */}
                </div>
              )}

              {/* Imagen destacada sin restricciones de tamaño */}
              {image && (
                <div className="mt-6 mb-6 flex justify-center">
                  <img src={image} alt={title} className="h-auto max-w-full" />
                </div>
              )}
            </header>

            {/* Contenido principal SIN letra capital */}
            <div className="prose prose-lg dark:prose-invert mb-8 max-w-none">{children}</div>

            {/* Footer */}
            <footer className="border-t border-gray-200 pt-8 dark:border-gray-700">
              {/* Botones de compartir al final del post */}
              {/* Sin barra en footer para este layout */}

              {/* Autor */}
              <div className="mb-6 flex items-center gap-3">
                <AutoAvatar
                  name={author}
                  size={40}
                  className="font-titles flex h-10 w-10 items-center justify-center rounded-full bg-black text-xl text-white"
                />
                <span className="font-medium text-gray-700 dark:text-gray-300">{author}</span>
              </div>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-3 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-black px-3 py-1 text-sm font-medium text-white dark:bg-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navegación anterior/siguiente */}
              {(next || prev) && (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {prev && (
                      <Link
                        href={`/post/${prev.slug.current}`}
                        className="text-left transition-colors hover:underline"
                      >
                        <div className="mb-1 text-xs tracking-wide uppercase">Anterior</div>
                        <div className="font-medium">{prev.title}</div>
                      </Link>
                    )}
                  </div>

                  <div className="flex-1 text-right">
                    {next && (
                      <Link
                        href={`/post/${next.slug.current}`}
                        className="text-right transition-colors hover:underline"
                      >
                        <div className="mb-1 text-xs tracking-wide uppercase">Siguiente</div>
                        <div className="font-medium">{next.title}</div>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </footer>
          </div>
        </article>
      </SectionContainer>
    </div>
  )
}
