import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import MemeGallery from '@/components/MemeGallery'
import { genPageMetadata } from '../seo'
import { memeItems } from './data'

export const metadata = genPageMetadata({
  title: 'Sala de Memes, objetos y curiosidades',
  description:
    'Un rincón inesperado de MarcaPágina donde se cruzan el humor, los objetos inútiles y las imágenes descargables. Desde memes literarios hasta tazas con frases delirantes, ideal para compartir y perder el tiempo con estilo.',
})

export default function MemesPage() {
  return (
    <SectionContainer>
      <div className="py-8">
        <PageTitle>Sala de Memes, objetos y curiosidades</PageTitle>
        <p className="mt-2 text-lg text-muted-foreground">
          Un rincón inesperado de MarcaPágina donde se cruzan el humor, los objetos
          inútiles y las imágenes descargables. Desde memes literarios hasta tazas con
          frases delirantes, esta galería reúne artefactos digitales y hallazgos
          visuales inspirados en el universo narrativo de la plataforma.
        </p>
        <p className="mt-2 text-lg text-muted-foreground">
          Ideal para compartir, explorar o simplemente perder el tiempo con estilo.
        </p>
        <div className="mt-8">
          <MemeGallery items={memeItems} />
        </div>
      </div>
    </SectionContainer>
  )
}
