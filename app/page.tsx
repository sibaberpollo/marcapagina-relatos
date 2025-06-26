import {
  getAllRelatosForChronological,
  getAllRelatosForChronologicalBySite,
  getSiteBySlug,
} from "../lib/sanity";
import FeaturedCard from "@/components/cards/FeaturedCard";
import SectionContainer from "@/components/SectionContainer";
import ViewToggle from "@/components/ViewToggle";
import ClientRedirect from "@/components/ClientRedirect";
import ExpandableText from '@/components/ExpandableText'
import ChronologicalView from '@/components/ChronologicalView'
import Link from 'next/link'
import { Rss } from 'lucide-react'

// Interfaces para la nueva API
interface CardProps {
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
  cardType?: 'featured' | 'story'; // Nuevo campo para tipo de card
  transtextos?: boolean;
}

interface HomeContentItem {
  slug?: string;
  type: 'relato' | 'microcuento' | 'meme' | 'quote' | 'playlist' | 'series';
  cardType?: 'featured' | 'story' | 'overlay' | 'quote' | 'playlist' | 'series'; // Agregar quote, playlist y series como opciones
  // Para relatos/microcuentos - campos opcionales que sobreescriben Sanity
  title?: string;
  description?: string;
  imgSrc?: string;
  authorName?: string;
  authorImgSrc?: string;
  bgColor?: string;
  tags?: string[];
  publishedAt?: string;
  transtextos?: boolean;
  // Para memes - datos directos
  image?: string;
  image_portada?: string;
  href?: string;
  overlayText?: string; // Agregar campo para texto del overlay
  // Para quotes - datos específicos
  quote?: string;
  author?: string;
  textColor?: string;
  authorColor?: string;
  // Para playlist - datos específicos
  currentTrack?: {
    name: string;
    artist: string;
    albumCover?: string;
  };
  previousTracks?: Array<{
    name: string;
    artist: string;
    albumCover?: string;
  }>;
  // Para series - datos específicos
  seriesName?: string;
  seriesCover?: string;
  latestChapter?: {
    title: string;
    slug: string;
    preview: string;
    order: number;
  };
  previousChapters?: Array<{
    title: string;
    slug: string;
    order: number;
  }>;
}

interface HomeContentResponse {
  meta: {
    language: string;
    version: string;
    lastUpdated: string;
  };
  content: {
    title: string;
    description: string;
  };
  items: (CardProps | HomeContentItem)[];
}

// Función para procesar markdown básico a HTML
function processMarkdown(text: string): string {
  return text
    // Procesar negritas **texto** -> <strong>texto</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Procesar enlaces [texto](url) -> <a href="url" class="link-styles">texto</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="!text-gray-900 hover:!text-gray-600 dark:!text-gray-50 dark:hover:!text-gray-300">$1</a>')
    // Procesar saltos de línea dobles
    .replace(/\n\n/g, '<br /><br />');
}



// Importar las dependencias necesarias para leer archivos
import fs from 'fs'
import path from 'path'
import { headers } from 'next/headers'
import { getRelatoBySlug } from '../lib/sanity'
import { getCurrentTrack, getLatestTracks } from '../lib/playlist'

import SimpleMemeItem from '@/components/SimpleMemeItem'
import MasonryFeaturedCard from '@/components/cards/MasonryFeaturedCard'
import FeaturedStoryCard from '@/components/cards/FeaturedStoryCard'
import QuoteCard from '@/components/cards/QuoteCard'
import PlaylistCard from '@/components/cards/PlaylistCard'
import SeriesCard from '@/components/cards/SeriesCard'



