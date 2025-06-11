'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'transtexto-migration-modal-shown'

export default function TranstextoMigrationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Verificar si el modal ya fue mostrado
    try {
      const hasBeenShown = localStorage.getItem(STORAGE_KEY)
      if (!hasBeenShown) {
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
  }, [])

  const closeModal = () => {
    setIsOpen(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
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
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-50">
          💡 Nota para autores de Transtexto
        </h2>
        <div className="space-y-3 text-sm mb-4 text-gray-700 dark:text-gray-300">
          <p>
            Si ya fuiste publicado en <strong>Transtexto</strong> (ahora un minisitio que es parte de Marcapágina), 
            puedes enviar tu relato directamente por <em><strong>correo electrónico</strong></em>.
          </p>
          <p>
            <strong>No es necesario que uses este formulario.</strong>
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