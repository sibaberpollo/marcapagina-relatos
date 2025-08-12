'use client';

import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from './social-icons'
import HighlightStroke from './HighlightStroke'
import PublishBanner from './PublishBanner'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';
  const pathname = usePathname();
  if (pathname.startsWith('/biblioteca-personal')) return null

  return (
    <footer className="w-full bg-primary-500 dark:bg-primary-400 mt-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Banner de publicación */}
        <div className="pt-12 pb-8 flex flex-col items-center md:flex-row">
          <div className="flex w-full justify-center">
            <PublishBanner />
          </div>
        </div>

        {/* Redes sociales */}
        <div className="pb-8 flex flex-col items-center md:flex-row">
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

        {/* Links de navegación y copyright */}
        <div className="pb-12 flex flex-col items-center">
          <div className="mb-3 flex flex-col items-center space-y-2 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
            <Link href="/" className="text-gray-900 hover:text-gray-700">{siteMetadata.title}</Link>
            <Link href="/acerca-de" className="text-gray-900 hover:text-gray-700">Acerca de</Link>
            <Link href="/publica" className="text-gray-900 hover:text-gray-700">Publica</Link>
            <Link href="/criterios-editoriales" className="text-gray-900 hover:text-gray-700">Criterios editoriales</Link>
          </div>
          <div className="mb-2 flex flex-col items-center text-sm text-gray-700 sm:flex-row sm:space-x-2">
            <div>{`© ${new Date().getFullYear()}`}</div>
            <div>{` • `}</div>
            <Link href="/" className="text-gray-700 hover:text-gray-600">{siteMetadata.title}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
