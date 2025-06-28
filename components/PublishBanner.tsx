'use client'
import Link from './Link'
import { usePathname } from 'next/navigation'

export default function PublishBanner() {
  const pathname = usePathname()
  
  // No mostrar el banner en las páginas de publicación
  if (pathname === '/publica' || pathname === '/publica/colaboradores' || pathname === '/publica/gracias') {
    return null
  }

  return (
    <div className="px-6 py-4 rounded font-semibold max-w-6xl w-full mb-4" 
      style={{ background: '#faff00', color: '#222', boxShadow: '0 0 8px #faff00' }}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Máquina de escribir - encima en móvil, izquierda en desktop */}
        <div className="order-1 md:order-1 flex-shrink-0">
          <img 
            src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748165662/maquina_escribir_pwxvlz.png"
            alt="Máquina de escribir"
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
          />
        </div>
        
        {/* Texto - abajo en móvil, derecha en desktop */}
        <div className="order-2 md:order-2 flex-1 text-left">
          <p className="text-lg mb-2">
            <strong>¿Te gustaría publicar tu relato en <Link href="/transtextos" className="underline hover:underline">Transtextos</Link>?</strong>
          </p>
          <p className="mb-4">En nuestro feed de narrativa buscamos nuevas voces y relatos. Si tienes un texto que quieras compartir, ¡anímate a enviarlo!</p>
          <Link
            href="/publica"
            className="inline-block px-4 py-2 rounded bg-black text-yellow-200 font-bold hover:bg-gray-800 transition-colors duration-200"
          >
            Publica en Transtextos
          </Link>
        </div>
      </div>
    </div>
  )
} 