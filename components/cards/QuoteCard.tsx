'use client'

import { Quote } from 'lucide-react'

interface QuoteCardProps {
  quote: string
  author?: string
  bgColor?: string
  href?: string
  language?: string
}

export default function QuoteCard({
  quote,
  author,
  bgColor = '#4ade80', // Verde por defecto similar a la imagen
  href,
  language = 'es'
}: QuoteCardProps) {
  const badgeText = language === 'en' ? 'Quote' : 'Cita';
  const content = (
    <div 
      className="relative h-full overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 p-6 flex flex-col justify-center min-h-[320px] md:max-h-[420px]"
      style={{ backgroundColor: bgColor }}
    >
      {/* Badge de tipo en esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/80 text-white shadow-lg backdrop-blur-sm">
          <Quote className="w-3 h-3" />
          {badgeText}
        </span>
      </div>
      
      {/* Comillas decorativas grandes */}
      <div className="absolute top-4 left-4 opacity-20">
        <svg width="220" height="220" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
        </svg>
      </div>
      
      {/* Texto de la cita */}
      <div className="relative z-10 text-center">
        <blockquote className="text-white text-base md:text-lg font-medium leading-relaxed mb-3">
          {quote}
        </blockquote>
        
        {/* Autor si existe */}
        {author && (
          <cite className="text-white/80 text-sm font-medium not-italic">
            — {author}
          </cite>
        )}
      </div>
    </div>
  )

  // Si tiene href, envolver en Link
  if (href) {
    return (
      <div className="group block w-full h-full break-inside-avoid mb-4">
        <a href={href} className="block h-full">
          {content}
        </a>
      </div>
    )
  }

  return (
    <div className="group block w-full h-full break-inside-avoid mb-4">
      {content}
    </div>
  )
} 