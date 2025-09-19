'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Detectar conexión lenta
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection

    const isSlowConnection =
      connection &&
      (connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData === true)

    // Detectar navegador antiguo (sin soporte para CSS Grid o Flexbox moderno)
    const isOldBrowser = !CSS.supports('display', 'grid') || !CSS.supports('gap', '1rem')

    // Detectar si ya estamos en la vista cronológica o si hay un parámetro para no redirigir
    const currentPath = window.location.pathname
    const searchParams = new URLSearchParams(window.location.search)
    const forceCards = searchParams.get('vista') === 'cards'

    if ((isSlowConnection || isOldBrowser) && currentPath === '/' && !forceCards) {
      // Redirigir a vista cronológica con parámetro indicando la razón
      router.replace('/cronologico?redirect=slow')
    }
  }, [router])

  return null
}
