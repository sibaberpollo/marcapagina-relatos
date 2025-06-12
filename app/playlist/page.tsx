import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Música a pie de página – Playlist literaria de Marcapágina',
  description:
    'Jazz de los 50, trip hop de los 2000 y salsa que acompaña los relatos de Marcapágina. Disponible en Spotify y YouTube.',
  openGraph: {
    title: 'Música a pie de página – Playlist literaria de Marcapágina',
    description: 'Jazz de los 50, trip hop de los 2000 y salsa que acompaña los relatos de Marcapágina. Disponible en Spotify y YouTube.',
    type: 'video.music',
    videos: [
      {
        url: 'https://www.youtube.com/embed/videoseries?list=PLKfzi-Ybx99YOcEfCuiwR5nEdAapExkel',
        type: 'application/x-shockwave-flash',
        width: 560,
        height: 315,
      },
    ],
  },
})

export default function PlaylistPage() {
  return (
    <SectionContainer>
      <article className="mx-auto max-w-3xl">
        <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
          <div className="pt-8 pb-8">
            <PageTitle>Música a pie de página</PageTitle>
            <p className="mt-2 text-lg text-muted-foreground">
              Jazz de los años 50, trip hop de los 2000 y salsa de los grandes. Esta playlist acompaña nuestros reels, nuestras
              lecturas y también nuestras escrituras. Una banda sonora sin género, elegida sin reglas —salvo
              una: que combine con las historias que publicamos.
            </p>

            <div className="mt-8 space-y-6">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/videoseries?list=PLKfzi-Ybx99YOcEfCuiwR5nEdAapExkel"
                  title="YouTube playlist de Marcapágina"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  aria-label="Playlist de YouTube de Marcapágina"
                />
              </div>
              <div className="aspect-[16/10]">
                <iframe
                  className="w-full h-full rounded-md"
                  src="https://open.spotify.com/embed/playlist/1KhNqfcsSL4nHzf43T5KLI?utm_source=generator"
                  title="Spotify playlist de Marcapágina"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  aria-label="Playlist de Spotify de Marcapágina"
                />
              </div>
            </div>

            <section className="mt-12 space-y-6">
              <h2 className="text-xl font-semibold">¿Por qué principalmente jazz y trip hop?</h2>
              <p>
                Porque ambos géneros comparten algo difícil de explicar y fácil de sentir: una mezcla de precisión, nostalgia y
                groove que deja espacio para pensar. El jazz de mediados del siglo XX ofrece una atmósfera contenida,
                nocturna, con silencios que narran tanto como las notas. El trip hop, en cambio, arrastra una estética
                de videoclub y spoken word, con ritmos que flotan como las frases largas. Pero en realidad, el género lo dicta cada relato. 
                Cuando la historia lo pide, puede ser salsa, puede ser electrónica, o puede ser algo que aún no sabemos nombrar.
              </p>
            </section>

            <section className="mt-12 space-y-4">
              <h2 className="text-xl font-semibold">Canciones destacadas</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1 inline-block">
                    🔥 <strong>#3</strong> – Aphex Twin <small>(nuevo)</small>
                  </div>
                </li>
                <li><strong>Mi Sueño</strong> – Willie Colón</li>
                <li><strong>Las Tumbas</strong> – Ismael Rivera</li>
                <li><strong>Time Moves Slow</strong> – BADBADNOTGOOD ft. Samuel T. Herring</li>
                <li><strong>Roads</strong> – Portishead</li>
                <li><strong>Alone Together (Mono)</strong> – Chet Baker</li>
                <li><strong>Blue in Green</strong> – Miles Davis, John Coltrane & Bill Evans</li>
                <li><strong>Harlem Nocturne</strong> – Illinois Jacquet</li>
                <li><strong>Midnight In A Perfect World</strong> – DJ Shadow</li>
                <li><strong>'Round Midnight</strong> – Thelonious Monk</li>
                <li><strong>Electric Relaxation</strong> – A Tribe Called Quest</li>
                <li><strong>Mood Indigo</strong> – Duke Ellington</li>
                <li><strong>Bird's Lament</strong> – Moondog</li>
              </ul>
            </section>

            <p className="mt-12">
              Escúchala también en{' '}
              <a
                href="https://open.spotify.com/playlist/1KhNqfcsSL4nHzf43T5KLI"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                Spotify
              </a>{' '}
              o en{' '}
              <a
                href="https://www.youtube.com/playlist?list=PLKfzi-Ybx99YOcEfCuiwR5nEdAapExkel"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                YouTube
              </a>
              . Y si tienes una canción que crees que encaja en este universo, escríbenos un DM. La puerta está abierta.
            </p>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
