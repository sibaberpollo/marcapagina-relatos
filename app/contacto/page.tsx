import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import FormularioContacto from '@/components/forms/FormularioContacto'
import { headers } from 'next/headers'

function getLocaleFromPath(pathname: string): string {
  if (pathname.startsWith('/en/')) {
    return 'en'
  }
  return 'es'
}

export async function generateMetadata() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const locale = getLocaleFromPath(pathname)

  const isEn = locale === 'en'
  const title = isEn ? 'Contact | Marcapágina' : 'Contacto | Marcapágina'
  const description = isEn
    ? 'Are you looking for a critical reading, literary editing or an illustration with a unique style? Write us to tell us about your project or simply share your questions.'
    : '¿Buscas una lectura crítica, corrección literaria o una ilustración con estilo propio? Escríbenos para contarnos tu proyecto o simplemente para compartir tus dudas.'

  return genPageMetadata({
    title,
    description,
    alternates: {
      canonical: `${siteMetadata.siteUrl}${isEn ? '/en/contacto' : '/contacto'}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteMetadata.siteUrl}${isEn ? '/en/contacto' : '/contacto'}`,
      siteName: 'Marcapágina',
      locale: isEn ? 'en_US' : 'es_CL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  })
}

export default async function ContactoPage() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const locale = getLocaleFromPath(pathname)

  const isEn = locale === 'en'

  const paragraphs = isEn
    ? [
        'If you are writing a text, looking for literary editing or wondering how to illustrate your story with Marcapágina\'s visual style, this is a good place to start. We also offer critical readings, visual packages for social media and broader editorial collaborations.',
        'Marcapágina is not just a digital magazine. It is also a showcase of what we can build. If you like the result and want to contact us to edit your book, develop a similar application, design a platform to publish your own stories or create a visual identity from scratch, write us.',
        'We work on the design and development of projects that combine narrative, aesthetics and technology: from brochures and magazines to cultural campaigns or web applications. If you have an idea in mind, or just want to tell us something, we\'re here.',
      ]
    : [
        'Si estás escribiendo un texto, buscando una corrección literaria o imaginando cómo ilustrar tu historia con el estilo gráfico de Marcapágina, este es un buen lugar para empezar. También ofrecemos lecturas críticas, paquetes visuales para redes y colaboraciones editoriales más amplias.',
        'Pero Marcapágina no es solo una revista digital. Es también una muestra de lo que podemos construir. Si te gusta el resultado y quieres contactarnos para editar tu libro, desarrollar una aplicación parecida, diseñar una plataforma para publicar tus propios relatos o crear una identidad visual desde cero, escríbenos.',
        'Trabajamos en el diseño y desarrollo de proyectos que combinan narrativa, estética y tecnología: desde brochures y revistas hasta campañas culturales o aplicaciones webs. Si tienes  una idea en mente, o simplemente quieres comentarnos algo, acá estamos.',
      ]

  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>{isEn ? 'Contact' : 'Contacto'}</PageTitle>
          <p className="text-lg leading-7 text-gray-600 dark:text-gray-400">
            {paragraphs[0]}
            <br />
            <br />
            {paragraphs[1]}
            <br />
            <br />
            {paragraphs[2]}
          </p>
          <div className="flex space-x-3 pt-4">
            <SocialIcon kind="instagram" href={siteMetadata.instagram} />
            <SocialIcon kind="twitter" href={siteMetadata.twitter} />
            <SocialIcon kind="threads" href={siteMetadata.threads} />
            <SocialIcon kind="bluesky" href={siteMetadata.bluesky} />
            <SocialIcon kind="youtube" href={siteMetadata.youtube} />
          </div>
        </div>
        <div className="pt-6">
          <FormularioContacto locale={locale} />
        </div>
      </div>
    </SectionContainer>
  )
}
