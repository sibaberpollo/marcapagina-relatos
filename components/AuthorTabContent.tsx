"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TabsAuthor from './TabsAuthor';
import { useSearchParams } from 'next/navigation';

type Tab = 'relatos' | 'series' | 'articulos';

interface Content {
  slug: string;
  title: string;
  summary: string;
  series?: string;
}

interface SeriesGroup {
  name: string;
  relatos: Content[];
}

interface AuthorTabContentProps {
  relatos: Content[];
  articulos: Content[];
  authorSlug: string;
  defaultTab?: Tab;
}

export default function AuthorTabContent({ relatos, articulos, authorSlug, defaultTab = 'relatos' }: AuthorTabContentProps) {
  const searchParams = useSearchParams();
  
  // Obtener el tab de los parámetros de URL o usar el defaultTab
  const tabParam = searchParams.get('tab') as Tab | null;
  const initialTab = (tabParam && (tabParam === 'relatos' || tabParam === 'series' || tabParam === 'articulos')) 
    ? tabParam 
    : defaultTab;
  
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // Separar relatos en sueltos y series
  const relatosSueltos = relatos.filter(relato => !relato.series);
  
  // Agrupar los relatos por serie
  const seriesMap: Map<string, Content[]> = new Map();
  relatos.forEach(relato => {
    if (relato.series) {
      if (!seriesMap.has(relato.series)) {
        seriesMap.set(relato.series, []);
      }
      seriesMap.get(relato.series)?.push(relato);
    }
  });
  
  // Convertir el Map a un array para renderizar
  const seriesGroups: SeriesGroup[] = Array.from(seriesMap.entries()).map(([name, relatos]) => ({
    name,
    relatos
  }));

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
              className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir
            </button>
          </div>
          <div className="space-y-8">
            {relatosSueltos.map((relato) => (
              <div key={relato.slug} className="border-b pb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  <Link
                    href={`/${authorSlug}/relato/${relato.slug}`}
                    className="no-underline hover:underline"
                  >
                    {relato.title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{relato.summary}</p>
                <Link
                  href={`/${authorSlug}/relato/${relato.slug}`}
                  className="text-primary-500 font-medium"
                >
                  Leer más &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contenido para el tab de Series */}
      {activeTab === 'series' && seriesGroups.length > 0 && (
        <section className="mt-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold mt-0 pt-0">Series</h2>
            <button 
              onClick={() => {
                const url = `${window.location.origin}/autor/${authorSlug}?tab=series`;
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
          <div className="space-y-12">
            {seriesGroups.map((series) => (
              <div key={series.name} className="border-b pb-8">
                <h3 className="text-2xl font-semibold mb-4">{series.name}</h3>
                <div className="space-y-6 pl-4 border-l-4 border-primary-500">
                  {series.relatos.map((relato) => (
                    <div key={relato.slug} className="pb-4">
                      <h4 className="text-xl font-medium mb-2">
                        <Link
                          href={`/${authorSlug}/relato/${relato.slug}`}
                          className="no-underline hover:underline"
                        >
                          {relato.title}
                        </Link>
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{relato.summary}</p>
                      <Link
                        href={`/${authorSlug}/relato/${relato.slug}`}
                        className="text-primary-500 font-medium"
                      >
                        Leer más &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contenido para el tab de Artículos */}
      {activeTab === 'articulos' && articulos.length > 0 && (
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
            {articulos.map((articulo) => (
              <div key={articulo.slug} className="border-b pb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  <Link
                    href={`/${authorSlug}/articulo/${articulo.slug}`}
                    className="no-underline hover:underline"
                  >
                    {articulo.title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{articulo.summary}</p>
                <Link
                  href={`/${authorSlug}/articulo/${articulo.slug}`}
                  className="text-primary-500 font-medium"
                >
                  Leer más &rarr;
                </Link>
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
      {activeTab === 'articulos' && articulos.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No hay artículos disponibles de este autor.</p>
      )}
    </div>
  );
} 