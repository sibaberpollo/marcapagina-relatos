'use client'

import Image from './Image'
import Link from './Link'
import { ImageIcon, Download, ShoppingCart, Hash, Sparkles, Package } from 'lucide-react'
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
  category 
}: SimpleMemeItemProps) {
  const [imageRatio, setImageRatio] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)

  // Configuración de categorías con colores y etiquetas
  const categoryConfig = {
    humor: { 
      icon: Sparkles, 
      label: 'Humor Literario', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
    },
    resource: { 
      icon: Hash, 
      label: 'Recurso', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
    },
    product: { 
      icon: Package, 
      label: 'Producto', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
    },
    announcement: { 
      icon: ImageIcon, 
      label: 'Anuncio', 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
    }
  }

  const config = category ? categoryConfig[category] : categoryConfig.humor
  const IconComponent = config.icon

  const icon = type === 'meme' ? (
    <ImageIcon className="w-4 h-4" />
  ) : type === 'descarga' ? (
    <Download className="w-4 h-4" />
  ) : type === 'merch' ? (
    <ShoppingCart className="w-4 h-4" />
  ) : type === 'post' ? (
    <Hash className="w-4 h-4" />
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
    <div className="group block w-full break-inside-avoid mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      
      {/* Badge de categoría superpuesto */}
      {category && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <IconComponent className="w-3 h-3" />
            {config.label}
          </span>
        </div>
      )}
      
      <div className="relative">
        {imageContent}
      </div>
      
      <div className="p-3 space-y-2">
        <h3 className="flex items-center gap-1 font-semibold text-sm text-gray-900 dark:text-white">
          {icon}
          {title}
        </h3>
        
        {description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Contexto - por qué está en el feed */}
        {context && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500 italic flex items-start gap-1">
              <span className="text-blue-500">💬</span>
              {context}
            </p>
          </div>
        )}
        
        {/* Footer con tipo de contenido */}
        <div className="pt-1">
          <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium">
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