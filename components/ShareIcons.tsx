'use client'

import { Facebook, MessageCircle, Copy, Heart } from 'lucide-react'
import { useState } from 'react'

interface ShareIconsProps {
  title: string
  slug: string
  className?: string
}

function sendGAEvent({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: string | number
}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

function buildUTMUrl(source: string, slug: string): string {
  const baseUrl = window.location.href.split('?')[0] // Remove existing query params
  const utmParams = new URLSearchParams({
    utm_source: source,
    utm_medium: 'social',
    utm_campaign: 'relato-compartido',
    utm_content: slug
  })
  
  return `${baseUrl}?${utmParams.toString()}`
}

export default function ShareIcons({ title, slug, className = '' }: ShareIconsProps) {
  const [showTwitterBird, setShowTwitterBird] = useState(false)
  
  const shareFacebook = () => {
    const url = buildUTMUrl('facebook', slug)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
    sendGAEvent({ action: 'share_facebook', category: 'Share', label: slug })
  }

  const shareTwitter = () => {
    const url = buildUTMUrl('twitter', slug)
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
    sendGAEvent({ action: 'share_twitter', category: 'Share', label: slug })
  }

  const shareWhatsApp = () => {
    const url = buildUTMUrl('whatsapp', slug)
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer')
    sendGAEvent({ action: 'share_whatsapp', category: 'Share', label: slug })
  }

  const copyUrl = () => {
    const url = buildUTMUrl('copy', slug)
    navigator.clipboard.writeText(url)
    alert('Enlace copiado al portapapeles')
    sendGAEvent({ action: 'share_copy', category: 'Share', label: slug })
  }

  return (
    <div className={`${className}`}>
      <p className="text-center text-sm font-small text-gray-500 dark:text-gray-300 mb-3 flex items-center justify-center gap-1">
        COMPARTE <Heart className="w-4 h-4 stroke-current text-gray-500 dark:text-gray-300" strokeWidth={1.5} />
      </p>
      <div className="flex justify-around gap-4">
        <button
          onClick={shareFacebook}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Facebook"
        >
          <Facebook className="h-5 w-5 text-[#1877F2]" />
        </button>
        <button
          onClick={shareTwitter}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Twitter"
          onMouseEnter={() => setShowTwitterBird(true)}
          onMouseLeave={() => setShowTwitterBird(false)}
        >
          {showTwitterBird ? (
            // Icono clásico del pajarito de Twitter
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1DA1F2]">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          ) : (
            // Icono de X (como en el header)
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-gray-700 dark:text-gray-300">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
        </button>
        <button
          onClick={shareWhatsApp}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-5 w-5 text-[#25D366]" />
        </button>
        <button
          onClick={copyUrl}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Copiar"
        >
          <Copy className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
