import { genPageMetadata } from 'app/seo'
import HoroscopoClient from '../HoroscopoClient'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Cáncer - Franz Kafka: Archivo Julio 2025',
    description: 'Horóscopo literario de Cáncer con Franz Kafka. Archivo del mes de julio 2025 con predicciones astrológicas y contenido narrativo.',
    openGraph: {
      images: [
        {
          url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1752500593/horoscopo-cancer_kfnera.jpg',
          width: 1200,
          height: 630,
          alt: 'Horóscopo Literario Cáncer - Franz Kafka archivo julio 2025',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1752500593/horoscopo-cancer_kfnera.jpg'],
    },
  })
}

export default function HoroscopoCancerPage() {
  return <HoroscopoClient signo="cancer" />
} 