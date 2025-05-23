"use client";

import NextImage, { ImageProps } from 'next/image'

// Usar variables de entorno para la configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_URL_BASE = process.env.NEXT_PUBLIC_CLOUDINARY_URL_BASE;
const CLOUDINARY_VERSION = process.env.NEXT_PUBLIC_CLOUDINARY_VERSION;

const basePath = process.env.BASE_PATH || '';

const Image = ({ src, ...rest }: ImageProps) => {
  let finalSrc = src;
  
  // Si ya es una URL completa, usarla directamente
  if (typeof src === 'string' && !src.startsWith('http')) {
    // Verificar si es una ruta interna de imágenes estáticas
    if (src.startsWith('/static/images/') || src.includes('/static/images/')) {
      // Es una imagen local, usar ruta con basePath
      finalSrc = `${basePath}${src}`;
    } else if (CLOUDINARY_URL_BASE && CLOUDINARY_CLOUD_NAME) {
      // Es una imagen para Cloudinary
      // Eliminar el slash inicial si existe
      const cleanPath = src.startsWith('/') ? src.substring(1) : src;
      
      // Si no contiene slash, asumimos que es solo un nombre de archivo
      if (!cleanPath.includes('/')) {
        finalSrc = `${CLOUDINARY_URL_BASE}/${CLOUDINARY_VERSION || 'v1746013221'}/${cleanPath}`;
      } else {
        // Si hay estructura de carpetas
        finalSrc = `${CLOUDINARY_URL_BASE}/${cleanPath}`;
      }
    }
  }
  
  // Verificamos si la URL final es de Cloudinary para desactivar la optimización
  const isCloudinaryUrl = typeof finalSrc === 'string' && finalSrc.includes('cloudinary.com');
  
  return (
    <NextImage 
      {...rest} 
      src={finalSrc}
      unoptimized={isCloudinaryUrl}
    />
  )
}

export default Image
