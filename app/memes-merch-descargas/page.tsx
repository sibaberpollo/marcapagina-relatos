import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import MemeGallery from '@/components/MemeGallery'
import ExpandableText from '@/components/ExpandableText'
import { genPageMetadata } from '../seo'
import { getMemeItems, getMemePageData } from '@/lib/memes'
import { headers } from 'next/headers'

// Función para detectar el idioma desde la URL
function getLocaleFromHeaders(headers: Headers): string {
  return headers.get('x-locale') || 'es'
}

export async function generateMetadata() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const locale = getLocaleFromHeaders(headersList)

  const pageData = await getMemePageData(locale)

  return genPageMetadata({
    title: pageData.title,
    description: pageData.description,
  })
}

export default async function MemesPage() {
  const headersList = await headers()
  const locale = getLocaleFromHeaders(headersList)

  const memeItems = await getMemeItems(locale)
  const pageData = await getMemePageData(locale)

  const periodIndex = pageData.description.indexOf('. ')
  const firstPart =
    periodIndex !== -1 ? pageData.description.slice(0, periodIndex + 1) : pageData.description
  const restPart = periodIndex !== -1 ? pageData.description.slice(periodIndex + 1).trimStart() : ''

  return (
    <SectionContainer>
      <div className="py-8">
        <PageTitle>{pageData.title}</PageTitle>
        <ExpandableText previewLines={1} className="prose dark:prose-invert mb-4 max-w-none">
          <p className="text-muted-foreground mt-2 text-lg">{firstPart}</p>
          {restPart && <p className="text-muted-foreground mt-2 text-lg">{restPart}</p>}
          <p className="text-muted-foreground mt-2 text-lg">{pageData.subtitle}</p>
        </ExpandableText>
        <div className="mt-8">
          <MemeGallery items={memeItems} />
        </div>
      </div>
    </SectionContainer>
  )
}
