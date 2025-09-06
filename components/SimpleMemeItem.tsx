'use client'

import Image from './Image'
import Link from './Link'
import { ImageIcon, Download, ShoppingCart, Hash, Sparkles, Package, Camera } from 'lucide-react'
import { useState } from 'react'

interface SimpleMemeItemProps {
  title?: string
  description?: string
  image: string
  image_portada?: string
  href?: string
  type?: 'meme' | 'descarga' | 'merch' | 'post'
  tags?: string[]
  context?: string // Por qué está en el feed
  category?: 'humor' | 'resource' | 'product' | 'announcement'
  overlayText?: string // Texto que aparece sobre un overlay oscuro
  overlay?: boolean // Si debe mostrar overlay o no
}

export default function SimpleMemeItem({
  title,
  description,
  image,
  image_portada,
  href,
  type = 'meme',
  tags,
  context,
  category,
  overlayText,
  overlay = true,
}: SimpleMemeItemProps) {
  const [imageRatio, setImageRatio] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)

  // Configuración de categorías con colores y etiquetas
  const categoryConfig = {
    humor: {
      icon: Sparkles,
      label: 'Humor Literario',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    resource: {
      icon: Hash,
      label: 'Recurso',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    product: {
      icon: Package,
      label: 'Producto',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    announcement: {
      icon: ImageIcon,
      label: 'Anuncio',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    },
  }

  const config = category ? categoryConfig[category] : categoryConfig.humor
  const IconComponent = config.icon

  const icon =
    type === 'meme' ? (
      <ImageIcon className="h-4 w-4" />
    ) : type === 'descarga' ? (
      <Download className="h-4 w-4" />
    ) : type === 'merch' ? (
      <ShoppingCart className="h-4 w-4" />
    ) : type === 'post' ? (
      <Hash className="h-4 w-4" />
    ) : (
      <ImageIcon className="h-4 w-4" />
    )

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const ratio = img.naturalWidth / img.naturalHeight
    setImageRatio(ratio)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    console.error('Error cargando imagen/GIF:', displayImage)
  }

  // Determinar clases CSS según el ratio para controlar el tamaño
  const getImageClasses = () => {
    if (!imageRatio) return 'w-full h-auto'

    if (imageRatio < 0.8) {
      // Vertical (4:5 o más vertical) - limitar altura
      return 'w-full h-auto max-h-80 object-cover'
    } else if (imageRatio > 1.5) {
      // Horizontal (3:2 o más horizontal) - limitar altura
      return 'w-full h-auto max-h-48 object-cover'
    }
    // Cuadrada o ligeramente rectangular
    return 'w-full h-auto'
  }

  // Usar image_portada si existe, sino la imagen original
  const displayImage = image_portada || image

  // Detectar si es un GIF
  const isGif =
    displayImage.toLowerCase().includes('.gif') ||
    displayImage.includes('tenor.com') ||
    displayImage.includes('media.tenor.com') ||
    displayImage.includes('giphy.com') ||
    displayImage.includes('media.giphy.com')

  // Contenido de la imagen
  const imageContent = (
    <div
      className={`relative overflow-hidden rounded-lg ${overlay && overlayText ? 'h-full' : ''}`}
    >
      {imageError ? (
        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <ImageIcon className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">Error cargando imagen</p>
          </div>
        </div>
      ) : (
        <>
          {isGif ? (
            <img
              src={displayImage}
              alt={title || overlayText || ''}
              className={overlay && overlayText ? 'h-full w-full object-cover' : getImageClasses()}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: 'block' }}
            />
          ) : (
            <Image
              src={displayImage}
              alt={title || overlayText || ''}
              className={overlay && overlayText ? 'h-full w-full object-cover' : getImageClasses()}
              width={600}
              height={400}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {/* Badge siempre visible cuando hay tags */}
          {tags && tags.length > 0 && (
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                <Camera className="h-3 w-3" />
                {tags[0]}
              </span>
            </div>
          )}

          {/* Overlay y texto cuando hay overlayText y overlay está habilitado */}
          {overlay && overlayText && (
            <>
              {/* Overlay oscuro degradado */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Texto del overlay centrado en la parte inferior */}
              <div className="absolute right-0 bottom-0 left-0 z-10 p-6">
                <p className="text-center text-sm leading-relaxed font-medium text-white md:text-base">
                  {overlayText}
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )

  // Si hay overlayText y overlay está habilitado, mostrar solo la imagen con overlay (standalone)
  if (overlay && overlayText) {
    if (href) {
      return (
        <div className="group mb-4 block h-full w-full break-inside-avoid transition-transform duration-200 hover:scale-105">
          <Link href={href} className="block h-full">
            {imageContent}
          </Link>
        </div>
      )
    }

    return <div className="group mb-4 block h-full w-full break-inside-avoid">{imageContent}</div>
  }

  // Si no hay título, mostrar solo la imagen (con o sin link)
  if (!title) {
    if (href) {
      return (
        <div className="group mb-4 block w-full break-inside-avoid transition-transform duration-200 hover:scale-105">
          <Link href={href} className="block">
            {imageContent}
          </Link>
        </div>
      )
    }

    return <div className="group mb-4 block w-full break-inside-avoid">{imageContent}</div>
  }

  // Si hay título, mostrar con borde y metadatos
  const contentWithBorder = (
    <div className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* Badge de categoría superpuesto */}
      {category && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
          >
            <IconComponent className="h-3 w-3" />
            {config.label}
          </span>
        </div>
      )}

      <div className="relative">{imageContent}</div>

      <div className="space-y-2 p-3">
        <h3 className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
          {icon}
          {title}
        </h3>

        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}

        {/* Contexto - por qué está en el feed */}
        {context && (
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <p className="flex items-start gap-1 text-xs text-gray-500 italic dark:text-gray-500">
              <span className="text-blue-500">💬</span>
              {context}
            </p>
          </div>
        )}

        {/* Footer con tipo de contenido */}
        <div className="pt-1">
          <p className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-600">
            {type === 'meme' && 'Contenido visual'}
            {type === 'descarga' && 'Descarga'}
            {type === 'merch' && 'Producto editorial'}
            {type === 'post' && 'Post del equipo'}
          </p>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {contentWithBorder}
      </Link>
    )
  }

  return contentWithBorder
}
