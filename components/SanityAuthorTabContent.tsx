'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface Relato {
  title: string;
  slug: {
    current: string;
  };
  date: string;
  summary?: string;
}

interface Serie {
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  relatos: Relato[];
}

interface SanityAuthorTabContentProps {
  relatos: Relato[];
  series: Serie[];
  authorSlug: string;
  defaultTab: string;
}

export default function SanityAuthorTabContent({ 
  relatos, 
  series, 
  authorSlug, 
  defaultTab = 'relatos' 
}: SanityAuthorTabContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  const [activeTab, setActiveTab] = useState(tabParam || defaultTab)
  
  useEffect(() => {
    // Actualizar la URL cuando cambia la pestaña
    if (tabParam !== activeTab) {
      const params = new URLSearchParams(searchParams.toString())
      if (activeTab === defaultTab) {
        params.delete('tab')
      } else {
        params.set('tab', activeTab)
      }
      
      const newPath = params.toString() 
        ? `${pathname}?${params.toString()}`
        : pathname
        
      router.replace(newPath, {scroll: false})
    }
  }, [activeTab, tabParam, pathname, router, searchParams, defaultTab])
  
  // Actualizar el estado cuando cambia el parámetro de URL
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    } else {
      setActiveTab(defaultTab)
    }
  }, [tabParam, defaultTab])
  
  return (
    <div className="py-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('relatos')}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'relatos'
              ? 'border-b-2 border-primary-500 dark:border-primary-500 text-primary-500 dark:text-primary-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Relatos
        </button>
        
        {series.length > 0 && (
          <button
            onClick={() => setActiveTab('series')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'series'
                ? 'border-b-2 border-primary-500 dark:border-primary-500 text-primary-500 dark:text-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Series
          </button>
        )}
      </div>
      
      {/* Tab content */}
      <div className="py-4">
        {activeTab === 'relatos' && (
          <div>
            {relatos.length > 0 ? (
              <ul>
                {relatos.map((relato) => (
                  <li key={relato.slug.current} className="py-5">
                    <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                      <dl>
                        <dt className="sr-only">Publicado el</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          {new Date(relato.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </dd>
                      </dl>
                      <div className="space-y-3 xl:col-span-3">
                        <div>
                          <h3 className="text-xl font-bold leading-8 tracking-tight">
                            <Link href={`/${authorSlug}/relato/${relato.slug.current}`} className="text-gray-900 dark:text-gray-100">
                              {relato.title}
                            </Link>
                          </h3>
                        </div>
                        {relato.summary && (
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {relato.summary}
                          </div>
                        )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                No hay relatos de este autor
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'series' && (
          <div className="space-y-10">
            {series.length > 0 ? (
              series.map((serie) => (
                <div key={serie.slug.current} className="space-y-3">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {serie.title}
                    </h3>
                    {serie.description && (
                      <p className="text-gray-500 dark:text-gray-400">{serie.description}</p>
                    )}
                  </div>
                  
                  {/* Lista de relatos en la serie */}
                  <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Relatos en esta serie:</h4>
                    <ul className="space-y-3 ml-6 list-disc">
                      {serie.relatos.map((relato) => (
                        <li key={relato.slug.current}>
                          <Link
                            href={`/${authorSlug}/relato/${relato.slug.current}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {relato.title}
                          </Link>
                          {relato.summary && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {relato.summary}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                No hay series de este autor
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 