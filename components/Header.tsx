"use client";

import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo.svg'
import CustomLink from './Link'
import { Instagram, Menu, X as Close, Rss } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import PublishDropdown from './PublishDropdown'

const socialLinks = [
  {
    href: siteMetadata.instagram,
    label: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    href: siteMetadata.spotify,
    label: 'Spotify',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    href: siteMetadata.twitter,
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const navLinks = [
  { title: 'Todos los relatos', href: '/cronologico' },
  {
    title: 'Transtextos',
    href: '/transtextos',
    icon: <Rss className="w-4 h-4 ml-1" style={{ color: '#f26522' }} />,
  },
  { title: 'Autores', href: '/autores' },
  { title: 'Acerca de', href: '/acerca-de' },
];

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 relative z-30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo */}
          <div className="flex items-center mx-0 lg:mx-12 -mt-1">
            <CustomLink href="/" aria-label={siteMetadata.headerTitle} className="decoration-none">
              <Logo className="h-7 w-auto fill-gray-900 dark:fill-white" />
            </CustomLink>
          </div>
          
          {/* Redes sociales */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors hidden sm:inline-flex"
                >
                  {link.icon}
                </a>
              ) : null
            )}
          </div>
          
          {/* Navegación y botón destacado */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Navegación desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <CustomLink
                  key={link.title}
                  href={link.href}
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded transition-colors"
                >
                  <span className="flex items-center">
                    {link.title}
                    {link.icon}
                  </span>
                </CustomLink>
              ))}
              <ThemeToggle />
              <PublishDropdown isMobile={false} />
            </div>
            
            {/* Navegación móvil */}
            <div className="lg:hidden flex items-center gap-1">
              <PublishDropdown isMobile={true} />
              <ThemeToggle />
            </div>
            
            {/* Icono hamburguesa en móvil y tablet */}
            <button
              className="lg:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          {/* Sidepanel menú móvil */}
          {open && (
            <div className="fixed inset-0 z-50 bg-black/60 flex">
              <div className="w-full max-w-none bg-white dark:bg-gray-950 h-full shadow-lg flex flex-col p-6 animate-slide-in justify-center items-center relative">
                <button
                  className="absolute top-6 right-6 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
                  aria-label="Cerrar menú"
                  onClick={() => setOpen(false)}
                >
                  <Close className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
                <nav className="flex flex-col gap-8 text-2xl items-center w-full mt-12">
                  {navLinks.map((link) => (
                    <CustomLink
                      key={link.title}
                      href={link.href}
                      className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-2 py-2 rounded transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <span className="flex items-center">
                        {link.title}
                        {link.icon}
                      </span>
                    </CustomLink>
                  ))}
                </nav>
                <div className="flex gap-8 mt-12">
                  {socialLinks.map((link) =>
                    link.href ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                      >
                        {link.icon}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
              {/* Fondo oscuro para cerrar el menú */}
              <div className="flex-1" onClick={() => setOpen(false)} />
            </div>
          )}
        </div>
      </div>
      {/* Animación para el sidepanel */}
      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </header>
  )
}

export default Header
