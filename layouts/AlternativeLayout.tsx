import { ReactNode } from 'react'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import AutoAvatar from '@/components/AutoAvatar'
import EngageBar from '@/components/EngageBar'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

interface AlternativeLayoutProps {
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

export default function AlternativeLayout({
  content,
  next,
  prev,
  children,
}: AlternativeLayoutProps) {
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
                </div>
              )}

              {/* Imagen PNG transparente centrada */}
              {image && (
                <div className="mt-6 mb-6 flex justify-center">
                  <img src={image} alt={title} className="max-h-64 max-w-full object-contain" />
                </div>
              )}
            </header>

            {/* Barra de engagement unificada antes del contenido */}
            <div className="mb-8">
              <EngageBar slug={slug || ''} title={title} contentType="post" />
            </div>

            {/* Contenido principal con letra capital */}
            <div className="prose prose-lg dark:prose-invert mb-8 max-w-none">
              <div
                className="first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:leading-[0.8] first-letter:font-bold"
                style={
                  {
                    '--tw-first-letter-color': bgColor,
                  } as any
                }
              >
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                  .prose > div::first-letter {
                    color: ${bgColor} !important;
                  }
                `,
                  }}
                />
                {children}
              </div>
            </div>

            {/* Barra de engagement unificada después del contenido */}
            <div className="mb-8">
              <EngageBar slug={slug || ''} title={title} contentType="post" />
            </div>

            {/* Footer import */}
            <footer className="border-t border-gray-200 pt-8 dark:border-gray-700">
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
                        href={`/relato/${prev.slug.current}`}
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
                        href={`/relato/${next.slug.current}`}
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
