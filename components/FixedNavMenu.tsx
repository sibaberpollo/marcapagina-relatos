'use client'

import { useEffect, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import Link from 'next/link'

interface FixedNavMenuProps {
  title: string
  authorAvatar?: string
  authorName?: string
  slug: string
  relatedPosts: CoreContent<any>[]  // Usar 'any' para aceptar tanto Blog como Relato
  author: string
}

export default function FixedNavMenu({ 
  title, 
  authorAvatar, 
  authorName,
  slug,
  relatedPosts,
  author
}: FixedNavMenuProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)

  // Función para acortar el título si es muy largo
  const shortenTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  // Ordenar los relatos relacionados para mostrar primero los más recientes
  const sortedRelatedPosts = [...relatedPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5) // Limitar a 5 relatos para no sobrecargar el menú

  // Función para cambiar el estado del menú
  const toggleMinimize = () => {
    if (menuOpen) setMenuOpen(false);
    setMinimized(!minimized);
  }
  
  // Función para expandir el menú si está minimizado
  const expandIfMinimized = () => {
    if (minimized) {
      setMinimized(false);
    }
  }

  useEffect(() => {
    // Función para calcular y actualizar el progreso de lectura
    const updateReadingProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }

    // Cerrar el menú al hacer scroll
    const handleScroll = () => {
      updateReadingProgress()
      if (menuOpen) {
        setMenuOpen(false)
      }
    }

    // Llamar una vez para establecer el progreso inicial
    updateReadingProgress()
    
    // Configurar escucha de eventos
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateReadingProgress)
    
    // Cerrar menú cuando se hace clic fuera
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (menuOpen && !target.closest('#fixed-nav-menu-component') && !target.closest('#story-menu')) {
        setMenuOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      // Limpieza
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateReadingProgress)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <>
      <style jsx global>{`
        #fixed-nav-menu-component {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          background-color: white !important;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
          border-top: 1px solid #e5e7eb !important;
          z-index: 9999999 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          transition: transform 0.3s ease-out !important;
        }
        
        #fixed-nav-menu-component.minimized {
          transform: translateY(calc(100% - 12px)) !important;
        }
        
        #fixed-nav-menu-component.minimized:hover {
          transform: translateY(calc(100% - 16px)) !important;
        }
        
        html.dark #fixed-nav-menu-component {
          background-color: #111827 !important;
          border-top: 1px solid #374151 !important;
        }
        
        #minimize-handle {
          position: absolute !important;
          top: -12px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 60px !important;
          height: 12px !important;
          background-color: inherit !important;
          border-top-left-radius: 8px !important;
          border-top-right-radius: 8px !important;
          border-top: 1px solid #e5e7eb !important;
          border-left: 1px solid #e5e7eb !important;
          border-right: 1px solid #e5e7eb !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          z-index: 1 !important;
        }
        
        html.dark #minimize-handle {
          border-color: #374151 !important;
        }
        
        #minimize-icon {
          width: 20px !important;
          height: 20px !important;
          color: #9ca3af !important;
          transition: transform 0.3s ease !important;
        }
        
        #fixed-nav-menu-component.minimized #minimize-icon {
          transform: rotate(180deg) !important;
        }
        
        #progress-bar-component {
          height: 2px !important;
          background-color: #816F50 !important;
          transition: width 0.3s !important;
        }
        
        html.dark #progress-bar-component {
          background-color: #816F50 !important;
        }
        
        #menu-content-component {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 12px 16px !important;
        }
        
        #menu-left-section {
          display: flex !important;
          align-items: center !important;
        }
        
        #menu-avatar-component {
          height: 32px !important;
          width: 32px !important;
          border-radius: 9999px !important;
          margin-right: 12px !important;
        }
        
        #menu-title-component {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #111827 !important;
        }
        
        html.dark #menu-title-component {
          color: #f9fafb !important;
        }
        
        #menu-button {
          background: none !important;
          border: none !important;
          padding: 8px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #4b5563 !important;
        }
        
        html.dark #menu-button {
          color: #9ca3af !important;
        }
        
        #menu-button:hover {
          color: #1f2937 !important;
        }
        
        html.dark #menu-button:hover {
          color: #f9fafb !important;
        }
        
        #menu-button svg {
          width: 20px !important;
          height: 20px !important;
        }
        
        #story-menu {
          position: fixed !important;
          bottom: 60px !important;
          right: 10px !important;
          background-color: white !important;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          width: 290px !important;
          max-height: 80vh !important;
          overflow-y: auto !important;
          z-index: 9999999 !important;
          padding: 8px 0 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          transform-origin: bottom right !important;
          transition: transform 0.2s ease-out, opacity 0.2s ease-out !important;
        }
        
        #story-menu.hidden {
          transform: scale(0.95) !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        
        html.dark #story-menu {
          background-color: #1f2937 !important;
          border-color: #374151 !important;
        }
        
        #story-menu-title {
          padding: 10px 16px !important;
          margin: 0 !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #6b7280 !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }
        
        html.dark #story-menu-title {
          color: #9ca3af !important;
          border-bottom-color: #374151 !important;
        }
        
        .story-menu-item {
          display: block !important;
          padding: 10px 16px !important;
          font-size: 14px !important;
          color: #111827 !important;
          text-decoration: none !important;
          transition: background-color 0.2s ease !important;
        }
        
        html.dark .story-menu-item {
          color: #e5e7eb !important;
        }
        
        .story-menu-item:hover {
          background-color: #f9fafb !important;
        }
        
        html.dark .story-menu-item:hover {
          background-color: #374151 !important;
        }
        
        .story-menu-item.active {
          background-color: #f3f8ff !important;
          position: relative !important;
        }
        
        html.dark .story-menu-item.active {
          background-color: #172342 !important;
        }
        
        .story-menu-item.active::before {
          content: '' !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          bottom: 0 !important;
          width: 3px !important;
          background-color: #3b82f6 !important;
        }
      `}</style>
      
      <div 
        id="fixed-nav-menu-component" 
        className={minimized ? 'minimized' : ''}
        onClick={expandIfMinimized}
      >
        <div 
          id="minimize-handle" 
          onClick={toggleMinimize}
          title={minimized ? "Expandir menú" : "Minimizar menú"}
        >
          <svg 
            id="minimize-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div 
          id="progress-bar-component" 
          style={{ width: `${readingProgress}%` }}
        />
        
        <div id="menu-content-component">
          <div id="menu-left-section">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName || 'Author'}
                id="menu-avatar-component"
              />
            )}
            
            <div id="menu-title-component">
              {shortenTitle(title)}
            </div>
          </div>
          
          <button 
            id="menu-button" 
            aria-label="Ver más relatos"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div id="story-menu" className={menuOpen ? '' : 'hidden'}>
        <h3 id="story-menu-title">Más relatos de {authorName}</h3>
        {sortedRelatedPosts.map((post) => (
          <Link
            href={`/${author}/relato/${post.slug}`}
            key={post.slug}
            className={`story-menu-item ${post.slug === slug ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {post.title}
          </Link>
        ))}
      </div>
    </>
  )
} 