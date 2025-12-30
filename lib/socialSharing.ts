'use client'

// Inline GA event function since analytics lib may not be set up
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).gtag) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Utility to build UTM URL for social sharing
export function buildUTMUrl(source: string, slug: string, baseUrl?: string): string {
  const url = baseUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : '')
  const utmParams = new URLSearchParams({
    utm_source: source,
    utm_medium: 'social',
    utm_campaign: 'micronarrativa-compartida',
    utm_content: slug,
  })

  return `${url}?${utmParams.toString()}`
}

// Check if Web Share API is supported
export function isWebShareSupported(): boolean {
  return typeof window !== 'undefined' && 'share' in navigator
}

// Web Share API implementation
export async function shareViaWebAPI({
  title,
  text,
  url,
}: {
  title: string
  text: string
  url: string
}): Promise<boolean> {
  if (!isWebShareSupported()) {
    return false
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    })
    return true
  } catch (error) {
    // User cancelled or error occurred
    console.log('Web Share API error:', error)
    return false
  }
}

// Generate share text for corpse stories
export function generateCorpseShareText({
  title,
  contributors,
}: {
  title: string
  contributors: string[]
}): string {
  const contributorText =
    contributors.length <= 3
      ? contributors.join(', ')
      : `${contributors.slice(0, 3).join(', ')} y ${contributors.length - 3} más`

  return `¡Descubre esta micronarrativa colaborativa: "${title}" creada por ${contributorText} en MarcaPágina!`
}

// Social media share functions for corpses
export function shareCorpseToFacebook(title: string, url: string, slug: string) {
  const shareUrl = buildUTMUrl('facebook', slug, url)
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    '_blank',
    'noopener,noreferrer,width=600,height=400'
  )
  sendGAEvent({ action: 'share_corpse_facebook', category: 'Share', label: slug })
}

export function shareCorpseToTwitter(title: string, text: string, url: string, slug: string) {
  const shareUrl = buildUTMUrl('twitter', slug, url)
  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
    '_blank',
    'noopener,noreferrer,width=600,height=400'
  )
  sendGAEvent({ action: 'share_corpse_twitter', category: 'Share', label: slug })
}

export function shareCorpseToWhatsApp(text: string, url: string, slug: string) {
  const shareUrl = buildUTMUrl('whatsapp', slug, url)
  window.open(
    `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
    '_blank',
    'noopener,noreferrer'
  )
  sendGAEvent({ action: 'share_corpse_whatsapp', category: 'Share', label: slug })
}

export async function copyCorpseUrl(url: string, slug: string) {
  try {
    await navigator.clipboard.writeText(url)
    // Could show a toast here
    alert('Enlace copiado al portapapeles')
    sendGAEvent({ action: 'share_corpse_copy', category: 'Share', label: slug })
  } catch (error) {
    console.error('Error copying to clipboard:', error)
  }
}
