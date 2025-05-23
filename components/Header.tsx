"use client";

import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo.svg'
import CustomLink from './Link'
import { Instagram, X, Menu, X as Close } from 'lucide-react'
import { useState } from 'react'

const socialLinks = [
  {
    href: siteMetadata.instagram,
    label: 'Instagram',
    icon: <Instagram className="w-6 h-6" />,
  },
  {
    href: siteMetadata.twitter,
    label: 'X',
    icon: <X className="w-6 h-6" />,
  },
];

const navLinks = [
  { title: 'Criterios Editoriales', href: '/criterios' },
  { title: 'Acerca de', href: '/acerca' },
];

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 relative z-30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Redes sociales (desktop) */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors hidden sm:inline-flex"
                >
                  {link.icon}
                </a>
              ) : null
            )}
          </div>

          {/* Logotipo centrado */}
          <div className="flex-1 flex justify-center absolute left-0 right-0 pointer-events-none">
            <CustomLink href="/" aria-label={siteMetadata.headerTitle} className="pointer-events-auto">
              <Logo className="h-10 w-auto mx-auto fill-gray-900 dark:fill-white" />
            </CustomLink>
          </div>

          {/* Navegación y botón destacado (desktop) */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-4">
              {navLinks.map((link) => (
                <CustomLink
                  key={link.title}
                  href={link.href}
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 rounded transition-colors"
                >
                  {link.title}
                </CustomLink>
              ))}
              <CustomLink
                href="/publica"
                className="ml-2 px-4 py-2 rounded-md font-semibold bg-primary-500 text-black dark:text-gray-900 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 shadow transition-colors border-2 border-primary-500 dark:border-primary-400"
              >
                Publica con nosotros
              </CustomLink>
            </div>
            {/* Icono hamburguesa en móvil */}
            <button
              className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-7 h-7 text-gray-700 dark:text-gray-200" />
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
                  <Close className="w-7 h-7 text-gray-700 dark:text-gray-200" />
                </button>
                <nav className="flex flex-col gap-8 text-2xl items-center w-full mt-12">
                  {navLinks.map((link) => (
                    <CustomLink
                      key={link.title}
                      href={link.href}
                      className="font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 px-2 py-2 rounded transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.title}
                    </CustomLink>
                  ))}
                  <CustomLink
                    href="/publica"
                    className="mt-4 px-6 py-3 rounded-md font-semibold bg-primary-500 text-black dark:text-gray-900 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 shadow transition-colors border-2 border-primary-500 dark:border-primary-400 text-xl"
                    onClick={() => setOpen(false)}
                  >
                    Publica con nosotros
                  </CustomLink>
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
                        className="text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
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
