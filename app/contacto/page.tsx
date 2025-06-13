import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import FormularioContacto from '@/components/forms/FormularioContacto'

export const metadata = genPageMetadata({
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
            Si estás trabajando en un texto, buscando una corrección literaria, o quieres ilustrar tu historia con el estilo gráfico de Marcapágina, puedes contactarnos desde aquí. 
            También si necesitas una lectura crítica, un paquete visual para redes, o simplemente porque quieres compartirnos tus dudas o comentarios.
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
