import { getAllRelatosForChronological } from '../../lib/sanity'
import ChronologicalView from '@/components/ChronologicalView'
import siteMetadata from '@/data/siteMetadata'
import SectionContainer from '@/components/SectionContainer'
import ViewToggle from '@/components/ViewToggle'
import SlowConnectionBanner from '@/components/SlowConnectionBanner'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Relatos por fecha | MarcaPágina',
  description:
    'Explora más de 300 relatos y microcuentos organizados cronológicamente. Narrativa contemporánea de autores emergentes de América Latina.',
})



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

export default async function CronologicoPage({ searchParams }: PageProps) {
  // Obtener el parámetro de página
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  
  // Obtener TODOS los relatos desde Sanity
  const allRelatos = await getAllRelatosForChronological()
  
  return (
    <>
      <SlowConnectionBanner />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1
            className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 
                      sm:text-3xl sm:leading-9 md:text-5xl md:leading-12"
          >
            Todos los Relatos
          </h1>
          <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
  Una colección cronológica de <strong>relatos</strong> escritos por autores emergentes de América Latina. Narrativa contemporánea, organizada por fecha.
</p>
        </div>
        {/* Botones de cambio de vista */}
        <ViewToggle />
        
        {/* Vista cronológica */}
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