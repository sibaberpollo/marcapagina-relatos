import { genPageMetadata } from 'app/seo'
import HoroscopoClient from './HoroscopoClient'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Leo - H.P. Lovecraft: Agosto 2025',
    description: 'Horóscopo literario de Leo con H.P. Lovecraft. Predicciones astrológicas, efemérides y tarot con un toque narrativo único.',
    openGraph: {
      images: [
        {
          url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1753187282/shared_leo_agnjl6.jpg',
          width: 1200,
          height: 630,
          alt: 'Horóscopo Literario Leo - H.P. Lovecraft agosto 2025',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1753187282/shared_leo_agnjl6.jpg'],
    },
  })
}

export default function HoroscopoPage() {
  return <HoroscopoClient />
} 