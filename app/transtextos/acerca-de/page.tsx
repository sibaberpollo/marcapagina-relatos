import { getSiteBySlug } from '../../../lib/sanity'
import SectionContainer from '@/components/SectionContainer'
import SlowConnectionBanner from '@/components/SlowConnectionBanner'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'

export const revalidate = 60 // opcional: cachea SSR 60s

/** Genera la metadata para SEO y Open Graph */
export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteBySlug('transtextos')
  const isTranstextos = siteInfo?.slug?.current === 'transtextos'

  const title = isTranstextos
    ? 'Transtextos: relatos y narrativa contemporánea | marcapagina.page'
    : `Acerca de ${siteInfo?.title || 'Transtextos'}`

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

export default async function TranstextosAcercaDePage() {
  // Obtener información del sitio Transtextos
  const siteInfo = await getSiteBySlug('transtextos')
  
  return (
    <>
      <SlowConnectionBanner />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12">
            Acerca de {siteInfo?.title || 'Transtextos'}
          </h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <div className="text-lg leading-7 text-gray-700 dark:text-gray-300 space-y-6">
            {siteInfo?.description ? (
              <p>{siteInfo.description}</p>
            ) : (
              <div>
                <p>
                  Transtextos es una plataforma dedicada a la narrativa contemporánea, 
                  donde convergen diferentes voces y estilos literarios.
                </p>
                
                <p>
                  Nuestro objetivo es crear un espacio de encuentro entre autores y lectores, 
                  promoviendo la diversidad narrativa y la experimentación literaria.
                </p>
                
                <p>
                  Cada relato publicado en Transtextos ha sido cuidadosamente seleccionado 
                  por su calidad literaria y su capacidad de conectar con los lectores 
                  a través de historias únicas y memorables.
                </p>
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50">
                Colaboración
              </h2>
              <p>
                Si estás interesado en contribuir con tus relatos o formar parte de la 
                comunidad de Transtextos, no dudes en contactarnos. Siempre estamos 
                buscando nuevas voces que enriquezcan nuestra plataforma.
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  )
} 