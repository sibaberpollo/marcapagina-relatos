import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import MemeGallery from '@/components/MemeGallery'
import { genPageMetadata } from '../seo'
import { getMemeItems, getMemePageData } from '@/lib/memes'
import { headers } from 'next/headers'

// Función para detectar el idioma desde la URL
function getLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/en/')) {
    return 'en'
  }
  return 'es' // default
}

export async function generateMetadata() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const locale = getLocaleFromPath(pathname)
  
  const pageData = await getMemePageData(locale)
  
  return genPageMetadata({
    title: pageData.title,
    description: pageData.description,
  })
}

export default async function MemesPage() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const locale = getLocaleFromPath(pathname)
  
  const memeItems = await getMemeItems(locale)
  const pageData = await getMemePageData(locale)

  return (
    <SectionContainer>
      <div className="py-8">
        <PageTitle>{pageData.title}</PageTitle>
        <p className="mt-2 text-lg text-muted-foreground">
          {pageData.description}
        </p>
        <p className="mt-2 text-lg text-muted-foreground">
          {pageData.subtitle}
        </p>
        <div className="mt-8">
          <MemeGallery items={memeItems} />
        </div>
      </div>
    </SectionContainer>
  )
}
