'use client'

import Image from '../Image'
import Link from '../Link'
import { Waypoints } from 'lucide-react'

interface Chapter {
  title: string
  slug: string
  order: number
}

interface SeriesCardProps {
  seriesName: string
  seriesCover?: string
  latestChapter: {
    title: string
    slug: string
    preview: string
    order: number
  }
  previousChapters: Chapter[]
  language?: string
  href?: string
  backgroundColor?: string
  textColor?: string
}

export default function SeriesCard({
  seriesName,
  seriesCover,
  latestChapter,
  previousChapters,
  language = 'es',
  href,
  backgroundColor = '#ee686b',
  textColor = '#ffffff'
}: SeriesCardProps) {
  const seriesText = language === 'en' ? 'Series' : 'Serie'
  const chapterText = language === 'en' ? 'Chapter' : 'Capítulo'

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

                     {/* Header - con padding para evitar superposición con badge y margin-top grande */}
           <div className="p-4 pr-16 pb-6 flex-shrink-0 mt-16">
             <div className="text-left">
               <p className="text-sm font-medium mb-2" style={{ color: textColor }}>
                 {seriesText}: <span className="italic">{seriesName}</span>
               </p>
               <Link href={`/relato/${latestChapter.slug}`}>
                 <h3 className="text-xl font-bold leading-tight hover:opacity-80 transition-opacity cursor-pointer" style={{ color: textColor }}>
                   {chapterText} {latestChapter.order}: {latestChapter.title}
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

                     {/* Footer con scroll horizontal de capítulos anteriores */}
           {previousChapters.length > 0 && (
             <div className="px-4 py-3 flex-shrink-0">
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