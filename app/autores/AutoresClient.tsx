'use client'

import { useState, useEffect } from 'react'
import SectionContainer from '@/components/layout/SectionContainer'
import AutoAvatar from '@/components/content/authors/AutoAvatar'
import Image from 'next/image'
import Link from 'next/link'
import AuthorCard from '@/components/content/authors/AuthorCard'
import { Suspense } from 'react'
import { useSession } from 'next-auth/react'

// Componente para mostrar un autor individual
function AutorCard({ autor }: { autor: any }) {
  return (
    <AuthorCard
      authorSlug={autor.slug.current}
      authorName={autor.name}
      authorImage={autor.avatar}
      href={`/autor/${autor.slug.current}`}
    />
  )
}

// Componente para los filtros
function AuthorFilters({
  currentFilter,
  onLetterFilter,
  currentLetter,
}: {
  currentFilter: string
  onLetterFilter: (letter: string) => void
  currentLetter: string | null
}) {
  const filters = [
    { label: 'Todos los autores', value: 'todos' },
    { label: 'Transtextos', value: 'transtextos' },
  ]

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === 'todos' ? '/autores' : `/autores?filter=${filter.value}`}
            className={`rounded-lg border px-4 py-2 transition-colors duration-200 ${
              currentFilter === filter.value
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-start gap-1">
        <button
          onClick={() => onLetterFilter('todos')}
          className={`flex h-8 items-center justify-center rounded-md border border-gray-300 px-2 text-sm font-medium transition-colors hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 ${
            currentLetter === null
              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
              : ''
          }`}
        >
          Todos
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => onLetterFilter(letter)}
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-sm font-medium transition-colors hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 ${
              currentLetter === letter
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                : ''
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
  const [filteredAutores, setFilteredAutores] = useState<any[]>([])
  const [currentLetter, setCurrentLetter] = useState<string | null>('A')
  const { data: session } = useSession()
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set())

  useEffect(() => {
    const filtered =
      filter === 'transtextos'
        ? initialAutores.filter((autor) => autor.sitios && autor.sitios.includes('Transtextos'))
        : initialAutores

    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))
    setAutores(sorted)

    // Filtrar por la letra 'A' al inicio
    const filteredByA = sorted.filter((autor) => autor.name.toUpperCase().startsWith('A'))
    setFilteredAutores(filteredByA)
  }, [filter, initialAutores])

  // Cargar follows UNA sola vez para la grilla cuando hay sesión
  useEffect(() => {
    let mounted = true
    if (session?.user?.email) {
      fetch('/api/follow', { cache: 'no-store' })
        .then((r) => r.json())
        .then((data) => {
          if (!mounted) return
          const set = new Set<string>((data?.follows || []).map((f: any) => f.authorSlug))
          setFollowingSet(set)
        })
        .catch(() => {})
    } else {
      setFollowingSet(new Set())
    }
    return () => {
      mounted = false
    }
  }, [session?.user?.email])

  // Función para filtrar por letra inicial
  const filterByLetter = (letter: string) => {
    if (letter === 'todos') {
      // Mostrar todos los autores
      setCurrentLetter(null)
      setFilteredAutores(autores)
    } else if (currentLetter === letter) {
      // Si se hace clic en la misma letra, mostrar todos
      setCurrentLetter(null)
      setFilteredAutores(autores)
    } else {
      setCurrentLetter(letter)
      const filtered = autores.filter((autor) => autor.name.toUpperCase().startsWith(letter))
      setFilteredAutores(filtered)
    }
  }

  return (
    <SectionContainer>
      <div className="space-y-2 pt-6 pb-4 md:space-y-5">
        <h1 className="text-xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12 dark:text-gray-50">
          Autores
        </h1>
        <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
          Conoce a los <strong>autores</strong> de nuestra comunidad. Escritores emergentes de
          América Latina que comparten sus relatos, microcuentos y reflexiones sobre narrativa
          contemporánea.
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
        <div className="mt-8 grid grid-cols-3 gap-4 md:grid-cols-5 md:gap-6 lg:grid-cols-6">
          {filteredAutores.map((autor) => (
            <AuthorCard
              key={autor.slug.current}
              authorSlug={autor.slug.current}
              authorName={autor.name}
              authorImage={autor.avatar}
              href={`/autor/${autor.slug.current}`}
            />
          ))}
        </div>

        {filteredAutores.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron autores con el filtro seleccionado.
            </p>
          </div>
        )}
      </Suspense>
    </SectionContainer>
  )
}
