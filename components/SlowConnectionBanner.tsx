'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function SlowConnectionBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Verificar si venimos de una redirección por conexión lenta
    const searchParams = new URLSearchParams(window.location.search)
    const wasRedirected = searchParams.get('redirect') === 'slow'
    
    if (wasRedirected) {
      setShowBanner(true)
      // Limpiar el parámetro de la URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('redirect')
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  if (!showBanner) return null

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Vista simplificada activada para mejorar el rendimiento. 
            <a 
              href="/?vista=cards" 
              className="ml-1 underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100"
            >
              Ver vista completa
            </a>
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 