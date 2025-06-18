import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import MemeGallery from '@/components/MemeGallery'
import { genPageMetadata } from '../seo'
import { memeItems } from './data'

export const metadata = genPageMetadata({
  title: 'Sala de Memes, objetos y curiosidades',
  description:
    'Un rincón inesperado de MarcaPágina donde se cruzan el humor literario, los objetos de colección y los recursos descargables. Encontrarás memes originales, diseños para compartir, y piezas de merch con frases sacadas de nuestros relatos. Todo lo que no sabías que necesitabas… y ahora no podés dejar de ver.',
})

export default function MemesPage() {
  return (
    <SectionContainer>
      <div className="py-8">
        <PageTitle>Sala de Memes, objetos y curiosidades</PageTitle>
        <p className="mt-2 text-lg text-muted-foreground">
          Un rincón inesperado de MarcaPágina donde se cruzan el humor literario, los
          objetos de colección y los recursos descargables. Encontrarás memes
          originales, diseños para compartir, y piezas de merch con frases sacadas de
          nuestros relatos. Todo lo que no sabías que necesitabas… y ahora no podés
          dejar de ver.
        </p>
        <p className="mt-2 text-lg text-muted-foreground">
          Ideal para explorar, descargar o regalar.
        </p>
        <div className="mt-8">
          <MemeGallery items={memeItems} />
        </div>
      </div>
    </SectionContainer>
  )
}
