import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import FormularioContacto from '@/components/forms/FormularioContacto'

export const metadata = genPageMetadata({
  title: 'Contacto',
  description: 'Escríbenos tus dudas o comentarios.'
})

export default function ContactoPage() {
  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>Contacto</PageTitle>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Envíanos tus dudas o comentarios a través del formulario.
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
