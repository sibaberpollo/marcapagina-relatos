import { getSiteBySlug } from '../../../lib/sanity'
import SectionContainer from '@/components/SectionContainer'
import SlowConnectionBanner from '@/components/SlowConnectionBanner'
import Link from '@/components/Link'
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
    ? 'Desde 2023, Transtextos funciona como archivo literario del proyecto fundado por Javier Miranda-Luque (1959–2023). Relatos desde Buenos Aires, Barcelona y Caracas.'
    : siteInfo?.description || 'Relatos y narrativas de Transtextos'

  const ogImage =
    'https://res.cloudinary.com/dx98vnos1/image/upload/v1748548890/share_hongo_sjugcw.jpg'

  return genPageMetadata({
    title,
    description,
    openGraph: { images: [ogImage] },
    twitter: { images: [ogImage] },
  })
}

export default async function TranstextosAcercaDePage() {
  const siteInfo = await getSiteBySlug('transtextos')

  return (
    <>
      <SlowConnectionBanner />
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 dark:text-gray-50">
            Acerca de {siteInfo?.title || 'Transtextos'}
          </h1>
        </div>

        <div className="prose dark:prose-invert max-w-none [&_a]:!text-gray-900 [&_a]:!no-underline hover:[&_a]:!underline dark:[&_a]:![color:#faff00] dark:hover:[&_a]:![color:#faff00]">
          <div className="space-y-6 text-lg leading-7 text-gray-700 dark:text-gray-300">
            <div>
              <p>
                Transtextos es un archivo literario de relatos, cuentos breves y textos
                contemporáneos iniciado por el escritor y periodista{' '}
                <Link
                  href="https://es.wikipedia.org/wiki/Javier_Miranda_Luque"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Javier Miranda-Luque (1959–2023)
                </Link>
                . Ahora funcionará como subsitio de la aplicación{' '}
                <Link href="https://www.marcapagina.page">MarcaPágina</Link>.
              </p>

              <p>
                Editado entre Buenos Aires, Barcelona y Caracas, el archivo conserva la apuesta de
                Javier por una literatura experimental, plural y disponible en línea de forma libre,
                incluyendo relatos inéditos de él y de colaboradores invitados.
              </p>

              <p>
                Su propuesta nació de la intuición de que el lenguaje escrito podía volver a ser un
                laboratorio de intensidad, si se aprovechaban las posibilidades de los nuevos medios
                y se liberaba a los textos del corsé editorial tradicional.
              </p>

              <p>
                Si deseas contribuir, puedes revisar nuestra{' '}
                <Link href="https://www.marcapagina.page/publica">convocatoria abierta</Link>.
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
