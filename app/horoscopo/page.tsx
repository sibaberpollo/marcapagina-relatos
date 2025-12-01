import { genPageMetadata } from 'app/seo'
import HoroscopoClient from './HoroscopoClient'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Sagitario - Jane Austen: Diciembre 2025',
    description:
      'Horóscopo literario de Sagitario con Jane Austen. Predicciones filosóficas e irónicas, efemérides literarias de diciembre y lista de escritores Sagitario.',
    openGraph: {
      images: [
        {
          url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1764592800/jane_austen_sagitario_q5ssic.png',
          width: 1200,
          height: 630,
          alt: 'Horóscopo Literario Sagitario - Jane Austen diciembre 2025',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [
        'https://res.cloudinary.com/dx98vnos1/image/upload/v1764592800/jane_austen_sagitario_q5ssic.png',
      ],
    },
  })
}

export default function HoroscopoPage() {
  return <HoroscopoClient signo="sagitario" />
}
