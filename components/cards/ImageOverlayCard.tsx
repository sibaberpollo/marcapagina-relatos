'use client'

import Image from '../Image'
import Link from '../Link'

interface ImageOverlayCardProps {
  image: string
  title?: string
  description?: string
  href?: string
  tags?: string[]
  overlayText?: string // Texto que aparece sobre el overlay
}

export default function ImageOverlayCard({
  image,
  title,
  description,
  href,
  tags,
  overlayText,
}: ImageOverlayCardProps) {
  const content = (
    <div className="group relative cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105">
      {/* Imagen de fondo con altura fija */}
      <div className="relative h-[320px] w-full md:h-[320px]">
        <Image src={image} alt={title || overlayText || ''} fill className="object-cover" />

        {/* Overlay oscuro en la parte inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Tags en esquina superior izquierda */}
        {tags && tags.length > 0 && (
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Texto sobre el overlay */}
        {overlayText && (
          <div className="absolute right-0 bottom-0 left-0 z-10 p-6">
            <p className="text-center text-sm leading-relaxed font-medium text-white md:text-base">
              {overlayText}
            </p>
          </div>
        )}

        {/* Título y descripción alternativos si no hay overlayText */}
        {!overlayText && (title || description) && (
          <div className="absolute right-0 bottom-0 left-0 z-10 p-6">
            {title && <h3 className="mb-2 text-center text-lg font-bold text-white">{title}</h3>}
            {description && (
              <p className="text-center text-sm text-white opacity-90">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Si tiene href, envolver en Link
  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}
