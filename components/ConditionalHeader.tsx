'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import TranstextosHeader from './TranstextosHeader'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Ocultar header completamente en dashboard (shadcn tiene su propio header)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/biblioteca-personal')) {
    return null
  }
  
  // Detectar si estamos en rutas de secciones de Transtextos
  const isTranstextosRoute = pathname.startsWith('/transtextos') || 
                            pathname.startsWith('/publica') || 
                            pathname.startsWith('/criterios-editoriales') ||
                            pathname.startsWith('/series') ||
                            pathname.startsWith('/serie/')
  
  // Para relatos individuales, usamos TranstextosHeader por defecto
  // Excepto para algunos relatos específicos que usan el header genérico
  if (pathname.startsWith('/relato/')) {
    // Lista de relatos que deben usar el header genérico
    const genericHeaderRelatos = [
      'treinta-minutos-o-menos',
      'los-dias'
    ]
    
    // Extraer el slug del relato de la URL
    const relatoSlug = pathname.split('/relato/')[1]
    
    // Si el relato está en la lista, usar header genérico
    if (genericHeaderRelatos.includes(relatoSlug)) {
      return <Header />
    }
    
    // Para el resto de relatos, usar TranstextosHeader
    return <TranstextosHeader />
  }
  
  return isTranstextosRoute ? <TranstextosHeader /> : <Header />
} 