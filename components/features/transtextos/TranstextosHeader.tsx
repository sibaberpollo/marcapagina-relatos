'use client'

import Image from 'next/image'
import CustomLink from '../../common/Link'
import { Instagram, Menu, X as Close } from 'lucide-react'
import { useState } from 'react'
// Tema fijo claro; no usamos ThemeToggle en este header
import dynamic from 'next/dynamic'
const UserMenu = dynamic(() => import('../../auth/UserMenu'), { ssr: false })
import NewLogo from '../../common/newLogo'
import PublishDropdown from '../../content/publishing/PublishDropdown'
import SearchBar from '../../search/SearchBar'

const socialLinks = [
  {
    href: 'https://www.instagram.com/transtextosig/',
    label: 'Instagram',
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    href: 'https://x.com/transtextos',
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

const navLinks = [
  { title: '← Marcapágina', href: '/' },
  { title: 'Inicio', href: '/transtextos' },
  { title: 'Autores', href: '/autores?filter=transtextos' },
  { title: 'Transtextos', href: '/transtextos/acerca-de' },
]

const TranstextosHeader = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-30 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="relative flex h-16 items-center justify-between">
        {/* Botón volver a Marcapágina - del alto completo, pegado a la izquierda, fondo amarillo, solo texto */}
        <NewLogo />

        {/* Contenedor interno para mantener espaciado de elementos */}
        <div className="mx-auto flex max-w-screen-2xl flex-1 items-center justify-between pl-[56px]">
          {/* Redes sociales alineadas a la izquierda (después del botón de volver) */}
          <div className="hidden items-center gap-4 md:flex">
            {socialLinks.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  {link.icon}
                </a>
              ) : null
            )}
          </div>

          {/* Buscador centrado entre redes sociales y logo - solo desktop */}
          <div className="mx-8 hidden max-w-xs flex-1 lg:block">
            <SearchBar className="w-full" />
          </div>

          {/* Logo Transtextos centrado */}
          <div className="absolute left-1/2 -translate-x-1/2 transform">
            <CustomLink href="/transtextos" aria-label="Transtextos" className="decoration-none">
              <Image
                src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748543049/android-chrome-192x192-1-e1602674825140_rwwa0n.png"
                alt="Transtextos"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </CustomLink>
          </div>

          {/* Navegación alineada a la derecha */}
          <div className="ml-auto flex items-center gap-2">
            {/* Navegación desktop */}
            <div className="hidden items-center gap-4 lg:flex">
              {navLinks.map((link) => (
                <CustomLink
                  key={link.title}
                  href={link.href}
                  className="rounded px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                >
                  {link.title}
                </CustomLink>
              ))}
              <PublishDropdown />
              {/* Tema fijo claro para este release; no mostramos toggle */}
              <UserMenu />
            </div>

            {/* Botón toggle móvil/tablet */}
            <div className="ml-2 flex items-center gap-2 lg:hidden">
              <UserMenu />
            </div>

            {/* Icono hamburguesa móvil/tablet */}
            <button
              className="focus:ring-primary-500 rounded p-2 focus:ring-2 focus:outline-none lg:hidden"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Sidepanel menú móvil */}
        {open && (
          <div className="fixed inset-0 z-50 flex bg-black/60">
            <div className="animate-slide-in relative flex h-full w-full max-w-none flex-col items-center justify-center bg-white p-6 shadow-lg dark:bg-gray-950">
              <button
                className="focus:ring-primary-500 absolute top-6 right-6 z-10 rounded p-2 focus:ring-2 focus:outline-none"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <Close className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </button>
              <nav className="mt-12 flex w-full flex-col items-center gap-8 text-xl">
                <SearchBar className="w-full max-w-xs" />
                {navLinks.map((link) => (
                  <CustomLink
                    key={link.title}
                    href={link.href}
                    className="rounded px-2 py-2 font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    {link.title}
                  </CustomLink>
                ))}
                <div className="mt-4">
                  <PublishDropdown isMobile={true} />
                </div>
              </nav>
              <div className="mt-12 flex gap-8">
                {socialLinks.map((link) =>
                  link.href ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
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
      {/* Animación para el sidepanel */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </header>
  )
}

export default TranstextosHeader
