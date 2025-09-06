import { memeData } from '@/data/memes'
import { MemeItem } from '@/types/meme'
import fs from 'fs'
import path from 'path'

// Función para cargar traducciones de memes
export async function getMemeTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'memes.json')

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(jsonData)
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error)
    // Fallback a español si no encuentra el archivo
    const fallbackPath = path.join(process.cwd(), 'public', 'locales', 'es', 'memes.json')
    const fallbackData = fs.readFileSync(fallbackPath, 'utf8')
    return JSON.parse(fallbackData)
  }
}

// Función para combinar datos de memes con traducciones
export async function getMemeItems(locale: string): Promise<MemeItem[]> {
  const translations = await getMemeTranslations(locale)

  return memeData.map((item) => ({
    id: item.id,
    title: translations[item.key]?.title || '',
    description: translations[item.key]?.description || '',
    image: item.image,
    tags: item.tags,
    type: item.type,
  }))
}

// Función para obtener metadata de la página
export async function getMemePageData(locale: string) {
  const translations = await getMemeTranslations(locale)

  return {
    title: translations.title || '',
    description: translations.description || '',
    subtitle: translations.subtitle || '',
    filters: translations.filters || {},
  }
}
