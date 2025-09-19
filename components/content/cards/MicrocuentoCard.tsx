'use client'

import Link from '../../common/Link'

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
  tags,
}: MicrocuentoCardProps) {
  return (
    <div className="h-full w-full">
      <Link href={href} className="group block h-full">
        <div
          className="relative flex h-full flex-col overflow-hidden rounded-lg p-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
          style={{ backgroundColor: bgColor }}
        >
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block rounded bg-black/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Imagen PNG transparente centrada */}
          {imgSrc && (
            <div className="mb-2 flex flex-1 items-center justify-center">
              <img src={imgSrc} alt={title} className="w-3/4 max-w-[400px] object-contain" />
            </div>
          )}

          {/* Contenido inferior */}
          <div className="mt-auto space-y-1 text-center">
            {/* Autor */}
            <p className="text-xs text-black sm:text-sm">{author}</p>

            {/* Título */}
            <h3 className="text-xl leading-tight font-bold text-black sm:text-2xl">{title}</h3>

            {/* Descripción */}
            <p className="line-clamp-3 text-sm text-black opacity-90">{description}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
