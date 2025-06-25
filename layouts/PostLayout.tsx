import { ReactNode } from 'react'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import AutoAvatar from '@/components/AutoAvatar'
import ShareIcons from '@/components/ShareIcons'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

interface PostLayoutProps {
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

export default function JsonPostLayout({ content, next, prev, children }: PostLayoutProps) {
  const { title, author, description, image, bgColor, tags, publishedAt, slug } = content

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <header className="mb-8 text-center">
              <PageTitle>{title}</PageTitle>
              
              {/* Descripción y fecha debajo del título */}
              {(description || publishedAt) && (
                <div className="mt-4 space-y-2 border-b border-gray-200 dark:border-gray-700 pb-6">
                  {description && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      {description}
                    </p>
                  )}
                  {publishedAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {formatDate(publishedAt)}
                    </p>
                  )}
                  
                  {/* Botones de compartir debajo de la fecha */}
                  {slug && (
                    <div className="pt-4">
                      <ShareIcons 
                        title={title} 
                        slug={slug} 
                        className="flex flex-col items-center"
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Imagen destacada sin restricciones de tamaño */}
              {image && (
                <div className="mt-6 mb-6 flex justify-center">
                  <img
                    src={image}
                    alt={title}
                    className="max-w-full h-auto"
                  />
                </div>
              )}
            </header>

            {/* Contenido principal SIN letra capital */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              {children}
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-700 pt-8">
              {/* Botones de compartir al final del post */}
              {slug && (
                <div className="mb-8">
                  <ShareIcons 
                    title={title} 
                    slug={slug} 
                    className="flex flex-col items-center"
                  />
                </div>
              )}

              {/* Autor */}
              <div className="flex items-center gap-3 mb-6">
                <AutoAvatar 
                  name={author} 
                  size={40} 
                  className="h-10 w-10 rounded-full bg-black text-white font-titles text-xl flex items-center justify-center"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {author}
                </span>
              </div>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black text-white dark:bg-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navegación anterior/siguiente */}
              {(next || prev) && (
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {prev && (
                      <Link
                        href={`/post/${prev.slug.current}`}
                        className="text-left hover:underline transition-colors"
                      >
                        <div className="text-xs uppercase tracking-wide mb-1">Anterior</div>
                        <div className="font-medium">{prev.title}</div>
                      </Link>
                    )}
                  </div>
                  
                  <div className="flex-1 text-right">
                    {next && (
                      <Link
                        href={`/post/${next.slug.current}`}
                        className="text-right hover:underline transition-colors"
                      >
                        <div className="text-xs uppercase tracking-wide mb-1">Siguiente</div>
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