import { ReactNode } from 'react'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import AutoAvatar from '@/components/AutoAvatar'
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
  }
  next?: { title: string; slug: { current: string } }
  prev?: { title: string; slug: { current: string } }
  children: ReactNode
}

export default function AlternativeLayout({ content, next, prev, children }: AlternativeLayoutProps) {
  const { title, author, description, image, bgColor, tags, publishedAt } = content

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
                </div>
              )}
              
              {/* Imagen PNG transparente centrada */}
              {image && (
                <div className="mt-6 mb-6 flex justify-center">
                  <img
                    src={image}
                    alt={title}
                    className="max-w-full max-h-64 object-contain"
                  />
                </div>
              )}
            </header>

            {/* Contenido principal con letra capital */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <div 
                className="first-letter:float-left first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:leading-[0.8]"
                style={{ 
                  '--tw-first-letter-color': bgColor
                } as any}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  .prose > div::first-letter {
                    color: ${bgColor} !important;
                  }
                `}} />
                {children}
              </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-700 pt-8">
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
                        href={`/microcuento/${prev.slug.current}`}
                        className="text-left text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        <div className="text-xs uppercase tracking-wide mb-1">Anterior</div>
                        <div className="font-medium">{prev.title}</div>
                      </Link>
                    )}
                  </div>
                  
                  <div className="flex-1 text-right">
                    {next && (
                      <Link 
                        href={`/microcuento/${next.slug.current}`}
                        className="text-right text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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