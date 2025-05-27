import { getAllRelatosForChronological } from '../../lib/sanity'
import ChronologicalLayout from '@/layouts/ChronologicalLayout'
import siteMetadata from '@/data/siteMetadata'
import SectionContainer from '@/components/SectionContainer'
import ViewToggle from '@/components/ViewToggle'
import SlowConnectionBanner from '@/components/SlowConnectionBanner'

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

export default async function CronologicoPage() {
  // Obtener TODOS los relatos desde Sanity
  const allRelatos = await getAllRelatosForChronological()
  
  return (
    <>
      <SlowConnectionBanner />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12">
            Relatos
          </h1>
          <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
            {(() => {
              const desc = siteMetadata.descriptionRich;
              const match = desc.match(/(.*?)(\(2009 ~ 2014 → 2025 ➔ ∞\))/);
              if (match) {
                const HighlightStroke = require('@/components/HighlightStroke').default;
                return <>
                  {match[1]}
                  <HighlightStroke>
                    <a
                      href="/acerca-de/"
                      className="hover:text-gray-800 dark:text-gray-900"
                    >
                      {match[2]}
                    </a>
                  </HighlightStroke>
                </>;
              }
              return desc;
            })()}
          </p>
        </div>
        
        {/* Botones de cambio de vista */}
        <ViewToggle />
        
        {/* Vista cronológica */}
        <div className="container">
          <ChronologicalLayout 
            items={allRelatos}
            itemsPerPage={10}
          />
        </div>
      </SectionContainer>
    </>
  )
} 