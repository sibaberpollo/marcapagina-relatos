'use client'

import { useState, useEffect } from 'react'
import SectionContainer from '@/components/SectionContainer'
import AutoAvatar from '@/components/AutoAvatar'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

// Componente para mostrar un autor individual
function AutorCard({ autor }: { autor: any }) {
  return (
    <Link
      href={`/autor/${autor.slug.current}`}
      className="group flex flex-col items-center p-2 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 hover:shadow-md dark:hover:shadow-lg"
    >
      <div className="mb-2 sm:mb-3">
        {autor.avatar ? (
          <Image
            src={autor.avatar}
            alt={autor.name}
            width={60}
            height={60}
            className="rounded-full w-12 h-12 sm:w-16 sm:h-16"
          />
        ) : (
          <AutoAvatar
            name={autor.name}
            size={60}
            className="rounded-full bg-black text-white font-titles text-lg sm:text-xl flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16"
          />
        )}
      </div>
      <h2 className="text-sm sm:text-base font-semibold text-center text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {autor.name}
      </h2>
      {autor.occupation && (
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mt-0.5 sm:mt-1">
          {autor.occupation}
        </p>
      )}
    </Link>
  )
}

// Componente para los filtros
function AuthorFilters({ currentFilter, onLetterFilter, currentLetter }: { currentFilter: string, onLetterFilter: (letter: string) => void, currentLetter: string | null }) {
  const filters = [
    { label: 'Todos los autores', value: 'todos' },
    { label: 'Transtextos', value: 'transtextos' }
  ]

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === 'todos' ? '/autores' : `/autores?filter=${filter.value}`}
            className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
              currentFilter === filter.value
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-1 justify-start mt-5">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => onLetterFilter(letter)}
            className={`w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-sm font-medium transition-colors ${
              currentLetter === letter ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : ''
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  )
}

interface AutoresClientProps {
  initialAutores: any[]
  filter: string
}

export default function AutoresClient({ initialAutores, filter }: AutoresClientProps) {
  const [autores, setAutores] = useState<any[]>(initialAutores)
  const [filteredAutores, setFilteredAutores] = useState<any[]>(initialAutores)
  const [currentLetter, setCurrentLetter] = useState<string | null>(null)

  useEffect(() => {
    const filtered = filter === 'transtextos' 
      ? initialAutores.filter(autor => autor.sitios && autor.sitios.includes('Transtextos'))
      : initialAutores
    
    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))
    setAutores(sorted)
    setFilteredAutores(sorted)
  }, [filter, initialAutores])

  // Función para filtrar por letra inicial
  const filterByLetter = (letter: string) => {
    if (currentLetter === letter) {
      // Si se hace clic en la misma letra, mostrar todos
      setCurrentLetter(null)
      setFilteredAutores(autores)
    } else {
      setCurrentLetter(letter)
      const filtered = autores.filter(autor => 
        autor.name.toUpperCase().startsWith(letter)
      )
      setFilteredAutores(filtered)
    }
  }
  
  return (
    <SectionContainer>
      <div className="space-y-2 pt-6 pb-4 md:space-y-5">
        <h1
          className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-50 
                    sm:text-3xl sm:leading-9 md:text-5xl md:leading-12"
        >
          Autores
        </h1>
        <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
          Conoce a los <strong>autores</strong> de nuestra comunidad. Escritores emergentes de América Latina que comparten sus relatos, microcuentos y reflexiones sobre narrativa contemporánea.
        </p>
      </div>
      
      {/* Filtros */}
      <AuthorFilters 
        currentFilter={filter} 
        onLetterFilter={filterByLetter}
        currentLetter={currentLetter}
      />
      
      {/* Grid de autores */}
      <Suspense fallback={<div className="p-4 text-center">Cargando autores...</div>}>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 mt-8">
          {filteredAutores.map((autor) => (
            <AutorCard key={autor.slug.current} autor={autor} />
          ))}
        </div>
        
        {filteredAutores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron autores con el filtro seleccionado.
            </p>
          </div>
        )}
      </Suspense>
    </SectionContainer>
  )
} 