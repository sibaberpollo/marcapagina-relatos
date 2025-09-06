'use client'

import { Search } from 'lucide-react'

type Props = {
  className?: string
  variant?: 'default' | 'topbar'
}

export default function SearchBar({ className = '', variant = 'default' }: Props) {
  const base =
    variant === 'topbar'
      ? 'w-full rounded-full pl-3 pr-8 py-1.5 text-sm bg-transparent md:border border-[var(--color-accent)] md:text-[var(--color-accent)] text-black placeholder-black/60 md:placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]'
      : 'w-full border border-black rounded pl-3 pr-8 py-1 text-sm focus:outline-none'

  const iconColor =
    variant === 'topbar' ? 'md:text-[var(--color-accent)] text-black' : 'text-gray-600'

  return (
    <form action="/resultados" method="get" className={`relative ${className}`}>
      <input type="text" name="q" placeholder="Buscar..." className={base} />
      <Search
        className={`pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 ${iconColor}`}
      />
    </form>
  )
}
