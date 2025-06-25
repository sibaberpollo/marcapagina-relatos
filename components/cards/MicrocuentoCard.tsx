'use client'

import Link from '../Link'

interface MicrocuentoCardProps {
  title: string
  author: string
  description: string
  imgSrc?: string
  href: string
  bgColor: string
  tags: string[]
}

export default function MicrocuentoCard({
  title,
  author,
  description,
  imgSrc,
  href,
  bgColor,
  tags
}: MicrocuentoCardProps) {
  return (
    <div className="w-full h-full">
      <Link href={href} className="block h-full group">
        <div 
          className="relative h-full p-6 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl flex flex-col"
          style={{ backgroundColor: bgColor }}
        >
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-black/20 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Imagen PNG transparente centrada */}
          {imgSrc && (
            <div className="flex-1 flex items-center justify-center mb-2">
              <img
                src={imgSrc}
                alt={title}
                className="w-3/4 max-w-[400px] object-contain"
              />
            </div>
          )}
          
          {/* Contenido inferior */}
          <div className="text-center space-y-1 mt-auto">
            {/* Autor */}
            <p className="text-black text-xs sm:text-sm">
              {author}
            </p>
            
            {/* Título */}
            <h3 className="text-black font-bold text-xl sm:text-2xl leading-tight">
              {title}
            </h3>
            
            {/* Descripción */}
            <p className="text-black text-sm opacity-90 line-clamp-3">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
} 