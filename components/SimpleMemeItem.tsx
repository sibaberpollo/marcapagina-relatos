'use client'

import Image from './Image'
import Link from './Link'
import { ImageIcon, Download, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface SimpleMemeItemProps {
  title?: string
  description?: string
  image: string
  image_portada?: string
  href?: string
  type?: 'meme' | 'descarga' | 'merch'
  tags?: string[]
}

export default function SimpleMemeItem({ title, description, image, image_portada, href, type = 'meme', tags }: SimpleMemeItemProps) {
  const [imageRatio, setImageRatio] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)

  const icon = type === 'meme' ? (
    <ImageIcon className="w-4 h-4" />
  ) : type === 'descarga' ? (
    <Download className="w-4 h-4" />
  ) : type === 'merch' ? (
    <ShoppingCart className="w-4 h-4" />
  ) : (
    <ImageIcon className="w-4 h-4" />
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
    if (!imageRatio) return "w-full h-auto"
    
    if (imageRatio < 0.8) {
      // Vertical (4:5 o más vertical) - limitar altura
      return "w-full h-auto max-h-80 object-cover"
    } else if (imageRatio > 1.5) {
      // Horizontal (3:2 o más horizontal) - limitar altura  
      return "w-full h-auto max-h-48 object-cover"
    }
    // Cuadrada o ligeramente rectangular
    return "w-full h-auto"
  }

  // Usar image_portada si existe, sino la imagen original
  const displayImage = image_portada || image

  // Detectar si es un GIF
  const isGif = displayImage.toLowerCase().includes('.gif') || 
                displayImage.includes('tenor.com') || 
                displayImage.includes('media.tenor.com') ||
                displayImage.includes('giphy.com') ||
                displayImage.includes('media.giphy.com')

  // Contenido de la imagen
  const imageContent = (
    <div className="overflow-hidden rounded-lg">
      {imageError ? (
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Error cargando imagen</p>
          </div>
        </div>
      ) : isGif ? (
        <img
          src={displayImage}
          alt={title || ''}
          className={getImageClasses()}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: 'block' }}
        />
      ) : (
        <Image
          src={displayImage}
          alt={title || ''}
          className={getImageClasses()}
          width={600}
          height={400}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  )

  // Si no hay título, mostrar solo la imagen (con o sin link)
  if (!title) {
    if (href) {
      return (
        <div className="group block w-full break-inside-avoid mb-4 hover:scale-105 transition-transform duration-200">
          <Link href={href} className="block">
            {imageContent}
          </Link>
        </div>
      )
    }
    
    return (
      <div className="group block w-full break-inside-avoid mb-4">
        {imageContent}
      </div>
    )
  }

  // Si hay título, mostrar con borde y metadatos
  const contentWithBorder = (
    <div className="group block w-full break-inside-avoid mb-4 border-2 border-black rounded-lg p-3 hover:scale-105 transition-transform duration-200">
      {imageContent}
      
      <div className="mt-3 space-y-1">
        <h3 className="flex items-center gap-1 font-semibold text-sm">
          {icon}
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
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