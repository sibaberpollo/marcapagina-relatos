import React from 'react'

type DesafioTimelineProps = {
  pasoActual: number
  totalPasos: number
}

export function DesafioTimeline({ pasoActual, totalPasos }: DesafioTimelineProps) {
  // Crear un array con el total de pasos para iterarlo
  const pasos = Array.from({ length: totalPasos })

  return (
    <div className="w-full bg-white py-4 dark:bg-gray-900">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4">
        {pasos.map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                index < pasoActual
                  ? 'bg-green-500 text-white'
                  : index === pasoActual
                    ? 'bg-black font-bold text-[#faff00]'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {index < pasoActual ? '✓' : index + 1}
            </div>
            <span className="mt-2 text-center text-sm">
              {index < totalPasos - 1 ? `Relato ${index + 1}` : 'Desafío'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mx-auto mt-4 mb-2 max-w-3xl px-4">
        <div className="absolute top-0 left-0 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
        <div
          className="absolute top-0 left-0 h-2 rounded-full bg-black transition-all duration-300 dark:bg-[#faff00]"
          style={{ width: `${(pasoActual / (totalPasos - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
