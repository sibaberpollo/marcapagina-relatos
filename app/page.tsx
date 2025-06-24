import {
  getAllRelatosForChronological,
  getAllRelatosForChronologicalBySite,
  getSiteBySlug,
} from "../lib/sanity";
import FeaturedCard from "@/components/FeaturedCard";
import FeaturedSlider from "@/components/FeaturedSlider";
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
  relatos: CardProps[];
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
import { getRelatoBySlug } from '../lib/sanity'

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

    // Obtener datos de Sanity para cada relato y combinarlos
    const enrichedRelatos: CardProps[] = []

    for (const item of homeData.relatos) {
      try {
        if (item.type === 'relato') {
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
            
            enrichedRelatos.push(enrichedItem)
          }
        }
      } catch (error) {
        console.error(`Error obteniendo datos para ${item.slug}:`, error)
        // Continuar con el siguiente elemento sin fallar
      }
    }

    return {
      meta: homeData.meta,
      content: homeData.content,
      relatos: enrichedRelatos
    }

  } catch (error) {
    console.error('Error obteniendo contenido del home:', error)
    return null
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  // Leer idioma desde URL, fallback a 'es'
  const resolvedSearchParams = await searchParams;
  const language = (resolvedSearchParams.lang as string) || 'es';
  
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

  const allProjects = homeContent.relatos;

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

        {/* Primera fila: 3 relatos sin slider */}
        <div className="container pb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {allProjects.slice(0, 3).map((project, index) => (
              <div key={index} className="flex">
                <FeaturedCard
                  title={project.title}
                  description={project.description}
                  imgSrc={project.imgSrc}
                  href={project.href}
                  authorImgSrc={project.authorImgSrc}
                  authorName={project.authorName}
                  authorHref={project.authorHref}
                  bgColor={project.bgColor}
                  tags={project.tags}
                  publishedAt={project.publishedAt}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Banner de publicación a ancho completo */}
      <div className="w-full bg-primary-500 dark:bg-primary-400">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 flex justify-center">
          <PublishBanner />
        </div>
      </div>

      <SectionContainer>
        {/* Grid en desktop, Slider en móvil y tablet */}
        <div className="container pt-12">
          {/* Slider para móvil y tablet */}
          <div className="lg:hidden">
            <FeaturedSlider projects={allProjects.slice(3, 6)} />
          </div>

          {/* Grid para desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {allProjects.slice(3, 6).map((project, index) => (
              <div key={index} className="flex">
                <FeaturedCard
                  title={project.title}
                  description={project.description}
                  imgSrc={project.imgSrc}
                  href={project.href}
                  authorImgSrc={project.authorImgSrc}
                  authorName={project.authorName}
                  authorHref={project.authorHref}
                  bgColor={project.bgColor}
                  tags={project.tags}
                  publishedAt={project.publishedAt}
                />
              </div>
            ))}
          </div>
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

    </>
  );
}
