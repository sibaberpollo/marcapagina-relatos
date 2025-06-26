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
  href
}: PlaylistCardProps) {
  const currentlyPlayingText = language === 'en' ? 'Currently Playing' : 'Sonando Ahora'
  const playlistText = language === 'en' ? 'Playlist' : 'Playlist'

  const content = (
    <div className="bg-[#212121] rounded-lg shadow-lg p-6 min-h-[420px] transition-transform duration-300 hover:scale-[1.02]">
      {/* Badge de tipo en esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/80 text-white shadow-lg backdrop-blur-sm">
          <Music className="w-3 h-3" />
          {playlistText}
        </span>
      </div>

      {/* Header con ícono usando colores del proyecto */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 mr-3 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <Music className="w-6 h-6 text-black" />
        </div>
        <h3 className="text-lg font-bold text-white">
          {currentlyPlayingText}
        </h3>
      </div>

      {/* Tema actual destacado */}
      <div className="mb-6 p-4 bg-[#333333] rounded-lg border-l-4 border-primary-500">
        {/* Album cover más grande */}
        <div className="w-24 h-24 mx-auto mb-4 bg-[#333333] rounded-lg flex items-center justify-center">
          {currentTrack.albumCover ? (
            <img 
              src={currentTrack.albumCover} 
              alt={`${currentTrack.name} album cover`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Music className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        {/* Información del tema con animación */}
        <div className="text-center">
          <p className="font-bold text-white mb-1 text-lg">
            {currentTrack.name}
          </p>
          <p className="text-gray-300 text-sm">
            {currentTrack.artist}
          </p>
          
          {/* Animación de equalizer con amarillo del proyecto */}
          <div className="flex justify-center mt-3 gap-1">
            <div className="w-1 bg-primary-500 rounded-full animate-pulse" style={{
              height: '8px',
              animationDelay: '0.2s',
              animationDuration: '1s'
            }}></div>
            <div className="w-1 bg-primary-500 rounded-full animate-pulse" style={{
              height: '16px',
              animationDelay: '0.4s',
              animationDuration: '1.2s'
            }}></div>
            <div className="w-1 bg-primary-500 rounded-full animate-pulse" style={{
              height: '12px',
              animationDelay: '0.6s',
              animationDuration: '0.8s'
            }}></div>
            <div className="w-1 bg-primary-500 rounded-full animate-pulse" style={{
              height: '20px',
              animationDelay: '0.8s',
              animationDuration: '1.4s'
            }}></div>
          </div>
        </div>
      </div>

      {/* Lista de temas anteriores */}
      {previousTracks.length > 0 && (
        <div className="space-y-3">
          {previousTracks.slice(0, 2).map((track, index) => (
            <div key={index} className="flex items-center p-3 rounded-lg hover:bg-[#333333] transition-colors cursor-pointer">
              {/* Album cover pequeño */}
              <div className="w-10 h-10 mr-3 bg-[#333333] rounded flex items-center justify-center flex-shrink-0">
                {track.albumCover ? (
                  <img 
                    src={track.albumCover} 
                    alt={`${track.name} album cover`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <Music className="w-4 h-4 text-gray-400" />
                )}
              </div>
              
              {/* Información del tema */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">
                  {track.name}
                </p>
                <p className="text-gray-300 text-xs truncate">
                  {track.artist}
                </p>
              </div>
              
              {/* Botón de play */}
              <div className="ml-2 flex-shrink-0">
                <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200">
                  <Play className="w-4 h-4" />
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
      <div className="group block w-full h-full break-inside-avoid mb-4 relative">
        <a href={href} className="block h-full">
          {content}
        </a>
      </div>
    )
  }

  return (
    <div className="group block w-full h-full break-inside-avoid mb-4 relative">
      {content}
    </div>
  )
} 