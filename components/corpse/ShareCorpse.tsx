'use client'

import * as React from 'react'
import { Facebook, MessageCircle, Copy, Share2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  isWebShareSupported,
  shareViaWebAPI,
  generateCorpseShareText,
  shareCorpseToFacebook,
  shareCorpseToTwitter,
  shareCorpseToWhatsApp,
  copyCorpseUrl,
} from '@/lib/socialSharing'

interface ShareCorpseProps {
  corpseId: string
  title: string
  contributors: string[]
  className?: string
}

export function ShareCorpse({ corpseId, title, contributors, className = '' }: ShareCorpseProps) {
  const [showTwitterBird, setShowTwitterBird] = React.useState(false)
  const [isSharing, setIsSharing] = React.useState(false)

  const slug = `corpse-${corpseId}`
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/micronarrativas/${corpseId}/completa`
      : ''
  const shareText = generateCorpseShareText({ title, contributors })

  const handleWebShare = async () => {
    setIsSharing(true)
    try {
      const success = await shareViaWebAPI({
        title: `Micronarrativa: ${title}`,
        text: shareText,
        url: baseUrl,
      })
      if (!success) {
        // Fallback to copy if Web Share fails
        await copyCorpseUrl(baseUrl, slug)
      }
    } catch (error) {
      console.error('Web Share failed:', error)
      await copyCorpseUrl(baseUrl, slug)
    } finally {
      setIsSharing(false)
    }
  }

  const handleFacebookShare = () => {
    shareCorpseToFacebook(title, baseUrl, slug)
  }

  const handleTwitterShare = () => {
    shareCorpseToTwitter(title, shareText, baseUrl, slug)
  }

  const handleWhatsAppShare = () => {
    shareCorpseToWhatsApp(shareText, baseUrl, slug)
  }

  const handleCopyLink = async () => {
    await copyCorpseUrl(baseUrl, slug)
  }

  return (
    <div className={`${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-small flex items-center gap-1 text-center text-sm text-gray-500 dark:text-gray-300">
          COMPARTE ESTA MICRONARRATIVA{' '}
          <Heart
            className="h-4 w-4 stroke-current text-gray-500 dark:text-gray-300"
            strokeWidth={1.5}
          />
        </p>
        {isWebShareSupported() && (
          <Button
            onClick={handleWebShare}
            disabled={isSharing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            aria-label="Compartir nativo"
          >
            <Share2 className="h-4 w-4" />
            {isSharing ? 'Compartiendo...' : 'Compartir'}
          </Button>
        )}
      </div>

      <div className="flex justify-around gap-6">
        <button
          onClick={handleFacebookShare}
          className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Compartir en Facebook"
        >
          <Facebook className="h-5 w-5 text-[#1877F2]" />
        </button>
        <button
          onClick={handleTwitterShare}
          className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Compartir en Twitter"
          onMouseEnter={() => setShowTwitterBird(true)}
          onMouseLeave={() => setShowTwitterBird(false)}
        >
          {showTwitterBird ? (
            // Icono clásico del pajarito de Twitter
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1DA1F2]">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          ) : (
            // Icono de X (como en el header)
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current text-gray-700 dark:text-gray-300"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
        </button>
        <button
          onClick={handleWhatsAppShare}
          className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Compartir en WhatsApp"
        >
          <MessageCircle className="h-5 w-5 text-[#25D366]" />
        </button>
        <button
          onClick={handleCopyLink}
          className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Copiar enlace"
        >
          <Copy className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Comparte esta historia colaborativa con amigos
        </p>
      </div>
    </div>
  )
}
