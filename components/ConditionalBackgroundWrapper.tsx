'use client'

import { usePathname } from 'next/navigation'

export default function ConditionalBackgroundWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHoroscopoPage = pathname === '/horoscopo'

  if (isHoroscopoPage) {
    return (
      <div className="relative min-h-screen">
        {/* Textura sutil sobre el fondo base de la página */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Textura de papel/brush sutil */}
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 40% 70%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 10% 90%, rgba(0, 0, 0, 0.02) 0%, transparent 40%)
            `
          }}></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(0, 0, 0, 0.01) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(0, 0, 0, 0.01) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.01) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.01) 75%)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
          }}></div>
          {/* Formas geométricas sutiles en la zona hero */}
          <div className="absolute top-20 left-[10%] w-32 h-32 bg-gradient-to-br from-cyan-200 to-cyan-300 dark:from-cyan-700 dark:to-cyan-800 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-[15%] w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-700 opacity-25 transform rotate-45"></div>
          <div className="absolute top-60 left-[20%] w-20 h-20 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-full opacity-20"></div>
          <div className="absolute top-10 right-[30%] w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full opacity-15"></div>
          <div className="absolute top-80 right-[8%] w-28 h-28 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800 opacity-20 transform rotate-12"></div>
          
          {/* Partículas pequeñas flotantes */}
          <div className="absolute top-16 left-[65%] w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-52 right-[25%] w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse opacity-35" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-72 left-[15%] w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse opacity-25" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-28 right-[40%] w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse opacity-20" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Contenido con z-index para estar encima del fondo */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }

  return <>{children}</>
} 