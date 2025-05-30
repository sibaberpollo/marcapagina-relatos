"use client";

import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo.svg'
import CustomLink from './Link'
import { Instagram, Menu, X as Close } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

const socialLinks = [
  {
    href: siteMetadata.instagram,
    label: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
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
  { title: 'Criterios', href: '/criterios-editoriales' },
  { title: 'Transtextos →', href: '/transtextos' },
  { title: 'Acerca de', href: '/acerca-de' },
];

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 relative z-30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Redes sociales */}
          {/* Logo */}
          <div className="flex items-center mx-0 lg:mx-12 -mt-1">
            <CustomLink href="/" aria-label={siteMetadata.headerTitle} className="decoration-none">
              <Logo className="h-7 w-auto fill-gray-900 dark:fill-white" />
            </CustomLink>
          </div>
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
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <CustomLink
                  key={link.title}
                  href={link.href}
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded transition-colors"
                >
                  {link.title}
                </CustomLink>
              ))}
              <ThemeToggle />
              <CustomLink
                href="/publica"
                className="ml-2 px-4 py-2 rounded-md font-semibold bg-primary-500 text-black dark:text-gray-900 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 shadow transition-colors border-2 border-primary-500 dark:border-primary-400"
              >
                Publica
              </CustomLink>
            </div>
            {/* Botón de publica en móvil y tablet */}
            <div className="lg:hidden flex items-center gap-1">
              <CustomLink
                href="/publica"
                className="px-3 py-1.5 rounded-md font-semibold bg-primary-500 text-black dark:text-gray-900 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 shadow transition-colors border-2 border-primary-500 dark:border-primary-400 text-sm"
              >
                Publica
              </CustomLink>
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
                      {link.title}
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
