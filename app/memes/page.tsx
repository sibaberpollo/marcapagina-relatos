import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import MemeGallery from '@/components/MemeGallery'
import { genPageMetadata } from '../seo'
import { memeItems } from './data'

export const metadata = genPageMetadata({
  title: 'Memes y descargas divertidas',
  description:
    'Colección estilo portfolio con memes, materiales descargables y productos exclusivos.',
})

export default function MemesPage() {
  return (
    <SectionContainer>
      <div className="py-8">
        <PageTitle>Memes y más</PageTitle>
        <p className="mt-2 text-lg text-muted-foreground">
          Una galería de humor y artículos curiosos inspirados en MarcaPágina.
        </p>
        <div className="mt-8">
          <MemeGallery items={memeItems} />
        </div>
      </div>
    </SectionContainer>
  )
}
