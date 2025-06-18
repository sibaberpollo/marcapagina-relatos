'use client'

import Image from './Image'
import { Image as ImageIcon, Download, ShoppingCart } from 'lucide-react'
import { MemeItem } from '@/types/meme'

interface MemeCardProps {
  item: MemeItem
  onClick: () => void
}

export default function MemeCard({ item, onClick }: MemeCardProps) {
  const icon =
    item.type === 'meme' ? (
      <ImageIcon className="w-4 h-4" />
    ) : item.type === 'descarga' || item.type === 'download' ? (
      <Download className="w-4 h-4" />
    ) : (
      <ShoppingCart className="w-4 h-4" />
    )

  return (
    <button
      onClick={onClick}
      className="group block w-full text-left break-inside-avoid" 
    >
      <div className="overflow-hidden rounded-lg">
        <Image
          src={item.image}
          alt={item.title || ''}
          className="w-full h-auto"
          width={600}
          height={400}
        />
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="flex items-center gap-1 font-semibold">
          {icon}
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>
    </button>
  )
}
