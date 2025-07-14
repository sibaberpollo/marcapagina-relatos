"use client";

import siteMetadata from '@/data/siteMetadata'
import Logo from '@/data/logo.svg'
import CustomLink from './Link'
import {
  Instagram,
  Menu,
  X as Close,
  Rss,
  ChevronDown,
  Facebook,
} from 'lucide-react'
import SearchBar from './SearchBar'
import SocialDropdown from './SocialDropdown'
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
    href: siteMetadata.twitter,
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: siteMetadata.facebook,
    label: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
  },
];

const navLinks = [
  {
    title: 'Autores',
    href: '/autores',
  },
];

const explorationLinks = [
  { title: 'Horóscopo literario', href: '/horoscopo' },
  { title: 'Memes & objetos', href: '/memes-merch-descargas' },
  { title: 'Playlist', href: '/playlist' },
];

const projectLinks = [
  { title: 'Acerca de', href: '/acerca-de' },
  { title: 'Prensa', href: '/acerca-de#prensa' },
  { title: 'Contacto', href: '/contacto' },
];

const ExplorationDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded transition-colors"
        >
          Exploraciones
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-gray-950 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
            {explorationLinks.map((link) => (
              <CustomLink
                key={link.title}
                href={link.href}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </CustomLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded transition-colors">
        Exploraciones
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-gray-950 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {explorationLinks.map((link) => (
          <CustomLink
            key={link.title}
            href={link.href}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {link.title}
          </CustomLink>
        ))}
      </div>
    </div>
  )
}

const ProjectDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded transition-colors"
        >
          El proyecto
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-950 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
            {projectLinks.map((link) => (
              <CustomLink
                key={link.title}
                href={link.href}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </CustomLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded transition-colors">
        El proyecto
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-950 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {projectLinks.map((link) => (
          <CustomLink
            key={link.title}
            href={link.href}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {link.title}
          </CustomLink>
        ))}
      </div>
    </div>
  )
}

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 relative z-30">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="flex items-center h-20 relative">
          {/* Logo y acciones */}
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-1 -mx-2 sm:mx-0 lg:mx-12 mt-0">
              <CustomLink href="/" aria-label={siteMetadata.headerTitle} className="decoration-none">
                <Logo className="h-6 w-auto fill-gray-900 dark:fill-white" />
              </CustomLink>
              <div className="hidden sm:block">
                <SocialDropdown />
              </div>
            </div>
            <div className="hidden lg:flex flex-grow justify-center px-4">
              <SearchBar className="w-full max-w-xs" />
            </div>
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
                  </span>
                </CustomLink>
              ))}
              <ExplorationDropdown />
              <ProjectDropdown />
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
              <div className="w-full max-w-none bg-white dark:bg-gray-950 h-full shadow-lg flex flex-col animate-slide-in relative overflow-y-auto">
                <button
                  className="absolute top-6 right-6 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
                  aria-label="Cerrar menú"
                  onClick={() => setOpen(false)}
                >
                  <Close className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
                <div className="flex-1 flex flex-col justify-center px-6 py-20 min-h-full">
                  <nav className="flex flex-col gap-6 text-xl items-center w-full">
                    <SearchBar className="w-full max-w-xs" />
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
                    <div className="flex flex-col items-center gap-3 mt-4">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Exploraciones</span>
                      {explorationLinks.map((link) => (
                        <CustomLink
                          key={link.title}
                          href={link.href}
                          className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-2 py-2 rounded transition-colors text-lg"
                          onClick={() => setOpen(false)}
                        >
                          {link.title}
                        </CustomLink>
                      ))}
                    </div>
                    <div className="flex flex-col items-center gap-3 mt-4">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Sobre el proyecto</span>
                      {projectLinks.map((link) => (
                        <CustomLink
                          key={link.title}
                          href={link.href}
                          className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 px-2 py-2 rounded transition-colors text-lg"
                          onClick={() => setOpen(false)}
                        >
                          {link.title}
                        </CustomLink>
                      ))}
                    </div>
                  </nav>
                  <div className="flex gap-6 justify-center mt-8">
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
