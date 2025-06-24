import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getRelatoBySlug, getMicrocuentoBySlug } from '@/lib/sanity'

// Interfaces locales para el contenido
interface HomeContentItem {
  slug?: string
  type: 'relato' | 'microcuento' | 'meme'
  // Para relatos/microcuentos - campos opcionales que sobreescriben Sanity
  title?: string
  description?: string
  imgSrc?: string
  authorName?: string
  authorImgSrc?: string
  bgColor?: string
  tags?: string[]
  publishedAt?: string
  // Para memes - datos directos
  image?: string
  image_portada?: string
  href?: string
}

interface HomeContentMeta {
  language: string
  version: string
  lastUpdated: string
}

interface HomeContentData {
  meta: HomeContentMeta
  content: {
    title: string
    description: string
  }
  items: HomeContentItem[]
}

interface CardProps {
  title: string
  description: string
  imgSrc: string
  href: string
  authorImgSrc: string
  authorName: string
  authorHref: string
  bgColor: string
  tags: string[]
  publishedAt: string
}

// Tipos locales para Sanity data
interface SanityRelato {
  title: string
  summary?: string
  image?: string
  bgColor?: string
  publishedAt?: string
  date: string
  tags?: string[]
  author: {
    name: string
    avatar: string
    slug: {
      current: string
    }
  }
}

interface SanityMicrocuento {
  title: string
  description: string
  summary: string
  image?: string
  bgColor: string
  publishedAt: string
  author: string
  tags?: string[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('lang') || 'es'
    
    // Leer el archivo JSON correspondiente al idioma
    const filePath = path.join(process.cwd(), 'data', `home-content${language === 'es' ? '' : `-${language}`}.json`)
    
    // Si no existe el archivo del idioma específico, usar el español como fallback
    const fallbackPath = path.join(process.cwd(), 'data', 'home-content.json')
    const finalPath = fs.existsSync(filePath) ? filePath : fallbackPath
    
    if (!fs.existsSync(finalPath)) {
      return NextResponse.json(
        { error: 'Archivo de contenido no encontrado' },
        { status: 404 }
      )
    }

    const fileContent = fs.readFileSync(finalPath, 'utf-8')
    const homeData: HomeContentData = JSON.parse(fileContent)

    // Procesar todos los items en paralelo manteniendo el orden original
    const processedItems = await Promise.all(
      homeData.items.map(async (item: HomeContentItem) => {
        try {
          if (item.type === 'relato' || item.type === 'microcuento') {
            if (!item.slug) return null
            
            const sanityData = await getRelatoBySlug(item.slug)
            
            if (sanityData) {
              const enrichedItem: CardProps = {
                title: item.title || sanityData.title,
                description: item.description || sanityData.summary || '',
                imgSrc: item.imgSrc || sanityData.image || '',
                href: `/${item.type}/${item.slug}`,
                authorImgSrc: item.authorImgSrc || sanityData.author?.avatar || '',
                authorName: item.authorName || sanityData.author?.name || '',
                authorHref: `/autor/${sanityData.author?.slug?.current}` || '',
                bgColor: item.bgColor || sanityData.bgColor || '#efa106',
                tags: item.tags || sanityData.tags || [],
                publishedAt: item.publishedAt || sanityData.publishedAt || sanityData.date || '',
              }
              
              return enrichedItem
            }
            return null
          } else if (item.type === 'meme') {
            // Para memes, usar los datos directamente del JSON
            return item
          }
          return null
        } catch (error) {
          console.error(`Error obteniendo datos para ${item.slug || item.type}:`, error)
          return null
        }
      })
    )

    // Filtrar items nulos
    const validItems = processedItems.filter(item => item !== null)

    return NextResponse.json({
      meta: homeData.meta,
      content: homeData.content,
      items: validItems
    })

  } catch (error) {
    console.error('Error en la API de contenido del home:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 