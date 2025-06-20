"use client"

import { Search } from 'lucide-react'

export default function SearchBar({ className = '' }: { className?: string }) {
  return (
    <form action="/resultados" method="get" className={`relative ${className}`}> 
      <input
        type="text"
        name="q"
        placeholder="Buscar..."
        className="w-full border border-black bg-gray-100 rounded pl-3 pr-8 py-1 text-sm focus:outline-none"
      />
      <Search className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
    </form>
  )
}
