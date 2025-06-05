'use client'

import { Facebook, Twitter, MessageCircle, Copy } from 'lucide-react'

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

export default function ShareIcons({ title, slug, className = '' }: ShareIconsProps) {
  const shareFacebook = () => {
    const url = window.location.href
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
    sendGAEvent({ action: 'share_facebook', category: 'Share', label: slug })
  }

  const shareTwitter = () => {
    const url = window.location.href
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
    sendGAEvent({ action: 'share_twitter', category: 'Share', label: slug })
  }

  const shareWhatsApp = () => {
    const url = window.location.href
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer')
    sendGAEvent({ action: 'share_whatsapp', category: 'Share', label: slug })
  }

  const copyUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Enlace copiado al portapapeles')
    sendGAEvent({ action: 'share_copy', category: 'Share', label: slug })
  }

  return (
    <div className={`flex justify-around gap-4 ${className}`}>
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
      >
        <Twitter className="h-5 w-5 text-[#1DA1F2]" />
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
  )
}
