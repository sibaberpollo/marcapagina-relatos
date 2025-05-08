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
    <div className="pt-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('relatos')}
              className={`inline-block p-4 ${
                activeTab === 'relatos'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Relatos
            </button>
          </li>
          {series.length > 0 && (
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('series')}
                className={`inline-block p-4 ${
                  activeTab === 'series'
                    ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Series
              </button>
            </li>
          )}
        </ul>
      </div>
      
      {/* Tab content */}
      <div className="py-4">
        {activeTab === 'relatos' && (
          <div className="space-y-4">
            {relatos.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {relatos.map((relato) => (
                  <li key={relato.slug.current} className="py-4">
                    <Link
                      href={`/${authorSlug}/relato/${relato.slug.current}`}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-800 -m-3 p-3 rounded-md transition duration-150 ease-in-out"
                    >
                      <div className="font-medium text-xl text-black dark:text-white">{relato.title}</div>
                      {relato.summary && (
                        <p className="mt-1 text-gray-500 dark:text-gray-400 line-clamp-2">
                          {relato.summary}
                        </p>
                      )}
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(relato.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </Link>
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
          <div className="space-y-8">
            {series.length > 0 ? (
              series.map((serie) => (
                <div key={serie.slug.current} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                    {serie.title}
                  </h3>
                  {serie.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{serie.description}</p>
                  )}
                  
                  {/* Lista de relatos en la serie */}
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Relatos en esta serie:</h4>
                    <ul className="space-y-2">
                      {serie.relatos.map((relato, index) => (
                        <li key={relato.slug.current} className="flex items-start">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-black text-white text-xs mr-3 flex-shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <Link
                              href={`/${authorSlug}/relato/${relato.slug.current}`}
                              className="text-black dark:text-white hover:underline font-medium"
                            >
                              {relato.title}
                            </Link>
                            {relato.summary && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {relato.summary}
                              </p>
                            )}
                          </div>
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