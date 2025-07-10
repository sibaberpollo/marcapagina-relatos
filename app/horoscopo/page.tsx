import { genPageMetadata } from 'app/seo'
import HoroscopoClient from './HoroscopoClient'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Literario | MarcaPágina',
    description: 'Descubre tu horóscopo literario personalizado. Predicciones astrológicas con un toque narrativo único en MarcaPágina.',
  })
}

export default function HoroscopoPage() {
  return <HoroscopoClient />
} 