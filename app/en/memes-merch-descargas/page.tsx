import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import MemeGallery from '@/components/MemeGallery'
import { genPageMetadata } from '../../seo'
import { memeItems } from './data'

export const metadata = genPageMetadata({
  title: 'Meme Room, merch and curiosities',
  description:
    "An unexpected corner of MarcaPágina where literary humor, collectibles and downloadable resources meet. You'll find original memes, shareable designs and merch pieces with phrases from our stories. Everything you didn't know you needed... and now you can't stop looking at.",
})

export default function MemesPage() {
  return (
    <SectionContainer>
      <div className="py-8">
        <PageTitle>Meme Room, merch and curiosities</PageTitle>
        <p className="mt-2 text-lg text-muted-foreground">
          An unexpected corner of MarcaPágina where literary humor, collectibles and
          downloadable resources meet. You'll find original memes, shareable designs
          and merch pieces with phrases from our stories. Everything you didn't know
          you needed... and now you can't stop looking at.
        </p>
        <p className="mt-2 text-lg text-muted-foreground">
          Ideal for exploring, downloading or gifting.
        </p>
        <div className="mt-8">
          <MemeGallery items={memeItems} />
        </div>
      </div>
    </SectionContainer>
  )
}
