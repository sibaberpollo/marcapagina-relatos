'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ChronologicalView from '@/components/ChronologicalView'
import { ThumbsUp, Bookmark } from 'lucide-react'

type TabKey = 'favorites' | 'likes' | 'read'

type Props = {
  favorites: any[]
  likes: any[]
  read: any[]
  initialTab?: TabKey
}

export default function BibliotecaTabs({
  favorites,
  likes,
  read,
  initialTab = 'favorites',
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [tab, setTab] = useState<TabKey>(initialTab)

  useEffect(() => {
    const t = searchParams.get('tab') as TabKey | null
    if (t && ['favorites', 'likes', 'read'].includes(t)) setTab(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function select(next: TabKey) {
    setTab(next)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const items = tab === 'favorites' ? favorites : tab === 'likes' ? likes : read
  const title =
    tab === 'favorites' ? 'Tus favoritos' : tab === 'likes' ? 'Los que te gustaron' : 'Leídos'

  const btnBase =
    'px-3 py-1.5 rounded border text-sm transition-colors inline-flex items-center gap-2'
  const btnSelected = 'bg-black text-white border-black'
  const btnUnselected = 'bg-white text-gray-900 border-black hover:bg-gray-100'

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => select('favorites')}
          className={`${btnBase} ${tab === 'favorites' ? btnSelected : btnUnselected}`}
        >
          <div className="relative inline-flex">
            <ThumbsUp className="h-4 w-4" />
            <ThumbsUp className="-ml-1 h-3 w-3" />
          </div>
          <span>Tus favoritos</span>
        </button>
        <button
          onClick={() => select('likes')}
          className={`${btnBase} ${tab === 'likes' ? btnSelected : btnUnselected}`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>Los que te gustaron</span>
        </button>
        <button
          onClick={() => select('read')}
          className={`${btnBase} ${tab === 'read' ? btnSelected : btnUnselected}`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Leídos</span>
        </button>
      </div>
      <h3 className="font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">No hay elementos en esta sección.</p>
      ) : (
        <ChronologicalView
          items={items}
          itemsPerPage={10}
          currentPage={1}
          basePath="/biblioteca-personal"
        />
      )}
    </div>
  )
}
