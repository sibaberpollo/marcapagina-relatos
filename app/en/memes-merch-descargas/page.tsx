import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import MemeGallery from '@/components/MemeGallery'
import { genPageMetadata } from '../../seo'
import { memeItems } from './data'

export const metadata = genPageMetadata({
  title: 'Memes, Objects & Curiosities Hall',
  description:
    'An unexpected corner of MarcaPágina where literary humor, collectible objects, and downloadable resources intersect. You\'ll find original memes, shareable designs, and merch pieces featuring phrases from our stories. Everything you didn\'t know you needed… and now can\'t stop looking at.',
})

export default function MemesPageEN() {
  return (
    <SectionContainer>
      <div className="py-8">
        <PageTitle>Memes, Objects & Curiosities Hall</PageTitle>
        <p className="mt-2 text-lg text-muted-foreground">
          An unexpected corner of MarcaPágina where literary humor, collectible objects,
          and downloadable resources intersect. You'll find original memes, shareable designs,
          and merch pieces featuring phrases from our stories. Everything you didn't know you
          needed… and now can't stop looking at.
        </p>
        <p className="mt-2 text-lg text-muted-foreground">
          Perfect for exploring, downloading, or gifting.
        </p>
        <div className="mt-8">
          <MemeGallery items={memeItems} />
        </div>
      </div>
    </SectionContainer>
  )
}
