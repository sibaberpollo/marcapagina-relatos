'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import TranstextosHeader from './TranstextosHeader'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Las rutas de relatos individuales manejan sus propios headers
  if (pathname.startsWith('/relato/')) {
    return null
  }
  
  // Detectar si estamos en rutas de secciones de Transtextos
  const isTranstextosRoute = pathname.startsWith('/transtextos')
  
  return isTranstextosRoute ? <TranstextosHeader /> : <Header />
} 