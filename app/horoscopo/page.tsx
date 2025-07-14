import { genPageMetadata } from 'app/seo'
import HoroscopoClient from './HoroscopoClient'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Literario | MarcaPágina',
    description: 'Descubre tu horóscopo literario personalizado. Predicciones astrológicas con un toque narrativo único en MarcaPágina.',
    openGraph: {
      images: [
        {
          url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1752500593/horoscopo-cancer_kfnera.jpg',
          width: 1200,
          height: 630,
          alt: 'Horóscopo Literario - Franz Kafka y predicciones astrológicas con toque narrativo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1752500593/horoscopo-cancer_kfnera.jpg'],
    },
  })
}

export default function HoroscopoPage() {
  return <HoroscopoClient />
} 