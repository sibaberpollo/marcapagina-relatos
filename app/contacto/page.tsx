import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import FormularioContacto from '@/components/forms/FormularioContacto'

export const metadata = genPageMetadata({
          <div className="mt-4 rounded-lg bg-yellow-100 p-4 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            Para publicar en Marcapagina, hazlo a través de{' '}
            <a
              href="https://www.marcapagina.page/publica"
              className="font-bold underline"
            >
              /publica
            </a>
            .
          </div>
  title: 'Contacto | Marcapágina',
  description:
    '¿Buscas una lectura crítica, corrección literaria o una ilustración con estilo propio? Escríbenos para contarnos tu proyecto o simplemente para compartir tus dudas.',
  alternates: {
    canonical: `${siteMetadata.siteUrl}/contacto`,
  },
  openGraph: {
    title: 'Contacto | Marcapágina',
    description:
      '¿Buscas una lectura crítica, corrección literaria o una ilustración con estilo propio? Escríbenos para contarnos tu proyecto o simplemente para compartir tus dudas.',
    url: `${siteMetadata.siteUrl}/contacto`,
    siteName: 'Marcapágina',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto | Marcapágina',
    description:
      '¿Buscas una lectura crítica, corrección literaria o una ilustración con estilo propio? Escríbenos para contarnos tu proyecto o simplemente para compartir tus dudas.',
  },
})

export default function ContactoPage() {
  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>Contacto</PageTitle>
          <p className="text-lg leading-7 text-gray-600 dark:text-gray-400">
            Si estás escribiendo un texto, buscando una corrección literaria o imaginando cómo ilustrar tu historia con el estilo gráfico de Marcapágina, este es un buen lugar para empezar. También ofrecemos lecturas críticas, paquetes visuales para redes y colaboraciones editoriales más amplias.
            <br />
            <br />
            Pero Marcapágina no es solo una revista digital. Es también una muestra de lo que podemos construir. Si te gusta el resultado y quieres contactarnos para editar tu libro, desarrollar una aplicación parecida, diseñar una plataforma para publicar tus propios relatos o crear una identidad visual desde cero, escríbenos.
            <br />
            <br />
            Trabajamos en el diseño y desarrollo de proyectos que combinan narrativa, estética y tecnología: desde brochures y revistas hasta campañas culturales o aplicaciones webs. Si tienes  una idea en mente, o simplemente quieres comentarnos algo, acá estamos.
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
          <FormularioContacto />
        </div>
      </div>
    </SectionContainer>
  )
}
