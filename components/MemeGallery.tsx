'use client'

import { useState } from 'react'
import MemeCard from './cards/MemeCard'
import Image from './Image'
import { X, Download } from 'lucide-react'
import type { MemeItem } from '@/types/meme'

interface MemeGalleryProps {
  items: MemeItem[]
}

export default function MemeGallery({ items }: MemeGalleryProps) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<MemeItem | null>(null)

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      // Extraer el nombre del archivo de la URL
      const filename = url.split('/').pop() || 'meme.jpg'
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full my-8 max-h-full overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 z-10 bg-white dark:bg-gray-800 rounded-full p-1"
              onClick={() => setSelected(null)}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded mb-4 p-4" style={{ height: '200px' }}>
              <Image
                src={selected.image}
                alt={selected.title || ''}
                className="max-w-full max-h-full object-contain"
                width={400}
                height={200}
              />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">{selected.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{selected.description}</p>
            
            <button
              onClick={() => handleDownload(selected.image)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{selected.title?.toLowerCase().includes('download') || window.location.pathname.startsWith('/en') ? 'Download' : 'Descargar'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
