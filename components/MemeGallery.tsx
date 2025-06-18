'use client'

import { useState } from 'react'
import MemeCard from './MemeCard'
import Image from './Image'
import { X } from 'lucide-react'
import type { MemeItem } from '@/types/meme'

interface MemeGalleryProps {
  items: MemeItem[]
}

export default function MemeGallery({ items }: MemeGalleryProps) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<MemeItem | null>(null)

  const tags = Array.from(new Set(items.flatMap((i) => i.tags)))
  const filtered = filter === 'all' ? items : items.filter((i) => i.tags.includes(filter))

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded border text-sm ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
        >
          Todos
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-3 py-1 rounded border text-sm ${filter === tag ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((item) => (
          <MemeCard key={item.id} item={item} onClick={() => setSelected(item)} />
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setSelected(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={selected.image}
              alt={selected.title || ''}
              className="w-full h-auto rounded mb-4"
              width={800}
              height={600}
            />
            <h2 className="text-xl font-semibold mb-2">{selected.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
