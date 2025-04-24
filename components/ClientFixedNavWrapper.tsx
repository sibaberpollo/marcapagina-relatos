'use client'

import dynamic from 'next/dynamic'
import { CoreContent } from 'pliny/utils/contentlayer'

// Importar el componente dinámicamente con ssr: false
const FixedNavMenu = dynamic(() => import('@/components/FixedNavMenu'), { ssr: false })

interface ClientFixedNavWrapperProps {
  title: string
  authorAvatar?: string
  authorName?: string
  slug: string
  relatedPosts: CoreContent<any>[]  // Usar 'any' para aceptar tanto Blog como Relato
  author: string
}

export default function ClientFixedNavWrapper({ 
  title, 
  authorAvatar, 
  authorName, 
  slug,
  relatedPosts,
  author
}: ClientFixedNavWrapperProps) {
  return (
    <FixedNavMenu 
      title={title} 
      authorAvatar={authorAvatar} 
      authorName={authorName}
      slug={slug}
      relatedPosts={relatedPosts}
      author={author}
    />
  )
} 