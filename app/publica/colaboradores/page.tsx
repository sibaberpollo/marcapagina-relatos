import { Metadata } from 'next'
import ColaboradorDirectoClient from './ColaboradorDirectoClient'
import SectionContainer from '@/components/SectionContainer'

export const metadata: Metadata = {
  title: 'Colaboradores - MarcaPágina',
  description: 'Portal exclusivo para colaboradores de MarcaPágina',
  robots: {
    index: false,
    follow: false,
  }
}

export default function ColaboradoresPage() {
  return (
    <SectionContainer>
      <ColaboradorDirectoClient />
    </SectionContainer>
  )
} 