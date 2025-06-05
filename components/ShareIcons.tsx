'use client'

import { Facebook, Twitter, MessageCircle, Copy } from 'lucide-react'
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
  const [hoverX, setHoverX] = useState(false)
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
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Comparte ❤️
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
          aria-label="X"
          onMouseEnter={() => setHoverX(true)}
          onMouseLeave={() => setHoverX(false)}
        >
          {hoverX ? (
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-black dark:text-white">
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
