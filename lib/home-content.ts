import fs from 'fs'
import path from 'path'
import { getRelatosBySlugsBatch } from './sanity'

interface HomeContentItem {
  slug?: string;
  type: 'relato' | 'microcuento' | 'meme' | 'quote' | 'playlist' | 'series';
  cardType?: 'featured' | 'story' | 'overlay' | 'quote' | 'playlist' | 'series';
  // Campos opcionales que sobreescriben Sanity
  title?: string;
  description?: string;
  imgSrc?: string;
  authorName?: string;
  authorImgSrc?: string;
  bgColor?: string;
  tags?: string[];
  publishedAt?: string;
  transtextos?: boolean;
  // Para otros tipos
  image?: string;
  href?: string;
  overlayText?: string;
  quote?: string;
  author?: string;
  textColor?: string;
  authorColor?: string;
}

interface HomeContentData {
  meta: {
    language: string;
    version: string;
    lastUpdated: string;
  };
  content: {
    title: string;
    description: string;
  };
  items: HomeContentItem[];
}

export interface ProyectoFormateado {
  title: string;
  description: string;
  imgSrc: string;
  href: string;
  authorImgSrc: string;
  authorName: string;
  authorHref: string;
  bgColor: string;
  tags: string[];
  publishedAt: string;
}

// Cache para contenido del home (5 minutos)
const homeContentCache = new Map<string, { data: HomeContentData | null, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Función para leer el contenido del home-content.json
async function loadHomeContentData(language: string = 'es'): Promise<HomeContentData | null> {
  const cacheKey = `home-content-${language}`
  const cached = homeContentCache.get(cacheKey)
  
  // Si hay cache válido, retornarlo
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    // Leer el archivo JSON correspondiente al idioma
    const filePath = path.join(process.cwd(), 'data', `home-content${language === 'es' ? '' : `-${language}`}.json`)
    
    // Si no existe el archivo del idioma específico, usar el español como fallback
    const fallbackPath = path.join(process.cwd(), 'data', 'home-content.json')
    const finalPath = fs.existsSync(filePath) ? filePath : fallbackPath
    
    if (!fs.existsSync(finalPath)) {
      console.error('Archivo de contenido no encontrado:', finalPath)
      return null
    }

    const fileContent = fs.readFileSync(finalPath, 'utf-8')
    const homeData = JSON.parse(fileContent)

    // Guardar en cache
    homeContentCache.set(cacheKey, { data: homeData, timestamp: Date.now() })
    
    return homeData

  } catch (error) {
    console.error('Error leyendo home-content.json:', error)
    const errorResult = null
    // Guardar error en cache por menos tiempo (1 minuto)
    homeContentCache.set(cacheKey, { data: errorResult, timestamp: Date.now() - CACHE_DURATION + 60000 })
    return errorResult
  }
}

// Función específica para obtener solo relatos destacados del home-content.json
export async function getFeaturedRelatosFromJSON(language: string = 'es'): Promise<ProyectoFormateado[]> {
  try {
    const homeData = await loadHomeContentData(language)
    
    if (!homeData) {
      return []
    }

    // Filtrar solo relatos con cardType "featured"
    const featuredRelatos = homeData.items.filter(item => 
      item.type === 'relato' && 
      item.cardType === 'featured' && 
      item.slug
    )

    if (featuredRelatos.length === 0) {
      return []
    }

    // Obtener slugs para consulta batch
    const relatoSlugs = featuredRelatos.map(item => item.slug!)

    // Obtener datos de Sanity en una sola consulta
    const relatosMap = await getRelatosBySlugsBatch(relatoSlugs)

    // Procesar y enriquecer los datos
    const processedRelatos: ProyectoFormateado[] = []

    for (const item of featuredRelatos) {
      const sanityData = relatosMap[item.slug!]
      
      if (sanityData) {
        const enrichedRelato: ProyectoFormateado = {
          title: item.title || sanityData.title,
          description: item.description || sanityData.summary || '',
          imgSrc: item.imgSrc || sanityData.image || '',
          href: `/relato/${item.slug}`,
          authorImgSrc: item.authorImgSrc || sanityData.author?.avatar || '',
          authorName: item.authorName || sanityData.author?.name || '',
          authorHref: `/autor/${sanityData.author?.slug?.current}` || '',
          bgColor: item.bgColor || sanityData.bgColor || '#efa106',
          tags: item.tags || sanityData.tags || [],
          publishedAt: item.publishedAt || sanityData.publishedAt || sanityData.date || '',
        }
        
        processedRelatos.push(enrichedRelato)
      }
    }

    return processedRelatos

  } catch (error) {
    console.error('Error obteniendo relatos destacados del JSON:', error)
    return []
  }
} 