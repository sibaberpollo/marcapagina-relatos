import { genPageMetadata } from 'app/seo'
import HoroscopoClient from '../HoroscopoClient'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Virgo - Agatha Christie: Archivo Septiembre 2025',
    description:
      'Horóscopo literario de Virgo con Agatha Christie. Archivo del mes de septiembre 2025 con predicciones astrológicas y contenido narrativo.',
    openGraph: {
      images: [
        {
          url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1755780888/Agatha-Christie_lzxfnz.png',
          width: 1200,
          height: 630,
          alt: 'Horóscopo Literario Virgo - Agatha Christie archivo septiembre 2025',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [
        'https://res.cloudinary.com/dx98vnos1/image/upload/v1755780888/Agatha-Christie_lzxfnz.png',
      ],
    },
  })
}

export default function HoroscopoVirgoPage() {
  return <HoroscopoClient signo="virgo" />
}