// Función para obtener contenido del home directamente
async function getHomeContent(language: string = 'es'): Promise<HomeContentResponse | null> {
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

    // Procesar todos los items en paralelo manteniendo el orden original
    const processedItems = await Promise.all(
      homeData.items.map(async (item: any) => {
        try {
          if (item.type === 'relato' || item.type === 'microcuento') {
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
                cardType: item.cardType || 'featured', // Default a 'featured' para card original
                transtextos: item.transtextos || false,
              }
              
              return enrichedItem
            }
            return null // Si no hay datos de Sanity, retornar null
          } else if (item.type === 'playlist' && item.usePlaylistData) {
            // Para playlist con usePlaylistData, cargar datos del JSON del playlist
            const currentTrack = await getCurrentTrack()
            const latestTracks = await getLatestTracks(3)
            const previousTracks = latestTracks.slice(1) // Las 2 siguientes después de la actual
            
            return {
              ...item,
              currentTrack: currentTrack ? {
                name: currentTrack.name,
                artist: currentTrack.artist,
                albumCover: currentTrack.albumCover
              } : null,
              previousTracks: previousTracks.map(track => ({
                name: track.name,
                artist: track.artist,
                albumCover: track.albumCover
              }))
            } as HomeContentItem
          } else if (item.type === 'meme' || item.type === 'quote' || item.type === 'playlist' || item.type === 'series') {
            // Para memes, quotes, playlists y series, usar los datos directamente del JSON
            return item as HomeContentItem
          }
          return null
        } catch (error) {
          console.error(`Error obteniendo datos para ${item.slug || item.type}:`, error)
          return null
        }
      })
    )

    // Filtrar items nulos
    const validItems = processedItems.filter(item => item !== null) as (CardProps | HomeContentItem)[]

    return {
      meta: homeData.meta,
      content: homeData.content,
      items: validItems
    }

  } catch (error) {
    console.error('Error obteniendo contenido del home:', error)
    return null
  }
}

