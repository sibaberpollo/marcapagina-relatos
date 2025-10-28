import { genPageMetadata } from 'app/seo'
import HoroscopoClient from '../HoroscopoClient'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Escorpio - Patricia Highsmith: Noviembre 2025',
    description:
      'Horóscopo literario de Escorpio con Patricia Highsmith. Predicciones astrológicas absurdas, efemérides literarias y tarot con intensidad narrativa.',
    openGraph: {
      images: [
        {
          url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1760000000/Patricia-Highsmith_escorpio.png',
          width: 1200,
          height: 630,
          alt: 'Horóscopo Literario Escorpio - Patricia Highsmith noviembre 2025',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [
        'https://res.cloudinary.com/dx98vnos1/image/upload/v1760000000/Patricia-Highsmith_escorpio.png',
      ],
    },
  })
}

export default function HoroscopoEscorpioPage() {
  return <HoroscopoClient signo="escorpio" />
}
