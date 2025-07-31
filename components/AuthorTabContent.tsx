"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TabsAuthor from './TabsAuthor';
import { useSearchParams } from 'next/navigation';
import HighlightStroke from '@/components/HighlightStroke'
import { BookOpen, Clock, Share2, User, ArrowRight, Calendar } from 'lucide-react'

type Tab = 'relatos' | 'series' | 'articulos';

interface Content {
  slug: string;
  title: string;
  summary: string;
  series?: string;
  isExternal?: boolean;
  externalUrl?: string;
  source?: string;
  image?: string;
  status?: string;
  readingTime?: number;
  date?: string;
}

interface SeriesGroup {
  name: string;
  slug?: string;
  relatos: Content[];
}

interface AuthorTabContentProps {
  relatos: Content[];
  articulos: Content[];
  series?: any[];
  authorSlug: string;
  defaultTab?: Tab;
}

export default function AuthorTabContent({ relatos, articulos, series = [], authorSlug, defaultTab = 'relatos' }: AuthorTabContentProps) {
  const searchParams = useSearchParams();
  
  // Obtener el tab de los parámetros de URL o usar el defaultTab
  const tabParam = searchParams.get('tab') as Tab | null;
  const initialTab = (tabParam && (tabParam === 'relatos' || tabParam === 'series' || tabParam === 'articulos')) 
    ? tabParam 
    : defaultTab;
  
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // Filtrar relatos y artículos por estado
  const publishedRelatos = relatos.filter(relato => relato.status === 'published' || !relato.status);
  const publishedArticulos = articulos.filter(articulo => articulo.status === 'published' || !articulo.status);

  // Separar relatos en sueltos y series
  const relatosSueltos = publishedRelatos.filter(relato => !relato.series);
  
  // Usar las series completas de Sanity o crear grupos simples como fallback
  const seriesGroups: SeriesGroup[] = series.length > 0 
    ? series.map(serie => ({
        name: serie.title,
        slug: serie.slug?.current,
        relatos: serie.relatos.filter(r => r.status === 'published' || !r.status).map(r => ({
          slug: r.slug.current,
          title: r.title,
          summary: r.summary || '',
          date: r.date,
          readingTime: r.readingTime
        }))
      }))
    : (() => {
        // Fallback: agrupar por nombre de serie si no hay datos completos
        const seriesMap: Map<string, Content[]> = new Map();
        publishedRelatos.forEach(relato => {
          if (relato.series) {
            if (!seriesMap.has(relato.series)) {
              seriesMap.set(relato.series, []);
            }
            seriesMap.get(relato.series)?.push(relato);
          }
        });
        
        return Array.from(seriesMap.entries()).map(([name, relatos]) => ({
          name,
          relatos
        }));
      })();

  return (
    <div>
      <TabsAuthor onTabChange={setActiveTab} initialTab={initialTab} />

      {/* Contenido para el tab de Relatos */}
      {activeTab === 'relatos' && relatosSueltos.length > 0 && (
        <section className="mt-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold mt-0 pt-0">Relatos</h2>
            <button 
              onClick={() => {
                const url = `${window.location.origin}/autor/${authorSlug}?tab=relatos`;
                navigator.clipboard.writeText(url);
                alert('Enlace copiado al portapapeles');
              }}
              className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md flex items-center border border-gray-200 dark:border-gray-600"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Compartir
            </button>
          </div>
          <div className="space-y-8">
            {relatosSueltos.map((relato) => (
              <div key={relato.slug} className="border-b pb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  <Link
                    href={`/relato/${relato.slug}`}
                    className="no-underline hover:underline !text-black dark:!text-[var(--color-text-dark)]"
                  >
                    {relato.title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{relato.summary}</p>
                <Link
                  href={`/relato/${relato.slug}`}
                >
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
           <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
             <div className="flex items-center justify-center gap-2 mb-2">
               <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
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
              const totalReadingTime = serie.relatos.reduce((sum, relato) => sum + (relato.readingTime || 5), 0)
              const firstStory = serie.relatos[0]
              
                             return (
                 <div key={serie.name} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-[var(--color-accent)] transition-all duration-300 overflow-hidden">
                   {/* Serie Header */}
                   <div className="p-6 pb-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                     <div className="flex items-start justify-between mb-3">
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-2">
                           <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                           <span 
                             className="px-3 py-1 text-xs font-medium rounded-full border text-black"
                             style={{
                               backgroundColor: 'var(--color-accent)',
                               borderColor: 'var(--color-accent)'
                             }}
                           >
                             Serie · {serie.relatos.length} relatos
                           </span>
                         </div>
                         <Link href={serie.slug ? `/serie/${serie.slug}` : `/autor/${authorSlug}?tab=series&serie=${encodeURIComponent(serie.name)}`}>
                           <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-gray-700 dark:group-hover:text-[var(--color-accent)] transition-colors hover:cursor-pointer">
                             {serie.name}
                           </h3>
                         </Link>
                       </div>
                     </div>
                    
                    {/* Series Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>~{totalReadingTime} min total</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
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
                            className="block p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-[var(--color-accent)] hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex items-center gap-4">
                              {/* Story Number */}
                              <div className="series-story-number flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-sm font-semibold border border-gray-200 dark:border-gray-600 transition-all">
                                {index + 1}
                              </div>
                              
                              {/* Story Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover/story:text-gray-700 transition-colors line-clamp-1 dark:group-hover/story:text-[var(--color-accent)]">
                                  {relato.title}
                                </h4>
                                
                                {relato.summary && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {relato.summary}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{relato.readingTime || 5} min</span>
                                  </div>
                                  {relato.date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>{new Date(relato.date).toLocaleDateString('es-ES')}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Arrow Indicator */}
                              <div className="flex-shrink-0 text-gray-400 group-hover/story:text-gray-600 transition-colors dark:group-hover/story:text-[var(--color-accent)]">
                                <ArrowRight className="w-5 h-5" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                      <Link href={serie.slug ? `/serie/${serie.slug}` : `/autor/${authorSlug}?tab=series&serie=${encodeURIComponent(serie.name)}`}>
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600">
                          <BookOpen className="w-4 h-4" />
                          <span>Ver serie completa</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                      
                      {firstStory && (
                        <Link href={`/relato/${firstStory.slug}`}>
                          <button 
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 hover:shadow-md border text-black hover:opacity-90"
                            style={{
                              backgroundColor: 'var(--color-accent)',
                              borderColor: 'var(--color-accent)'
                            }}
                          >
                            <span>Comenzar a leer</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
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
             <div className="text-center py-12">
               <div className="text-6xl mb-4">📚</div>
               <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold mt-0 pt-0">No ficción</h2>
            <button 
              onClick={() => {
                const url = `${window.location.origin}/autor/${authorSlug}?tab=articulos`;
                navigator.clipboard.writeText(url);
                alert('Enlace copiado al portapapeles');
              }}
              className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir
            </button>
          </div>
          <div className="space-y-8">
            {publishedArticulos.map((articulo) => (
              <div key={articulo.slug} className="border-b pb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {articulo.image && (
                    <div className="md:w-1/4 flex-shrink-0">
                      <img 
                        src={articulo.image} 
                        alt={articulo.title}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold mb-2">
                      {articulo.isExternal ? (
                        <a
                          href={articulo.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline hover:underline !text-black dark:!text-[var(--color-text-dark)] flex items-center"
                        >
                          {articulo.title}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={`/articulo/${articulo.slug}`}
                          className="no-underline hover:underline !text-black dark:!text-[var(--color-text-dark)]"
                        >
                          {articulo.title}
                        </Link>
                      )}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{articulo.summary}</p>
                    {articulo.isExternal ? (
                      <a
                        href={articulo.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 font-medium flex items-center"
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
        <p className="text-gray-600 dark:text-gray-400">No hay relatos disponibles de este autor.</p>
      )}
      {activeTab === 'series' && seriesGroups.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">Este autor no tiene series de relatos.</p>
      )}
      {activeTab === 'articulos' && publishedArticulos.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No hay artículos disponibles de este autor.</p>
      )}
    </div>
  );
} 