"use client";

import Image from 'next/image'
import CustomLink from './Link'
import { Instagram, Menu, X as Close } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import NewLogo from './newLogo'
import PublishDropdown from './PublishDropdown'
import SearchBar from './SearchBar'

const socialLinks = [
  {
    href: "https://www.instagram.com/transtextosig/",
    label: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    href: "https://x.com/transtextos",
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const navLinks = [
  { title: '← Marcapágina', href: '/' },
  { title: 'Inicio', href: '/transtextos' },
  { title: 'Autores', href: '/autores?filter=transtextos' },
  { title: 'Acerca de Transtextos', href: '/transtextos/acerca-de' },
];

const TranstextosHeader = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 relative z-30">
      <div className="max-w-screen-2xl mx-auto ">
        <div className="flex items-center justify-between h-16 relative pl-[56px]">
          {/* Botón volver a Marcapágina - del alto completo, pegado a la izquierda, fondo amarillo, solo texto */}
          <NewLogo />

          {/* Redes sociales alineadas a la izquierda (después del botón de volver) */}
          <div className="hidden md:flex items-center gap-4 ml-[56px]">
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

          {/* Buscador centrado entre redes sociales y logo - solo desktop */}
          <div className="hidden lg:block flex-1 max-w-xs mx-8">
            <SearchBar className="w-full" />
          </div>

          {/* Logo Transtextos centrado */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <CustomLink href="/transtextos" aria-label="Transtextos" className="decoration-none">
              <Image
                src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748543049/android-chrome-192x192-1-e1602674825140_rwwa0n.png"
                alt="Transtextos"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </CustomLink>
          </div>

          {/* Navegación alineada a la derecha */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Navegación desktop */}
            <div className="hidden lg:flex items-center gap-4">
              {navLinks.map((link) => (
                <CustomLink
                  key={link.title}
                  href={link.href}
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded transition-colors text-sm"
                >
                  {link.title}
                </CustomLink>
              ))}
              <PublishDropdown />
              <ThemeToggle />
            </div>

            {/* Botón toggle móvil/tablet */}
            <div className="lg:hidden">
              <ThemeToggle />
            </div>

            {/* Icono hamburguesa móvil/tablet */}
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
                <nav className="flex flex-col gap-8 text-xl items-center w-full mt-12">
                  <SearchBar className="w-full max-w-xs" />
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
                  <div className="mt-4">
                    <PublishDropdown isMobile={true} />
                  </div>
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

export default TranstextosHeader 