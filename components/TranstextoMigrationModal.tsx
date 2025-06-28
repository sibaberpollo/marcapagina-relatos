'use client'

import { useState, useEffect } from 'react'

export default function TranstextoMigrationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Mostrar el modal siempre
    setIsOpen(true)
  }, [])

  const closeModal = () => {
    setIsOpen(false)
  }

  // No renderizar nada hasta que el componente esté montado (evitar hydration mismatch)
  if (!mounted || !isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
           style={{ 
             backgroundColor: 'var(--color-bg-light)', 
             color: 'var(--color-text-light)' 
           }}
           data-theme-target="modal">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-50"
            style={{ color: 'var(--color-text-light)' }}>
          ¡Hola! 👋
        </h2>
        <div className="space-y-3 text-sm mb-4 text-gray-700 dark:text-gray-300"
             style={{ color: 'var(--color-text-light)' }}>
          <p>
            Queremos contarte que ahora todos los textos que nos envíen serán considerados para ser publicados como parte de <strong><a href="/transtextos" className="underline hover:underline">Transtextos</a></strong>, nuestro feed de narrativa.
          </p>
          <p>
            <strong>MarcaPágina</strong> es ahora una app que publica relatos, memes, playlists y otros formatos literarios, donde toda la narrativa forma parte de <strong><a href="/transtextos" className="underline hover:underline">Transtextos</a></strong>.
          </p>
          <p className="text-xs opacity-75">
            <em>Nota: Si ya fuiste publicado anteriormente en <a href="/transtextos" className="underline hover:underline">Transtextos</a>, puedes enviar tu relato directamente por correo electrónico.</em>
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-900 text-primary-500 dark:bg-primary-500 dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-primary-600 text-sm font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
} 