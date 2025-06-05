import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Playlist',
  description: 'Escucha la música de MarcaPágina en Spotify y YouTube.'
})

export default function PlaylistPage() {
  return (
    <SectionContainer>
      <article className="mx-auto max-w-3xl">
        <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
          <div className="pt-8 pb-8">
            <PageTitle>Playlist</PageTitle>
            <p className="mt-2 text-lg">
              Selección musical para nuestros reels y lecturas. Jazz y trip hop para acompañar cada relato.
            </p>
            <div className="mt-8 space-y-6">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/videoseries?list=PLKfzi-Ybx99YOcEfCuiwR5nEdAapExkel"
                  title="YouTube playlist"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="aspect-[16/10]">
                <iframe
                  className="w-full h-full rounded-md"
                  src="https://open.spotify.com/embed/playlist/1KhNqfcsSL4nHzf43T5KLI?utm_source=generator"
                  title="Spotify playlist"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
