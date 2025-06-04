'use client'

import Image from './Image'
import Link from './Link'
import { getRelativeTime } from '@/lib/time'
import { toVersal } from '@/lib/utils'

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
  publishedAt
}: FeaturedCardProps) {
  const relativeTime = getRelativeTime(publishedAt)
  const formattedTitle = toVersal(title)

  return (
    <div className="group relative h-full [&_a]:!text-gray-900 dark:[&_a]:!text-gray-900">
      <Link href={href} aria-label={`Link to ${title}`} className="block w-full h-full">
        <div 
          className="relative flex flex-col rounded-lg overflow-hidden w-full h-full cursor-pointer hover:scale-105 transition-transform duration-200" 
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex-1 flex items-center justify-center relative min-h-[280px]">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              {tags && tags.length > 0 && tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium bg-black/20 text-white rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
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
              <h2 className="text-xl font-bold leading-8 tracking-tight">
                <Link href={href} className="hover:underline">
                  {formattedTitle}
                </Link>
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