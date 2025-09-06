'use client'

import { Quote } from 'lucide-react'

interface QuoteCardProps {
  quote: string
  author?: string
  bgColor?: string
  textColor?: string
  authorColor?: string
  href?: string
  language?: string
}

export default function QuoteCard({
  quote,
  author,
  bgColor = '#4ade80', // Verde por defecto similar a la imagen
  textColor = '#8b0000', // Rojo oscuro para la cita
  authorColor = '#1f2e3d', // Azul oscuro para el autor
  href,
  language = 'es',
}: QuoteCardProps) {
  const badgeText = language === 'en' ? 'Quote' : 'Cita'
  const content = (
    <div
      className="relative flex h-full min-h-[320px] cursor-pointer flex-col justify-center overflow-hidden rounded-lg p-6 transition-transform duration-300 hover:scale-105 md:max-h-[420px]"
      style={{ backgroundColor: bgColor }}
    >
      {/* Badge de tipo en esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
          <Quote className="h-3 w-3" />
          {badgeText}
        </span>
      </div>

      {/* Comillas decorativas grandes */}
      <div className="absolute top-4 left-4 opacity-25">
        <svg
          width="220"
          height="220"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
        </svg>
      </div>

      {/* Texto de la cita */}
      <div className="relative z-10 text-center">
        <blockquote
          className="mb-3 text-base leading-relaxed font-medium md:text-lg"
          style={{ color: textColor }}
        >
          {quote}
        </blockquote>

        {/* Autor si existe */}
        {author && (
          <cite className="text-sm font-medium not-italic" style={{ color: authorColor }}>
            — {author}
          </cite>
        )}
      </div>
    </div>
  )

  // Si tiene href, envolver en Link
  if (href) {
    return (
      <div className="group mb-4 block h-full w-full break-inside-avoid">
        <a href={href} className="block h-full">
          {content}
        </a>
      </div>
    )
  }

  return <div className="group mb-4 block h-full w-full break-inside-avoid">{content}</div>
}