// Componente para renderizar el card apropiado según el tipo
function RenderCard({ item, index, language }: { item: CardProps | HomeContentItem, index: number, language: string }) {
  const isMeme = 'image' in item && 'type' in item && item.type === 'meme';
  const isQuote = 'quote' in item && 'type' in item && item.type === 'quote';
  const isPlaylist = 'currentTrack' in item && 'type' in item && item.type === 'playlist';
  const isSeries = 'seriesName' in item && 'type' in item && item.type === 'series';
  
  if (isMeme) {
    const memeItem = item as HomeContentItem;
    return (
      <SimpleMemeItem
        title={memeItem.title}
        description={memeItem.description}
        image={memeItem.image!}
        image_portada={memeItem.image_portada}
        href={memeItem.href}
        type={memeItem.type as 'meme'}
        tags={memeItem.tags}
        context="Contenido visual relacionado con literatura y cultura"
        category="humor"
        overlayText={memeItem.overlayText}
      />
    );
  }

  if (isQuote) {
    const quoteItem = item as HomeContentItem;
    return (
      <QuoteCard
        quote={quoteItem.quote!}
        author={quoteItem.author}
        bgColor={quoteItem.bgColor}
        textColor={quoteItem.textColor}
        authorColor={quoteItem.authorColor}
        href={quoteItem.href}
        language={language}
      />
    );
  }

  if (isPlaylist) {
    const playlistItem = item as HomeContentItem;
    return (
      <PlaylistCard
        currentTrack={playlistItem.currentTrack!}
        previousTracks={playlistItem.previousTracks || []}
        language={language}
        href={playlistItem.href}
      />
    );
  }

  if (isSeries) {
    const seriesItem = item as HomeContentItem;
    return (
      <SeriesCard
        seriesName={seriesItem.seriesName!}
        seriesCover={seriesItem.seriesCover}
        latestChapter={seriesItem.latestChapter!}
        previousChapters={seriesItem.previousChapters || []}
        language={language}
        href={seriesItem.href}
        backgroundColor={seriesItem.bgColor || '#ee686b'}
        textColor="#ffffff"
      />
    );
  }

  // Para relatos, usar el tipo de card especificado
  const cardItem = item as CardProps;
  const cardType = cardItem.cardType || 'featured';

  if (cardType === 'story') {
    return (
      <FeaturedStoryCard
        slug={cardItem.href.split('/').pop()!}
        date={cardItem.publishedAt}
        title={cardItem.title}
        summary={cardItem.description}
        tags={cardItem.tags}
        author={{
          name: cardItem.authorName
        }}
        image={cardItem.imgSrc}
        bgColor={cardItem.bgColor}
      />
    );
  }

  // Default: usar FeaturedCard (card original)
  return (
    <MasonryFeaturedCard
      title={cardItem.title}
      description={cardItem.description}
      imgSrc={cardItem.imgSrc}
      href={cardItem.href}
      authorImgSrc={cardItem.authorImgSrc}
      authorName={cardItem.authorName}
      authorHref={cardItem.authorHref}
      bgColor={cardItem.bgColor}
      tags={cardItem.tags}
      publishedAt={cardItem.publishedAt}
      transtextos={cardItem.transtextos}
    />
  );
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  // Leer idioma desde headers del middleware, fallback a searchParams y luego a 'es'
  const headersList = await headers()
  const langFromHeader = headersList.get('x-locale')
  const resolvedSearchParams = await searchParams;
  const language = langFromHeader || (resolvedSearchParams.lang as string) || 'es';
  
  // Obtener datos desde la nueva API
  const homeContent = await getHomeContent(language);
  const allRelatos = await getAllRelatosForChronological();
  const totalRelatos = allRelatos.length;
  const siteInfo = await getSiteBySlug('transtextos');
  const allRelatosTranstextos = await getAllRelatosForChronologicalBySite('transtextos');
  const latestTranstextos = allRelatosTranstextos.slice(0, 5);
  const currentPage = 1;

  // Si no pudimos obtener el contenido del home, mostrar un fallback
  if (!homeContent) {
    return (
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12">
            Error cargando contenido
          </h1>
          <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
            No se pudo cargar el contenido del home. Por favor, intenta más tarde.
          </p>
        </div>
      </SectionContainer>
    );
  }

  // Los items ya vienen en el orden correcto desde el JSON
  const masonryItems = homeContent.items;

  return (
    <>
      <ClientRedirect />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1
            className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 
                      sm:text-3xl sm:leading-9 md:text-5xl md:leading-12"
          >
            {homeContent.content.title}
          </h1>
          <ExpandableText previewLines={2} className="prose dark:prose-invert max-w-none mb-4">
            <div 
              className="prose dark:prose-invert max-w-none mb-4 text-lg leading-7 text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ 
                __html: processMarkdown(homeContent.content.description)
              }}
            />
          </ExpandableText>
        </div>

        {/* Botones de cambio de vista */}
        <ViewToggle total={totalRelatos} />

        {/* Feed principal con jerarquía visual clara */}
        <div className="container py-6">
          {/* Masonry solo en móvil (respeta orden) */}
          <div className="md:hidden">
            <div className="columns-1 gap-4 space-y-4">
              {masonryItems.map((item, index) => (
                <div key={`item-${index}`}>
                  <RenderCard item={item} index={index} language={language} />
                </div>
              ))}
            </div>
          </div>

          {/* Grid en tablet/desktop (mantiene orden visual) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {masonryItems.map((item, index) => (
              <div key={`item-${index}`} className="h-full">
                <RenderCard item={item} index={index} language={language} />
              </div>
            ))}
          </div>

        </div>
      </SectionContainer>

      <SectionContainer>
        {/* Título con líneas decorativas */}
        <div className="space-y-2 pt-12 pb-8 md:space-y-5">
          <div className="flex items-center justify-center gap-6">
            {/* Línea doble izquierda */}
            <div className="flex-1 flex items-center justify-end">
              <div className="w-full max-w-xs">
                <div className="border-t-2 border-gray-900 dark:border-gray-50 mb-1"></div>
                <div className="border-t border-gray-900 dark:border-gray-50"></div>
              </div>
            </div>
            
            {/* Título central */}
            <div className="text-center">
              <h1 className="text-2xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl sm:leading-9 md:text-6xl md:leading-12 whitespace-nowrap">
                {siteInfo?.title || 'Transtextos'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase mt-1">
                Feed Narrativa
              </p>
            </div>
            
            {/* Línea doble derecha con ícono RSS */}
            <div className="flex-1 flex items-center justify-start gap-4">
              <div className="w-full max-w-xs">
                <div className="border-t-2 border-gray-900 dark:border-gray-50 mb-1"></div>
                <div className="border-t border-gray-900 dark:border-gray-50"></div>
              </div>
              <Link href="/transtextos" className="flex-shrink-0 hover:scale-110 transition-transform">
                <Rss className="w-8 h-8" style={{ color: '#f26522' }} />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Contenido del feed con fondo blanco */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-12">
          <ChronologicalView items={latestTranstextos} itemsPerPage={10} currentPage={currentPage} />
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
            <Link href="/transtextos" className="inline-block px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-medium">
              Ver todos
            </Link>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
