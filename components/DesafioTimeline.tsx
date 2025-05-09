import React from 'react'

type DesafioTimelineProps = {
  pasoActual: number
  totalPasos: number
}

export function DesafioTimeline({ pasoActual, totalPasos }: DesafioTimelineProps) {
  // Crear un array con el total de pasos para iterarlo
  const pasos = Array.from({ length: totalPasos })
  
  return (
    <div className="w-full py-4 sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-md">
      <div className="flex justify-between items-center max-w-3xl mx-auto px-4">
        {pasos.map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < pasoActual
                  ? 'bg-green-500 text-white'
                  : index === pasoActual
                  ? 'bg-black text-[#faff00] font-bold'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {index < pasoActual ? '✓' : index + 1}
            </div>
            <span className="text-sm mt-2 text-center">
              {index < totalPasos - 1 ? `Relato ${index + 1}` : 'Desafío'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-4 mb-2 max-w-3xl mx-auto px-4">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-full" />
        <div
          className="absolute top-0 left-0 h-1 bg-black dark:bg-[#faff00] transition-all duration-300 rounded-full"
          style={{ width: `${(pasoActual / (totalPasos - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
} 