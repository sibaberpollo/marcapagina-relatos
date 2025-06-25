import {
  getAllRelatosForChronological,
  getAllRelatosForChronologicalBySite,
  getSiteBySlug,
} from "../lib/sanity";
import FeaturedCard from "@/components/cards/FeaturedCard";
import SectionContainer from "@/components/SectionContainer";
import ViewToggle from "@/components/ViewToggle";
import ClientRedirect from "@/components/ClientRedirect";
import PublishBanner from "@/components/PublishBanner";
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
}

interface HomeContentItem {
  slug?: string;
  type: 'relato' | 'microcuento' | 'meme' | 'quote';
  cardType?: 'featured' | 'story' | 'overlay' | 'quote'; // Agregar quote como opción
  // Para relatos/microcuentos - campos opcionales que sobreescriben Sanity
  title?: string;
  description?: string;
  imgSrc?: string;
  authorName?: string;
  authorImgSrc?: string;
  bgColor?: string;
  tags?: string[];
  publishedAt?: string;
  // Para memes - datos directos
  image?: string;
  image_portada?: string;
  href?: string;
  overlayText?: string; // Agregar campo para texto del overlay
  // Para quotes - datos específicos
  quote?: string;
  author?: string;
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

import SimpleMemeItem from '@/components/SimpleMemeItem'
import MasonryFeaturedCard from '@/components/cards/MasonryFeaturedCard'
import FeaturedStoryCard from '@/components/cards/FeaturedStoryCard'
import QuoteCard from '@/components/cards/QuoteCard'
import HoroscopoLiterario from '@/components/HoroscopoLiterario'

// Función para obtener el horóscopo literario
async function getHoroscopoLiterario() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'horoscopo-demo.json')
    if (!fs.existsSync(filePath)) return null
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error cargando horóscopo literario:', error)
    return null
  }
}

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
              }
              
              return enrichedItem
            }
            return null // Si no hay datos de Sanity, retornar null
          } else if (item.type === 'meme' || item.type === 'quote') {
            // Para memes y quotes, usar los datos directamente del JSON
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
function RenderCard({ item, index }: { item: CardProps | HomeContentItem, index: number }) {
  const isMeme = 'image' in item && 'type' in item && item.type === 'meme';
  const isQuote = 'quote' in item && 'type' in item && item.type === 'quote';
  
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
        href={quoteItem.href}
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
  const horoscopoData = await getHoroscopoLiterario();
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
                  <RenderCard item={item} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Grid en tablet/desktop (mantiene orden visual) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {masonryItems.map((item, index) => (
              <div key={`item-${index}`} className="h-full">
                <RenderCard item={item} index={index} />
              </div>
            ))}
          </div>
          
          {/* Horóscopo Literario - Después de los cards */}
          {horoscopoData && (
            <div className="mt-12">
              <HoroscopoLiterario
                fecha={horoscopoData.fecha}
                signoDestacado={horoscopoData.signoDestacado}
                autorDestacado={horoscopoData.autorDestacado}
                efemerides={horoscopoData.efemerides}
                carta={horoscopoData.carta}
                signos={horoscopoData.signos}
              />
            </div>
          )}
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 flex items-center gap-2">
            {siteInfo?.title || 'Transtextos'}
            <Rss className="w-7 h-7" style={{ color: '#f26522' }} />
          </h1>
        </div>
        <div className="container">
          <ChronologicalView items={latestTranstextos} itemsPerPage={10} currentPage={currentPage} />
          <div className="mt-8 flex justify-center">
            <Link href="/transtextos" className="inline-block px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors">
              Ver todos
            </Link>
          </div>
        </div>
      </SectionContainer>

      {/* Banner de publicación en el footer */}
      <div className="w-full bg-primary-500 dark:bg-primary-400">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 flex justify-center">
          <PublishBanner />
        </div>
      </div>

    </>
  );
}
