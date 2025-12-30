import { Metadata } from 'next'
import NuevaMicronarrativaClient from './client'

export const metadata: Metadata = {
  title: 'Crear Micronarrativa | MarcaPágina',
  description: 'Crea una nueva micronarrativa colaborativa con otros autores de MarcaPágina.',
}

export default function NuevaMicronarrativaPage() {
  return <NuevaMicronarrativaClient />
}
