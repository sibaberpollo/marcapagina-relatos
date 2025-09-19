'use client'

import { useState } from 'react'
import MemeCard from '../../content/cards/MemeCard'
import Image from '../../common/Image'
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
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded border px-3 py-1 text-sm ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
        >
          Todos
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`rounded border px-3 py-1 text-sm ${filter === tag ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
        {filtered.map((item) => (
          <MemeCard key={item.id} item={item} onClick={() => setSelected(item)} />
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSelected(null)} />
          <div className="relative my-8 max-h-full w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <button
              className="absolute top-2 right-2 z-10 rounded-full bg-white p-1 text-gray-600 hover:text-gray-800 dark:bg-gray-800"
              onClick={() => setSelected(null)}
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="mb-4 flex items-center justify-center rounded bg-gray-50 p-4 dark:bg-gray-700"
              style={{ height: '200px' }}
            >
              <Image
                src={selected.image}
                alt={selected.title || ''}
                className="max-h-full max-w-full object-contain"
                width={400}
                height={200}
              />
            </div>

            <h2 className="mb-2 text-xl font-semibold">{selected.title}</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{selected.description}</p>

            <button
              onClick={() => handleDownload(selected.image)}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <Download className="h-4 w-4" />
              <span>
                {selected.title?.toLowerCase().includes('download') ||
                window.location.pathname.startsWith('/en')
                  ? 'Download'
                  : 'Descargar'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
