'use client'

import Link from './Link'
import Image from './Image'
import AutoAvatar from './AutoAvatar'
import { formatDate } from 'pliny/utils/formatDate'
import { Calendar, BookOpen, User } from 'lucide-react'

interface FeaturedStoryCardProps {
  slug: string
  date: string
  title: string
  summary?: string
  tags?: string[]
  author: {
    name: string
    avatar?: string
  }
  image?: string
  image_portada?: string
  bgColor?: string
  series?: string
  seriesOrder?: number
  language?: string
}

export default function FeaturedStoryCard({
  slug,
  date,
  title,
  summary,
  tags,
  author,
  image,
  image_portada,
  bgColor,
  series,
  seriesOrder,
  language = 'es'
}: FeaturedStoryCardProps) {
  const displayImage = image_portada || image
  const href = `/relato/${slug}`
  
  const getBadgeText = () => {
    if (series) {
      return `${series} ${seriesOrder ? `#${seriesOrder}` : ''}`
    }
    return language === 'en' ? 'Short story' : 'Relato'
  }

  return (
    <div className="break-inside-avoid mb-6">
      <article className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
        
        {/* Badge de tipo en esquina superior derecha */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/80 text-white shadow-lg backdrop-blur-sm">
            <BookOpen className="w-3 h-3" />
            {getBadgeText()}
          </span>
        </div>

        {/* Imagen destacada */}
        {displayImage && (
          <div className="relative h-56 md:h-64 overflow-hidden">
            {/* Color de fondo de Sanity */}
            {bgColor && (
              <div 
                className="absolute inset-0 z-0"
                style={{ backgroundColor: bgColor }}
              />
            )}
            
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
            />
            
            {/* Tinte del color de Sanity */}
            {bgColor && (
              <div 
                className="absolute inset-0 z-20 mix-blend-overlay opacity-30"
                style={{ backgroundColor: bgColor }}
              />
            )}
            
            {/* Metadata superpuesta */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-30">
              <div className="flex items-center gap-2 text-sm mb-2 bg-black/50 rounded px-2 py-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={date}>{formatDate(date, 'es')}</time>
              </div>
            </div>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6">
          {/* Título - más prominente */}
          <h2 className="mb-3">
            <Link 
              href={href}
              className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
            >
              {title}
            </Link>
          </h2>

          {/* Summary */}
          {summary && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
              {summary}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Autor */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <AutoAvatar 
                name={author.name}
                size={32}
                className="h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium flex items-center justify-center"
              />
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span className="font-medium">{author.name}</span>
              </div>
            </div>

            {/* Indicador de lectura */}
            <Link
              href={href}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Leer
              <BookOpen className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/50 rounded-xl transition-colors pointer-events-none" />
      </article>
    </div>
  )
} 