import Image from '../../common/Image'
import Link from '../../common/Link'
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
  transtextos?: boolean
}

function getInitials(name: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase())
  return initials.join('') || ''
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
  language = 'es',
  transtextos = false,
}: FeaturedCardProps) {
  const relativeTime = getRelativeTime(publishedAt)
  const formattedTitle = toVersal(title)
  const authorInitials = getInitials(authorName) || '?'

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
      <Link href={href} aria-label={`Link to ${title}`} className="block h-full w-full">
        <div
          className="relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105"
          style={{ backgroundColor: bgColor }}
        >
          <div className="relative flex min-h-[320px] flex-1 items-center justify-center">
            {transtextos && (
              <div className="absolute top-4 left-4 z-10">
                <img
                  src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748543049/android-chrome-192x192-1-e1602674825140_rwwa0n.png"
                  alt="Feed de narrativa"
                  className="h-[25px] w-[25px] opacity-100"
                  width={25}
                  height={25}
                />
              </div>
            )}
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                <BookOpen className="h-3 w-3" />
                {getBadgeText()}
              </span>
            </div>
            <Image
              src={imgSrc}
              alt={title}
              className="h-[220px] w-[220px] object-contain md:h-[280px] md:w-[280px]"
              width={280}
              height={280}
            />
          </div>
          <div className="mt-auto flex flex-col">
            <div className="mb-2 px-6">
              <h2 className="text-xl leading-8 font-bold tracking-tight hover:underline">
                {formattedTitle}
              </h2>
              <p className="line-clamp-2 text-left text-base text-black/90">{description}</p>
            </div>
            <div className="relative w-full px-6 py-3" style={{ backgroundColor: bgColor }}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative flex items-center gap-3">
                {authorImgSrc ? (
                  <Image
                    src={authorImgSrc}
                    alt={authorName}
                    width={32}
                    height={32}
                    className="rounded-full brightness-110 contrast-150 grayscale"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white uppercase">
                    {authorInitials}
                  </div>
                )}
                <div>
                  <span className="text-left font-medium text-white">{authorName}</span>
                  <span className="mt-0.5 block text-left text-xs text-white/80">
                    {relativeTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
