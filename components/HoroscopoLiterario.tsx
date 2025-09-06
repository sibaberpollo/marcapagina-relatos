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
  signos,
}: HoroscopoLiterarioProps) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div className="mb-6 break-inside-avoid">
      <div className="relative overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:border-indigo-800 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute top-4 right-4">
            <defs>
              <pattern
                id="star-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <Stars className="h-4 w-4 text-indigo-400" />
              </pattern>
            </defs>
            <rect width="60" height="60" fill="url(#star-pattern)" />
          </svg>
        </div>

        <div className="relative p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Horóscopo Literario
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{fecha}</p>
              </div>
            </div>
            <button
              onClick={() => setExpandido(!expandido)}
              className="rounded-lg p-2 transition-colors hover:bg-white/50 dark:hover:bg-black/20"
              aria-label={expandido ? 'Contraer' : 'Expandir'}
            >
              {expandido ? (
                <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Preview - Signo del mes */}
          <div className="space-y-4">
            <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-black/20">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                {signoDestacado.emoji} Signo del Mes: {signoDestacado.nombre}
                <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                  ({signoDestacado.fechas})
                </span>
              </h3>
              <blockquote className="border-l-4 border-indigo-300 pl-4 text-gray-700 italic dark:border-indigo-700 dark:text-gray-300">
                "{signoDestacado.frase}"
              </blockquote>
            </div>

            {/* Contenido expandible */}
            {expandido && (
              <div className="animate-in slide-in-from-top-5 space-y-6 duration-300">
                {/* Autor destacado */}
                <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-black/20">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    🪶 Autor {signoDestacado.nombre} destacado: {autorDestacado.nombre}
                  </h4>
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                    {autorDestacado.descripcion}
                  </p>
                </div>

                {/* Efemérides */}
                <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-black/20">
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    🗓 Efemérides literarias
                  </h4>
                  <div className="space-y-2">
                    {efemerides.map((evento, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {evento.fecha}:
                        </span>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          {evento.evento}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carta del Tarot */}
                <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-black/20">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    🃏 Carta: {carta.nombre} ({carta.numero})
                  </h4>
                  <p className="mb-3 text-gray-700 dark:text-gray-300">{carta.descripcion}</p>
                  <blockquote className="border-l-4 border-purple-300 pl-4 text-sm text-gray-600 italic dark:border-purple-700 dark:text-gray-400">
                    "{carta.frase}"
                  </blockquote>
                </div>

                {/* Todos los signos */}
                <div className="rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-black/20">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    📆 Horóscopo de la Quincena
                  </h4>
                  <div className="grid gap-3">
                    {signos.map((signo, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 dark:border-gray-700"
                      >
                        <h5 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                          {signo.emoji} {signo.nombre}
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            ({signo.fechas})
                          </span>
                        </h5>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
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
          <div className="mt-6 border-t border-indigo-200 pt-4 dark:border-indigo-800">
            <p className="text-center text-xs text-gray-600 dark:text-gray-400">
              Quincenal • Exclusivo MarcaPágina •
              <button
                onClick={() => setExpandido(!expandido)}
                className="ml-1 underline transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {expandido ? 'Ver menos' : 'Leer completo'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
