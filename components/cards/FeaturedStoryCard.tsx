'use client'

import Link from '../Link'
import Image from '../Image'
import AutoAvatar from '../AutoAvatar'
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
  language = 'es',
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
    <div className="mb-6 break-inside-avoid">
      <article className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
        {/* Badge de tipo en esquina superior derecha */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
            <BookOpen className="h-3 w-3" />
            {getBadgeText()}
          </span>
        </div>

        {/* Imagen destacada */}
        {displayImage && (
          <div className="relative h-56 overflow-hidden md:h-64">
            {/* Color de fondo de Sanity */}
            {bgColor && (
              <div className="absolute inset-0 z-0" style={{ backgroundColor: bgColor }} />
            )}

            <Image
              src={displayImage}
              alt={title}
              fill
              className="relative z-10 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Tinte del color de Sanity */}
            {bgColor && (
              <div
                className="absolute inset-0 z-20 opacity-30 mix-blend-overlay"
                style={{ backgroundColor: bgColor }}
              />
            )}

            {/* Metadata superpuesta */}
            <div className="absolute right-4 bottom-4 left-4 z-30 text-white">
              <div className="mb-2 flex items-center gap-2 rounded bg-black/50 px-2 py-1 text-sm">
                <Calendar className="h-4 w-4" />
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
              className="line-clamp-2 text-xl font-bold text-gray-900 transition-colors hover:text-indigo-600 md:text-2xl dark:text-white dark:hover:text-indigo-400"
            >
              {title}
            </Link>
          </h2>

          {/* Summary */}
          {summary && (
            <p className="mb-4 line-clamp-3 leading-relaxed text-gray-700 dark:text-gray-300">
              {summary}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Autor */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <AutoAvatar
                name={author.name}
                size={32}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white"
              />
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span className="font-medium">{author.name}</span>
              </div>
            </div>

            {/* Indicador de lectura */}
            <Link
              href={href}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Leer
              <BookOpen className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Hover effect */}
        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition-colors group-hover:border-indigo-500/50" />
      </article>
    </div>
  )
}
