'use client'

import { ReactNode, useEffect, useState } from 'react'

interface HighlightStrokeProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function HighlightStroke({
  children,
  className = '',
  style = {},
}: HighlightStrokeProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Comprobar si estamos en modo oscuro inicialmente
    setIsDarkMode(document.documentElement.classList.contains('dark'))

    // Observar cambios en el tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  const darkModeStyles = isDarkMode
    ? {
        background: 'white',
        color: '#111827',
        boxShadow: '0 0 12px rgba(255,255,255,0.3)',
      }
    : {}

  return (
    <span
      className={`rounded px-2 align-middle font-semibold transition-colors duration-200 ${className}`}
      style={{
        background:
          'linear-gradient(90deg, rgba(250,255,0,0.2) 0%, rgba(250,255,0,0.4) 20%, rgba(250,255,0,0.6) 50%, rgba(250,255,0,0.4) 80%, rgba(250,255,0,0.2) 100%)',
        color: '#222',
        boxShadow: '0 0 12px rgba(250,255,0,0.2)',
        clipPath:
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 2% 2%, 98% 2%, 98% 98%, 2% 98%, 2% 2%)',
        ...darkModeStyles,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
