'use client'

import ImageOverlayCard from './ImageOverlayCard'

interface MasonryImageOverlayCardProps {
  image: string
  title?: string
  description?: string
  href?: string
  tags?: string[]
  overlayText?: string
}

export default function MasonryImageOverlayCard(props: MasonryImageOverlayCardProps) {
  return (
    <div className="break-inside-avoid mb-4 h-full">
      <div className="h-full">
        <ImageOverlayCard {...props} />
      </div>
    </div>
  )
} 