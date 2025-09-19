import SectionContainer from '@/components/layout/SectionContainer'
import PageTitle from '@/components/common/PageTitle'
import { genPageMetadata } from 'app/seo'
import { getPlaylistContent, processMarkdown } from '@/lib/playlist'
import { headers } from 'next/headers'

function getLocaleFromHeaders(headers: Headers): string {
  return headers.get('x-locale') || 'es'
}

export async function generateMetadata() {
  const headersList = await headers()
  const locale = getLocaleFromHeaders(headersList)

  const playlistData = await getPlaylistContent(locale)

  if (!playlistData) {
    return genPageMetadata({
      title: 'Playlist | Marcapágina',
      description: 'Playlist literaria de Marcapágina',
    })
  }

  const { content } = playlistData
  const isEn = locale === 'en'

  return genPageMetadata({
    title: `${content.title} | Marcapágina`,
    description: content.description,
    openGraph: {
      title: `${content.title} | Marcapágina`,
      description: content.description,
      type: 'website',
      videos: [
        {
          url: 'https://www.youtube.com/embed/videoseries?list=PLKfzi-Ybx99YOcEfCuiwR5nEdAapExkel',
          type: 'text/html',
          width: 560,
          height: 315,
        },
      ],
    },
  })
}

export default async function PlaylistPage() {
  const headersList = await headers()
  const locale = getLocaleFromHeaders(headersList)

  const playlistData = await getPlaylistContent(locale)

  if (!playlistData) {
    return (
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-4 md:space-y-5">
          <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 dark:text-gray-50">
            Error cargando playlist
          </h1>
          <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
            No se pudo cargar el contenido del playlist.
          </p>
        </div>
      </SectionContainer>
    )
  }

  const { content, tracks, embeds } = playlistData
  const isEn = locale === 'en'

  return (
    <SectionContainer>
      <article className="mx-auto max-w-3xl">
        <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
          <div className="pt-8 pb-8">
            <PageTitle>{content.title}</PageTitle>
            <p className="text-muted-foreground mt-2 text-lg">{content.description}</p>

            <div className="mt-8 space-y-6">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full rounded-md"
                  src={embeds.youtube.url}
                  title={embeds.youtube.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  aria-label={embeds.youtube.title}
                />
              </div>
              <div className="aspect-[16/10]">
                <iframe
                  className="h-full w-full rounded-md"
                  src={embeds.spotify.url}
                  title={embeds.spotify.title}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  aria-label={embeds.spotify.title}
                />
              </div>
            </div>

            <section className="mt-12 space-y-6">
              <h2 className="text-xl font-semibold">{content.sections.why.title}</h2>
              <p>{content.sections.why.content}</p>
            </section>

            <section className="mt-12 space-y-4">
              <h2 className="text-xl font-semibold">{content.sections.featured.title}</h2>
              <ul className="list-inside list-disc space-y-1">
                {tracks.map((track, index) => (
                  <li key={track.id}>
                    {index === 0 && track.isFeatured ? (
                      <div className="inline-block rounded-md bg-gray-100 px-3 py-1 dark:bg-gray-800">
                        🔥 <strong>{track.name}</strong> – {track.artist}
                        {track.isNew && <small> ({isEn ? 'new' : 'nuevo'})</small>}
                      </div>
                    ) : (
                      <>
                        <strong>{track.name}</strong> – {track.artist}
                        {track.isNew && <small> ({isEn ? 'new' : 'nuevo'})</small>}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <div
              className="mt-12"
              dangerouslySetInnerHTML={{
                __html: processMarkdown(content.footer),
              }}
            />
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
