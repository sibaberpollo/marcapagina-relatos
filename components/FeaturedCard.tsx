'use client'

import Image from './Image'
import Link from './Link'
import { getRelativeTime } from '@/lib/time'
import { toVersal } from '@/lib/utils'
import { BookOpen } from 'lucide-react'

interface FeaturedCardProps {
  title: string
  description: string
  imgSrc: string
  href: string
  authorImgSrc: string
  authorName: string
  authorHref: string
  bgColor: string
  tags: string[]
  publishedAt: string
  language?: string
}

export default function FeaturedCard({
  title,
  description,
  imgSrc,
  href,
  authorImgSrc,
  authorName,
  authorHref,
  bgColor,
  tags,
  publishedAt,
  language = 'es'
}: FeaturedCardProps) {
  const relativeTime = getRelativeTime(publishedAt)
  const formattedTitle = toVersal(title)
  
  const isRelato = href.includes('/relato/')
  const isMicrocuento = href.includes('/microcuento/')
  
  const getBadgeText = () => {
    if (isMicrocuento) {
      return language === 'en' ? 'Flash fiction' : 'Microcuento'
    }
    return language === 'en' ? 'Short story' : 'Relato'
  }

  return (
    <div className="group relative h-full [&_a]:!text-gray-900 dark:[&_a]:!text-gray-900">
      <Link href={href} aria-label={`Link to ${title}`} className="block w-full h-full">
        <div 
          className="relative flex flex-col rounded-lg overflow-hidden w-full h-full cursor-pointer hover:scale-105 transition-transform duration-200" 
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex-1 flex items-center justify-center relative min-h-[320px]">
            <div className="absolute top-4 left-4 z-10">
              <img
                src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748543049/android-chrome-192x192-1-e1602674825140_rwwa0n.png"
                alt="Feed de narrativa"
                className="w-[25px] h-[25px] opacity-70"
                width={25}
                height={25}
              />
            </div>
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/80 text-white shadow-lg backdrop-blur-sm">
                <BookOpen className="w-3 h-3" />
                {getBadgeText()}
              </span>
            </div>
            <Image
              src={imgSrc}
              alt={title}
              className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] object-contain"
              width={280}
              height={280}
            />
          </div>
          <div className="flex flex-col mt-auto">
            <div className="px-6 mb-2">
              <h2 className="text-xl font-bold leading-8 tracking-tight hover:underline">
                {formattedTitle}
              </h2>
              <p className="text-base text-black/90 line-clamp-2 text-left">{description}</p>
            </div>
            <div 
              className="w-full px-6 py-3 relative"
              style={{ backgroundColor: bgColor }}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative flex items-center gap-3">
                <Image
                  src={authorImgSrc}
                  alt={authorName}
                  width={32}
                  height={32}
                  className="rounded-full contrast-150 grayscale brightness-110"
                />
                <div>
                  <span className="text-white font-medium text-left">{authorName}</span>
                  <span className="text-white/80 text-xs mt-0.5 text-left block">{relativeTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
} 