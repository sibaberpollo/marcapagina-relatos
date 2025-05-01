// File: tailwind-nextjs-starter-blog/app/publica/page.tsx
import { genPageMetadata } from 'app/seo'
import PublicaClient from './PublicaClient'

export const metadata = genPageMetadata({
  title: 'Publica con nosotros',
  description:
    'Comparte tu relato con MarcaPagina: cuéntanos quién eres, tus influencias y adjunta tu historia.',
})

export default function PublicaPage() {
  return <PublicaClient />
}
