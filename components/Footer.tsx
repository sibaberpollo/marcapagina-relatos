'use client';

import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from './social-icons'
import HighlightStroke from './HighlightStroke'
import { useTheme } from 'next-themes'

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';

  return (
    <footer className="mb-20">    
      <div className="mt-12 mb-8 flex flex-col items-center md:flex-row">
        <div className="flex w-full justify-center">
          {/* PublishBanner removido */}
        </div>
      </div>

      <div className="mt-12 mb-8 flex flex-col items-center md:flex-row">
        <div className="flex w-full justify-center">
          {isDarkTheme ? (
            // En modo oscuro: sin HighlightStroke 
            <div className="flex gap-4">
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
              <SocialIcon kind="sanity" href={siteMetadata.sanity} size={6} />
              <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
              <SocialIcon kind="spotify" href={siteMetadata.spotify} size={6} />
              <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
              <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
              <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
              <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
            </div>
          ) : (
            // En modo claro: con HighlightStroke como estaba originalmente
            <HighlightStroke>
              <div className="flex gap-4">
                <SocialIcon kind="github" href={siteMetadata.github} size={5} />
                <SocialIcon kind="sanity" href={siteMetadata.sanity} size={6} />
                <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
                <SocialIcon kind="spotify" href={siteMetadata.spotify} size={6} />
                <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
                <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
                <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
                <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
              </div>
            </HighlightStroke>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="mb-3 flex flex-col items-center space-y-2 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
          <Link href="/">{siteMetadata.title}</Link>
          <Link href="/acerca-de">Acerca de</Link>
          <Link href="/publica">Publica</Link>
          <Link href="/criterios-editoriales">Criterios editoriales</Link>
        </div>
        <div className="mb-2 flex flex-col items-center text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:space-x-2">
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
