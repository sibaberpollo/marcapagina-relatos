'use client'
import Link from './Link'
import { usePathname } from 'next/navigation'

export default function PublishBanner() {
  const pathname = usePathname()
  
  // No mostrar el banner en la página de publicación
  if (pathname === '/publica') {
    return null
  }

  return (
    <div className="px-6 py-4 rounded font-semibold text-center max-w-xl w-full mb-4" 
      style={{ background: '#faff00', color: '#222', boxShadow: '0 0 8px #faff00' }}>
      <p className="text-lg mb-2">
        <strong>¿Te gustaría publicar tu relato en <Link href="https://marcapagina.page" className="text-black underline hover:text-gray-700">marcapagina.page</Link>?</strong>
      </p>
      <p className="mb-4">En Marcapágina buscamos nuevas voces y relatos. Si tienes un texto que quieras compartir, ¡anímate a enviarlo!</p>
      <Link
        href="/publica"
        className="inline-block px-4 py-2 rounded bg-black text-yellow-200 font-bold hover:bg-gray-800 transition-colors duration-200"
      >
        Publica con nosotros
      </Link>
    </div>
  )
} 