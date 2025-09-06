import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'
import Script from 'next/script'

export const metadata = genPageMetadata({
  title: 'Resultados de búsqueda',
  description: 'Explora el contenido de Marcapágina a través de Google.',
})

export default function ResultadosPage() {
  return (
    <SectionContainer>
      <div className="py-8">
        <PageTitle>Resultados de búsqueda</PageTitle>
        <Script async src="https://cse.google.com/cse.js?cx=20d090db2c0284144" />
        <div className="gcse-search" />
      </div>
    </SectionContainer>
  )
}
