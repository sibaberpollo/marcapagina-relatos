import { Metadata } from 'next'
import PublicaDirectoClient from './PublicaDirectoClient'
import SectionContainer from '@/components/SectionContainer'

export const metadata: Metadata = {
  title: 'Publica tu relato - MarcaPágina',
  description: 'Envía tu relato directamente a MarcaPágina',
  robots: {
    index: false,
    follow: false,
  }
}

export default function PublicaDirectoPage() {
  return (
    <SectionContainer>
      <PublicaDirectoClient />
    </SectionContainer>
  )
} 