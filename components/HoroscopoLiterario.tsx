'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Stars, BookOpen } from 'lucide-react'

interface HoroscopoLiterarioProps {
  fecha: string
  signoDestacado: {
    emoji: string
    nombre: string
    fechas: string
    frase: string
  }
  autorDestacado: {
    nombre: string
    descripcion: string
  }
  efemerides: Array<{
    fecha: string
    evento: string
  }>
  carta: {
    nombre: string
    numero: string
    descripcion: string
    frase: string
  }
  signos: Array<{
    emoji: string
    nombre: string
    fechas: string
    prediccion: string
  }>
}

export default function HoroscopoLiterario({ 
  fecha, 
  signoDestacado, 
  autorDestacado, 
  efemerides, 
  carta, 
  signos 
}: HoroscopoLiterarioProps) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div className="break-inside-avoid mb-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 border border-indigo-200 dark:border-indigo-800">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute top-4 right-4">
            <defs>
              <pattern id="star-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <Stars className="w-4 h-4 text-indigo-400" />
              </pattern>
            </defs>
            <rect width="60" height="60" fill="url(#star-pattern)" />
          </svg>
        </div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                  Horóscopo Literario
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fecha}
                </p>
              </div>
            </div>
            <button
              onClick={() => setExpandido(!expandido)}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
              aria-label={expandido ? "Contraer" : "Expandir"}
            >
              {expandido ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Preview - Signo del mes */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {signoDestacado.emoji} Signo del Mes: {signoDestacado.nombre} 
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                  ({signoDestacado.fechas})
                </span>
              </h3>
              <blockquote className="italic text-gray-700 dark:text-gray-300 border-l-4 border-indigo-300 dark:border-indigo-700 pl-4">
                "{signoDestacado.frase}"
              </blockquote>
            </div>

            {/* Contenido expandible */}
            {expandido && (
              <div className="space-y-6 animate-in slide-in-from-top-5 duration-300">
                {/* Autor destacado */}
                <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    🪶 Autor {signoDestacado.nombre} destacado: {autorDestacado.nombre}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {autorDestacado.descripcion}
                  </p>
                </div>

                {/* Efemérides */}
                <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🗓 Efemérides literarias
                  </h4>
                  <div className="space-y-2">
                    {efemerides.map((evento, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {evento.fecha}:
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 ml-2">
                          {evento.evento}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carta del Tarot */}
                <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    🃏 Carta: {carta.nombre} ({carta.numero})
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {carta.descripcion}
                  </p>
                  <blockquote className="italic text-gray-600 dark:text-gray-400 text-sm border-l-4 border-purple-300 dark:border-purple-700 pl-4">
                    "{carta.frase}"
                  </blockquote>
                </div>

                {/* Todos los signos */}
                <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur-sm">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    📆 Horóscopo de la Quincena
                  </h4>
                  <div className="grid gap-3">
                    {signos.map((signo, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {signo.emoji} {signo.nombre} 
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({signo.fechas})
                          </span>
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {signo.prediccion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer con llamada a la acción */}
          <div className="mt-6 pt-4 border-t border-indigo-200 dark:border-indigo-800">
            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              Quincenal • Exclusivo MarcaPágina • 
              <button 
                onClick={() => setExpandido(!expandido)}
                className="ml-1 underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {expandido ? "Ver menos" : "Leer completo"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 