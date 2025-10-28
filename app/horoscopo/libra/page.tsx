import { genPageMetadata } from 'app/seo'
import HoroscopoClient from '../HoroscopoClient'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Libra - Oscar Wilde: Octubre 2025',
    description:
      'Horóscopo literario de Libra con Oscar Wilde. Predicciones astrológicas absurdas, efemérides literarias y tarot con elegancia narrativa.',
    openGraph: {
      images: [
        {
          url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1760000000/Oscar-Wilde-Libra_placeholder.png',
          width: 1200,
          height: 630,
          alt: 'Horóscopo Literario Libra - Oscar Wilde octubre 2025',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [
        'https://res.cloudinary.com/dx98vnos1/image/upload/v1760000000/Oscar-Wilde-Libra_placeholder.png',
      ],
    },
  })
}

export default function HoroscopoLibraPage() {
  return <HoroscopoClient signo="libra" />
}
