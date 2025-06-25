'use client'

import Image from './Image'
import Link from './Link'

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
  overlayText
}: ImageOverlayCardProps) {
  const content = (
    <div className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105">
      {/* Imagen de fondo con altura fija */}
      <div className="relative w-full h-[320px] md:h-[320px]">
        <Image
          src={image}
          alt={title || overlayText || ''}
          fill
          className="object-cover"
        />
        
        {/* Overlay oscuro en la parte inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Tags en esquina superior izquierda */}
        {tags && tags.length > 0 && (
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-black/40 text-white rounded-full backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Texto sobre el overlay */}
        {overlayText && (
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <p className="text-white text-center text-sm md:text-base font-medium leading-relaxed">
              {overlayText}
            </p>
          </div>
        )}
        
        {/* Título y descripción alternativos si no hay overlayText */}
        {!overlayText && (title || description) && (
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            {title && (
              <h3 className="text-white text-center text-lg font-bold mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-white text-center text-sm opacity-90">
                {description}
              </p>
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