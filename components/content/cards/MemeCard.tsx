'use client'

import Image from '../../common/Image'
import { Image as ImageIcon, Download, ShoppingCart } from 'lucide-react'
import { MemeItem } from '@/types/meme'

interface MemeCardProps {
  item: MemeItem
  onClick: () => void
}

export default function MemeCard({ item, onClick }: MemeCardProps) {
  const icon =
    item.type === 'meme' ? (
      <ImageIcon className="h-4 w-4" />
    ) : item.type === 'descarga' || item.type === 'download' ? (
      <Download className="h-4 w-4" />
    ) : (
      <ShoppingCart className="h-4 w-4" />
    )

  return (
    <button onClick={onClick} className="group block w-full break-inside-avoid text-left">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={item.image}
          alt={item.title || ''}
          className="h-auto w-full"
          width={600}
          height={400}
        />
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="flex items-center gap-1 font-semibold">
          {icon}
          {item.title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{item.description}</p>
      </div>
    </button>
  )
}
