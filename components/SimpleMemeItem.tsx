'use client'

import Image from './Image'
import { ImageIcon, Download, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface SimpleMemeItemProps {
  title?: string
  description?: string
  image: string
  image_portada?: string
  type?: 'meme' | 'descarga' | 'merch'
  tags?: string[]
}

export default function SimpleMemeItem({ title, description, image, image_portada, type = 'meme', tags }: SimpleMemeItemProps) {
  const [imageRatio, setImageRatio] = useState<number | null>(null)

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

  return (
    <div className="group block w-full break-inside-avoid mb-4 border-2 border-black rounded-lg p-3 hover:scale-105 transition-transform duration-200">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={displayImage}
          alt={title || ''}
          className={getImageClasses()}
          width={600}
          height={400}
          onLoad={handleImageLoad}
        />
      </div>
      
      {title && (
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
      )}
    </div>
  )
} 