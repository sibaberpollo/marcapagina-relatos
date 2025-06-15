import { getAllRelatosForChronologicalBySite, getSiteBySlug } from '../../lib/sanity'
import ChronologicalView from '@/components/ChronologicalView'
import SectionContainer from '@/components/SectionContainer'
import SlowConnectionBanner from '@/components/SlowConnectionBanner'
import DescripcionToggle from '@/components/DescripcionToggle'
import { Rss } from 'lucide-react'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'

export const revalidate = 60 // cachea SSR 60s, ajusta según tu necesidad

/** Genera la metadata para SEO y Open Graph */
export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteBySlug('transtextos')
  const isTranstextos = siteInfo?.slug?.current === 'transtextos'

  const title = isTranstextos
    ? 'Transtextos: relatos y narrativa contemporánea | marcapagina.page'
    : siteInfo?.title || 'Transtextos'

  const description = isTranstextos
    ? 'Editado desde Buenos Aires, Barcelona y Caracas. Fundado por Javier Miranda-Luque (1959–2023), Transtextos publica relatos propios y de autores invitados.'
    : siteInfo?.description || 'Relatos y narrativas de Transtextos'

  const ogImage =
    'https://res.cloudinary.com/dx98vnos1/image/upload/v1748548890/share_hongo_sjugcw.jpg'

  return genPageMetadata({
    title,
    description,
    openGraph: { images: [ogImage] },
    twitter:   { images: [ogImage] },
  })
}


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

export default async function TranstextosPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Extraemos 'page' manejando string | string[] | undefined
  const params = await searchParams;
  const rawPage = params.page;
  const pageString = Array.isArray(rawPage) ? rawPage[0] : typeof rawPage === 'string' ? rawPage : undefined;
  const currentPage = Number(pageString) || 1;

  const siteInfo = await getSiteBySlug('transtextos');
  const allRelatos = await getAllRelatosForChronologicalBySite('transtextos');
  return (
    <>
      <SlowConnectionBanner />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 flex items-center gap-2">
            {siteInfo?.title || 'Transtextos'}
            <Rss className="w-7 h-7" style={{ color: '#f26522' }} />
          </h1>
          <DescripcionToggle text={siteInfo?.description || 'Relatos y narrativas de Transtextos'} />
        </div>
        <div className="container">
          <ChronologicalView
            items={allRelatos}
            itemsPerPage={10}
            currentPage={currentPage}
            basePath="/transtextos"
          />
        </div>
      </SectionContainer>
    </>
  );
}