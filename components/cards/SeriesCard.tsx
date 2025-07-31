'use client'

import Image from '../Image'
import Link from '../Link'
import { Waypoints } from 'lucide-react'

interface Chapter {
  title: string
  slug: string
  order: number
}

interface SerieRelato {
  title: string
  slug: {
    current: string
  }
  summary?: string
  readingTime?: number
  date?: string
}

interface SerieAutor {
  name: string
  slug: {
    current: string
  }
}

interface Serie {
  title: string
  slug?: {
    current: string
  }
  description?: string
  relatos: SerieRelato[]
  author?: SerieAutor
}

// Props para uso estático (home)
interface StaticSeriesCardProps {
  seriesName: string
  seriesSlug?: string
  seriesCover?: string
  latestChapter: {
    title: string
    slug: string
    preview: string
    order: number
  }
  previousChapters: Chapter[]
  firstChapter?: {
    title: string
    slug: string
    order: number
  }
  language?: string
  href?: string
  backgroundColor?: string
  textColor?: string
  serie?: never
  userProgress?: never
}

// Props para uso dinámico (página de series)
interface DynamicSeriesCardProps {
  serie: Serie
  userProgress?: number
  seriesName?: never
  seriesCover?: never
  latestChapter?: never
  previousChapters?: never
  language?: never
  href?: never
  backgroundColor?: never
  textColor?: never
}

type SeriesCardProps = StaticSeriesCardProps | DynamicSeriesCardProps

export default function SeriesCard(props: SeriesCardProps) {
  // Si es uso dinámico (página de series), convertir a formato estático
  if ('serie' in props && props.serie) {
    const { serie, userProgress = 0 } = props
    const firstStory = serie.relatos[0]
    const restStories = serie.relatos.slice(1)
    
    const staticProps: StaticSeriesCardProps = {
      seriesName: serie.title,
      seriesSlug: serie.slug?.current,
      latestChapter: {
        title: firstStory?.title || '',
        slug: firstStory?.slug?.current || '',
        preview: firstStory?.summary || serie.description || '',
        order: 1
      },
      previousChapters: restStories.map((relato, index) => ({
        title: relato.title,
        slug: relato.slug.current,
        order: index + 2
      })),
      firstChapter: {
        title: firstStory?.title || '',
        slug: firstStory?.slug?.current || '',
        order: 1
      },
      language: 'es',
      backgroundColor: '#efa106',
      textColor: '#ffffff'
    }
    
    return <SeriesCardContent {...staticProps} />
  }
  
  // Uso estático (home)
  return <SeriesCardContent {...props} />
}

function SeriesCardContent({
  seriesName,
  seriesSlug,
  seriesCover,
  latestChapter,
  previousChapters,
  firstChapter,
  language = 'es',
  href,
  backgroundColor = '#ee686b',
  textColor = '#ffffff'
}: StaticSeriesCardProps) {
  const seriesText = language === 'en' ? 'Series' : 'Serie'

  // Crear estilos dinámicos con los colores parametrizables
  const cardStyle = {
    backgroundColor,
    color: textColor
  }

  const badgeStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff'
  }

  const buttonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: textColor
  }

  return (
    <div className="break-inside-avoid mb-6 w-full min-h-[400px]" style={{ aspectRatio: '4/5' }}>
      <div className="relative group w-full h-full">
        {/* Efecto 3D - Cards de fondo */}
        <div className="absolute inset-0 rounded-lg transform rotate-1 translate-x-1 translate-y-1 opacity-60" style={{ backgroundColor }}></div>
        <div className="absolute inset-0 rounded-lg transform rotate-0.5 translate-x-0.5 translate-y-0.5 opacity-80" style={{ backgroundColor }}></div>
        
        {/* Card principal */}
        <div 
          className="relative rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full h-full flex flex-col overflow-hidden"
          style={cardStyle}
        >
          
          {/* Logo de Transtextos en esquina superior izquierda */}
          <div className="absolute top-4 left-4 z-10">
            <img
              src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748543049/android-chrome-192x192-1-e1602674825140_rwwa0n.png"
              alt="Transtextos"
              className="w-[25px] h-[25px] opacity-100"
              width={25}
              height={25}
            />
          </div>

          {/* Badge de tipo en esquina superior derecha - SIN superposición */}
          <div className="absolute top-3 right-3 z-10">
            <span 
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm"
              style={badgeStyle}
            >
              <Waypoints className="w-3 h-3" />
              {seriesText}
            </span>
          </div>

          {/* Header - con padding para evitar superposición con logo y badge */}
          <div className="p-4 pl-16 pr-16 pb-6 flex-shrink-0 mt-16">
            <div className="text-left">
              <p className="text-sm font-medium mb-2" style={{ color: textColor }}>
                {seriesText}: <span className="italic">{seriesName}</span>
              </p>
              <Link href={`/relato/${latestChapter.slug}`}>
                <h3 className="text-xl font-bold leading-tight hover:opacity-80 transition-opacity cursor-pointer" style={{ color: textColor }}>
                  {latestChapter.title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Preview del último capítulo - más abajo */}
          <div className="px-4 pb-2 flex-1">
            <p className="leading-relaxed text-base line-clamp-4" style={{ color: textColor }}>
              {latestChapter.preview}
            </p>
          </div>

          {/* Imagen centrada como separador - SIN fondo */}
          <div className="flex justify-center py-2 flex-shrink-0">
            {seriesCover ? (
              <Image
                src={seriesCover}
                alt={seriesName}
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                <Waypoints className="w-6 h-6" style={{ color: textColor }} />
              </div>
            )}
          </div>

          {/* Botones de navegación */}
          <div className="px-4 pb-3 flex-shrink-0">
            <div className="flex gap-2">
              <Link href={`/relato/${latestChapter.slug}`} className="flex-1">
                <button 
                  className="w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:opacity-90 text-sm"
                  style={buttonStyle}
                >
                  <span style={{ color: textColor }}>
                    {language === 'en' ? 'Read Latest' : 'Leer Último'}
                  </span>
                </button>
              </Link>
              
              {/* Solo mostrar "Comenzar serie" si hay serie disponible */}
              {seriesSlug && (
                <Link href={`/serie/${seriesSlug}`} className="flex-1">
                  <button 
                    className="w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:opacity-90 border text-sm"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: textColor
                    }}
                  >
                    <span style={{ color: textColor }}>
                      {language === 'en' ? 'Start Series' : 'Comenzar Serie'}
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Footer con scroll horizontal de capítulos anteriores */}
          {previousChapters.length > 0 && (
            <div className="px-4 pb-3 flex-shrink-0">
              <p className="text-sm font-medium mb-2" style={{ color: textColor }}>
                {language === 'en' ? 'Previous chapters' : 'Capítulos anteriores'}
              </p>
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex gap-2">
                  {previousChapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={`/relato/${chapter.slug}`}
                      className="flex-shrink-0 px-2 py-1 rounded-full transition-all duration-200 hover:scale-105 hover:opacity-80"
                      style={buttonStyle}
                    >
                      <span className="text-sm font-medium whitespace-nowrap" style={{ color: textColor }}>
                        {chapter.order}. {chapter.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Indicador de hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg transition-colors pointer-events-none"></div>
        </div>
      </div>
    </div>
  )
} 