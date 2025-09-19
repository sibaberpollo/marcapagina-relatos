'use client'

import { Music, Play } from 'lucide-react'

interface Track {
  name: string
  artist: string
  albumCover?: string
}

interface PlaylistCardProps {
  currentTrack: Track
  previousTracks: Track[]
  language?: string
  href?: string
}

export default function PlaylistCard({
  currentTrack,
  previousTracks,
  language = 'es',
  href,
}: PlaylistCardProps) {
  const currentlyPlayingText = language === 'en' ? 'Currently Playing' : 'Sonando Ahora'
  const playlistText = language === 'en' ? 'Playlist' : 'Playlist'

  const content = (
    <div className="min-h-[420px] rounded-lg bg-[#212121] p-6 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
      {/* Badge de tipo en esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
          <Music className="h-3 w-3" />
          {playlistText}
        </span>
      </div>

      {/* Header con ícono usando colores del proyecto */}
      <div className="mb-6 flex items-center">
        <div className="from-primary-400 to-primary-600 mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br">
          <Music className="h-6 w-6 text-black" />
        </div>
        <h3 className="text-lg font-bold text-white">{currentlyPlayingText}</h3>
      </div>

      {/* Tema actual destacado */}
      <div className="border-primary-500 mb-6 rounded-lg border-l-4 bg-[#333333] p-4">
        {/* Album cover más grande */}
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-lg bg-[#333333]">
          {currentTrack.albumCover ? (
            <img
              src={currentTrack.albumCover}
              alt={`${currentTrack.name} album cover`}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <Music className="h-8 w-8 text-gray-400" />
          )}
        </div>

        {/* Información del tema con animación */}
        <div className="text-center">
          <p className="mb-1 text-lg font-bold text-white">{currentTrack.name}</p>
          <p className="text-sm text-gray-300">{currentTrack.artist}</p>

          {/* Animación de equalizer con amarillo del proyecto */}
          <div className="mt-3 flex justify-center gap-1">
            <div
              className="bg-primary-500 w-1 animate-pulse rounded-full"
              style={{
                height: '8px',
                animationDelay: '0.2s',
                animationDuration: '1s',
              }}
            ></div>
            <div
              className="bg-primary-500 w-1 animate-pulse rounded-full"
              style={{
                height: '16px',
                animationDelay: '0.4s',
                animationDuration: '1.2s',
              }}
            ></div>
            <div
              className="bg-primary-500 w-1 animate-pulse rounded-full"
              style={{
                height: '12px',
                animationDelay: '0.6s',
                animationDuration: '0.8s',
              }}
            ></div>
            <div
              className="bg-primary-500 w-1 animate-pulse rounded-full"
              style={{
                height: '20px',
                animationDelay: '0.8s',
                animationDuration: '1.4s',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Lista de temas anteriores */}
      {previousTracks.length > 0 && (
        <div className="space-y-3">
          {previousTracks.slice(0, 2).map((track, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center rounded-lg p-3 transition-colors hover:bg-[#333333]"
            >
              {/* Album cover pequeño */}
              <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-[#333333]">
                {track.albumCover ? (
                  <img
                    src={track.albumCover}
                    alt={`${track.name} album cover`}
                    className="h-full w-full rounded object-cover"
                  />
                ) : (
                  <Music className="h-4 w-4 text-gray-400" />
                )}
              </div>

              {/* Información del tema */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{track.name}</p>
                <p className="truncate text-xs text-gray-300">{track.artist}</p>
              </div>

              {/* Botón de play */}
              <div className="ml-2 flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-200">
                  <Play className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Si tiene href, envolver en link
  if (href) {
    return (
      <div className="group relative mb-4 block h-full w-full break-inside-avoid">
        <a href={href} className="block h-full">
          {content}
        </a>
      </div>
    )
  }

  return <div className="group relative mb-4 block h-full w-full break-inside-avoid">{content}</div>
}
