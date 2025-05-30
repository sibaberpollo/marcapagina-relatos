import { getAllAutores } from '@/lib/sanity'
import { genPageMetadata } from 'app/seo'
import AutoresClient from './AutoresClient'

export const metadata = genPageMetadata({
  title: 'Autores | MarcaPágina',
  description:
    'Conoce a los autores de MarcaPágina. Una comunidad de escritores emergentes de América Latina que comparten relatos, microcuentos y artículos de narrativa contemporánea.',
})

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AutoresPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filter = (params.filter as string) || 'todos'
  const allAutores = await getAllAutores()
  
  return <AutoresClient initialAutores={allAutores} filter={filter} />
} 