'use client'

import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo.svg'
import CustomLink from '../common/Link'
import UserMenu from '../auth/UserMenu'
import SearchBar from '../search/SearchBar'
import PublishDropdown from '../content/publishing/PublishDropdown'
import { useState, type ReactNode } from 'react'
import { Menu, X as Close, Instagram, Facebook, Twitter } from 'lucide-react'

const topLinks = [
  { title: 'Autores', href: '/autores' },
  { title: 'Horóscopo', href: '/horoscopo' },
  { title: 'Memes & objetos', href: '/memes-merch-descargas' },
  { title: 'Playlist', href: '/playlist' },
  { title: 'Acerca de', href: '/acerca-de' },
  { title: 'Contacto', href: '/contacto' },
]

const Header = () => {
  const [open, setOpen] = useState(false)
  const socialLinks = [
    { href: siteMetadata.instagram, label: 'Instagram', icon: <Instagram className="h-5 w-5" /> },
    {
      href: siteMetadata.twitter || siteMetadata.x,
      label: 'X',
      icon: <Twitter className="h-5 w-5" />,
    },
    { href: siteMetadata.facebook, label: 'Facebook', icon: <Facebook className="h-5 w-5" /> },
  ].filter((s) => Boolean(s.href)) as { href: string; label: string; icon: ReactNode }[]
  return (
    <header className="relative z-30 w-full">
      {/* Top bar: mobile amarillo con texto negro; desktop negro con texto amarillo */}
      <div className="w-full bg-[var(--color-accent)] md:bg-black">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-2 sm:px-8">
          {/* Mobile hamburger (restaurado) */}
          <button
            className="rounded p-2 focus:ring-2 focus:ring-black focus:outline-none md:hidden"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5 text-black" />
          </button>

          <nav className="no-scrollbar flex-1 overflow-x-auto">
            {/* Logo centrado solo en móvil */}
            <div className="flex justify-center md:hidden">
              <CustomLink
                href="/"
                aria-label={siteMetadata.headerTitle}
                className="decoration-none"
              >
                <Logo className="h-7 w-auto fill-black" />
              </CustomLink>
            </div>
            <ul className="hidden items-center gap-4 py-2 whitespace-nowrap sm:gap-6 md:flex">
              {topLinks.map((l) => (
                <li key={l.title}>
                  <CustomLink
                    href={l.href}
                    className="text-sm tracking-wide text-black uppercase hover:underline md:text-[var(--color-accent)]"
                  >
                    {l.title}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </nav>
          {/* ocultamos buscador y CTA en móvil; se mantienen en desktop */}
          <div className="hidden w-full max-w-xs md:block">
            <SearchBar variant="topbar" />
          </div>
          <div className="ml-1 hidden md:flex">
            <PublishDropdown isMobile={false} />
          </div>
          <div className="ml-2 shrink-0">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Logo centrado sobre fondo amarillo del tema (solo desktop para no empujar contenido en móvil) */}
      <div className="hidden w-full bg-[var(--color-accent)] md:block">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-center py-6">
          <CustomLink href="/" aria-label={siteMetadata.headerTitle} className="decoration-none">
            <Logo className="h-10 w-auto fill-black" />
          </CustomLink>
        </div>
      </div>

      {/* Sidepanel móvil: enlaces, buscador, CTA y redes */}
      {open && (
        <div className="fixed inset-0 z-50 flex bg-black/60 md:hidden">
          <div className="animate-slide-in relative flex h-full w-5/6 max-w-sm flex-col overflow-y-auto bg-[var(--color-accent)] text-black shadow-lg">
            <button
              className="absolute top-4 right-4 rounded p-2 focus:ring-2 focus:ring-black focus:outline-none"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            >
              <Close className="h-6 w-6" />
            </button>
            <div className="border-b border-black/20 px-4 pt-14 pb-6">
              <SearchBar variant="topbar" />
            </div>
            <nav className="flex-1 px-2 py-4">
              <ul className="space-y-1">
                {topLinks.map((l) => (
                  <li key={l.title}>
                    <CustomLink
                      href={l.href}
                      className="block rounded-md px-3 py-3 text-base font-medium hover:bg-black/10"
                      onClick={() => setOpen(false)}
                    >
                      {l.title}
                    </CustomLink>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <PublishDropdown isMobile={true} />
              </div>
              {socialLinks.length > 0 && (
                <div className="mt-6 px-2">
                  <div className="mb-2 text-xs tracking-wide uppercase">Síguenos</div>
                  <div className="flex items-center gap-4">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="rounded-full bg-black p-2 text-[var(--color-accent)] hover:brightness-110"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Animación para sidepanel */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
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

export default Header
