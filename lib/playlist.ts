import fs from 'fs'
import path from 'path'

export interface Track {
  id: string
  name: string
  artist: string
  albumCover?: string
  isNew: boolean
  isFeatured: boolean
  order: number
}

export interface PlaylistContent {
  title: string
  subtitle: string
  description: string
  sections: {
    why: {
      title: string
      content: string
    }
    featured: {
      title: string
    }
  }
  footer: string
}

export interface PlaylistData {
  meta: {
    version: string
    lastUpdated: string
  }
  content: {
    es: PlaylistContent
    en: PlaylistContent
  }
  tracks: Track[]
  embeds: {
    youtube: {
      url: string
      title: string
    }
    spotify: {
      url: string
      title: string
    }
  }
}

// Función para obtener todos los datos del playlist
export async function getPlaylistData(): Promise<PlaylistData | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'playlist-data.json')
    
    if (!fs.existsSync(filePath)) {
      console.error('Archivo playlist-data.json no encontrado')
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const playlistData = JSON.parse(fileContent)
    
    return playlistData
  } catch (error) {
    console.error('Error al obtener datos del playlist:', error)
    return null
  }
}

// Función para obtener el contenido del playlist por idioma
export async function getPlaylistContent(language: string = 'es'): Promise<{
  content: PlaylistContent
  tracks: Track[]
  embeds: any
} | null> {
  try {
    const playlistData = await getPlaylistData()
    
    if (!playlistData) return null
    
    const content = playlistData.content[language as 'es' | 'en'] || playlistData.content.es
    
    return {
      content,
      tracks: playlistData.tracks,
      embeds: playlistData.embeds
    }
  } catch (error) {
    console.error(`Error al obtener contenido del playlist para idioma "${language}":`, error)
    return null
  }
}

// Función para obtener las últimas N canciones (para usar en cards)
export async function getLatestTracks(count: number = 3): Promise<Track[]> {
  try {
    const playlistData = await getPlaylistData()
    
    if (!playlistData) return []
    
    // Ordenar por order y tomar las primeras N
    return playlistData.tracks
      .sort((a, b) => a.order - b.order)
      .slice(0, count)
  } catch (error) {
    console.error(`Error al obtener las últimas ${count} canciones:`, error)
    return []
  }
}

// Función para obtener la canción actual (primera en la lista)
export async function getCurrentTrack(): Promise<Track | null> {
  try {
    const tracks = await getLatestTracks(1)
    return tracks[0] || null
  } catch (error) {
    console.error('Error al obtener la canción actual:', error)
    return null
  }
}

// Función para procesar markdown básico a HTML
export function processMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline underline-offset-4 hover:text-primary">$1</a>')
    .replace(/\n\n/g, '<br /><br />')
} 