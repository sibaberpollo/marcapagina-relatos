'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import TranstextosHeader from './TranstextosHeader'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Detectar si estamos en rutas de secciones de Transtextos
  const isTranstextosRoute = pathname.startsWith('/transtextos') || 
                            pathname.startsWith('/publica') || 
                            pathname.startsWith('/criterios-editoriales')
  
  // Para relatos individuales, por ahora usamos el header principal
  // En el futuro se podría determinar dinámicamente si pertenecen a Transtextos
  if (pathname.startsWith('/relato/')) {
    return <Header />
  }
  
  return isTranstextosRoute ? <TranstextosHeader /> : <Header />
} 