'use client';

import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from './social-icons'
import HighlightStroke from './HighlightStroke'
import PublishBanner from './PublishBanner'
import { useTheme } from 'next-themes'
import { 
  Github, 
  Sanity, 
  Instagram, 
  Bluesky, 
  Threads, 
  Twitter 
} from './social-icons/icons'

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';

  // Componente personalizado para mostrar iconos en modo oscuro
  const SocialIconDark = ({ kind, href, size = 6 }) => {
    if (!href) return null;
    
    const iconComponents = {
      github: Github,
      sanity: Sanity,
      instagram: Instagram,
      bluesky: Bluesky,
      threads: Threads,
      twitter: Twitter
    };
    
    const IconComponent = iconComponents[kind];
    if (!IconComponent) return null;
    
    return (
      <a
        className="text-sm transition"
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        <span className="sr-only">{kind}</span>
        <IconComponent className={`fill-current text-white h-${size} w-${size}`} />
      </a>
    );
  };

  return (
    <footer className="mb-20">    
      <div className="mt-12 mb-8 flex flex-col items-center md:flex-row">
        <div className="flex w-full justify-center">
          <PublishBanner />
        </div>
      </div>

      <div className="mt-12 mb-8 flex flex-col items-center md:flex-row">
        <div className="flex w-full justify-center">
          {isDarkTheme ? (
            // En modo oscuro: sin HighlightStroke y todos los iconos en blanco
            <div className="flex gap-4">
              <SocialIconDark kind="github" href={siteMetadata.github} size={5} />
              <SocialIconDark kind="sanity" href={siteMetadata.sanity} size={6} />
              <SocialIconDark kind="instagram" href={siteMetadata.instagram} size={6} />
              <SocialIconDark kind="bluesky" href={siteMetadata.bluesky} size={6} />
              <SocialIconDark kind="threads" href={siteMetadata.threads} size={6} />
              <SocialIconDark kind="twitter" href={siteMetadata.twitter} size={6} />
            </div>
          ) : (
            // En modo claro: con HighlightStroke como estaba originalmente
            <HighlightStroke>
              <div className="flex gap-4">
                <SocialIcon kind="github" href={siteMetadata.github} size={5} />
                <SocialIcon kind="sanity" href={siteMetadata.sanity} size={6} />
                <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
                <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
                <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
                <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
              </div>
            </HighlightStroke>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <Link href="/">{siteMetadata.title}</Link>
          <Link href="/acerca-de">Acerca de</Link>
          <Link href="/publica">Publica</Link>
          <Link href="/criterios-editoriales">Criterios editoriales</Link>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
