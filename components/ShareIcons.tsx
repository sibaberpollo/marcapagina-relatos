'use client'

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-[#1877F2]">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>
      <button
        onClick={shareTwitter}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Twitter"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-[#1DA1F2]">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </button>
      <button
        onClick={shareWhatsApp}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-[#25D366]">
          <path d="M17.472 14.614c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.671.15-.199.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.757-1.653-2.054-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.15-.174.199-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.671-1.611-.918-2.206-.242-.58-.487-.5-.671-.508-.173-.008-.372-.009-.571-.009-.199 0-.521.075-.795.373-.273.298-1.042 1.016-1.042 2.478 0 1.462 1.067 2.875 1.215 3.074.149.198 2.095 3.2 5.072 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.291.173-1.413-.074-.123-.272-.198-.57-.347zM11.997 1.929c-5.51 0-9.969 4.458-9.969 9.969a9.95 9.95 0 001.369 5.061L.939 22.154l5.348-2.811a9.96 9.96 0 005.71 1.653c5.51 0 9.97-4.459 9.97-9.97S17.508 1.929 11.997 1.929z" />
        </svg>
      </button>
      <button
        onClick={copyUrl}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Copiar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-gray-700">
          <path d="M16 1H4a1 1 0 00-1 1v14h2V3h11V1z" />
          <path d="M21 5H8a1 1 0 00-1 1v16a1 1 0 001 1h13a1 1 0 001-1V6a1 1 0 00-1-1zm-1 16H9V7h11v14z" />
        </svg>
      </button>
    </div>
  )
}
