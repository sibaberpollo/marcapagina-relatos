'use client'
import Link from './Link'
import { usePathname } from 'next/navigation'

export default function PublishBanner() {
  const pathname = usePathname()

  // No mostrar el banner en las páginas de publicación
  if (
    pathname === '/publica' ||
    pathname === '/publica/colaboradores' ||
    pathname === '/publica/gracias'
  ) {
    return null
  }

  return (
    <div
      className="mb-4 w-full max-w-6xl rounded px-6 py-4 font-semibold"
      style={{ background: '#faff00', color: '#222', boxShadow: '0 0 8px #faff00' }}
    >
      <div className="flex flex-col items-center gap-6 md:flex-row">
        {/* Máquina de escribir - encima en móvil, izquierda en desktop */}
        <div className="order-1 flex-shrink-0 md:order-1">
          <img
            src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748165662/maquina_escribir_pwxvlz.png"
            alt="Máquina de escribir"
            className="h-32 w-32 object-contain md:h-40 md:w-40"
          />
        </div>

        {/* Texto - abajo en móvil, derecha en desktop */}
        <div className="order-2 flex-1 text-left md:order-2">
          <p className="mb-2 text-lg">
            <strong>
              ¿Te gustaría publicar tu relato en{' '}
              <Link href="/transtextos" className="underline hover:underline">
                Transtextos
              </Link>
              ?
            </strong>
          </p>
          <p className="mb-4">
            En nuestro feed de narrativa buscamos nuevas voces y relatos. Si tienes un texto que
            quieras compartir, ¡anímate a enviarlo!
          </p>
          <Link
            href="/publica"
            className="inline-block rounded bg-black px-4 py-2 font-bold text-yellow-200 transition-colors duration-200 hover:bg-gray-800"
          >
            Publica en Transtextos
          </Link>
        </div>
      </div>
    </div>
  )
}
