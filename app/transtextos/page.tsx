import { getAllRelatosForChronologicalBySite, getSiteBySlug } from '../../lib/sanity'
import ChronologicalView from '@/components/ChronologicalView'
import SectionContainer from '@/components/SectionContainer'
import SlowConnectionBanner from '@/components/SlowConnectionBanner'
import DescripcionToggle from '@/components/DescripcionToggle'

// Interfaz para los datos del relato
interface RelatoData {
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

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TranstextosPage({ searchParams }: PageProps) {
  // Obtener el parámetro de página
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  
  // Obtener información del sitio Transtextos
  const siteInfo = await getSiteBySlug('transtextos')
  
  // Obtener TODOS los relatos de Transtextos desde Sanity
  const allRelatos = await getAllRelatosForChronologicalBySite('transtextos')
  
  return (
    <>
      <SlowConnectionBanner />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12">
            {siteInfo?.title || 'Transtextos'}
          </h1>
          <DescripcionToggle text={siteInfo?.description || 'Relatos y narrativas de Transtextos'} />
        </div>
        
        {/* Vista cronológica - sin ViewToggle */}
        <div className="container">
          <ChronologicalView 
            items={allRelatos}
            itemsPerPage={10}
            currentPage={currentPage}
          />
        </div>
      </SectionContainer>
    </>
  )
} 