// File: tailwind-nextjs-starter-blog/app/publica/gracias/page.tsx

import Image from '@/components/common/Image'
import SocialIcon from '@/components/common/social-icons'
import siteMetadata from '@/data/siteMetadata'
import Link from 'next/link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Gracias' })

export default function PublicaGraciasPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          ¡Gracias por tu envío!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Hemos recibido tu relato y nos pondremos en contacto contigo pronto.
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300">
          Te hemos enviado un correo de confirmación a tu email. Por favor, revisa tu bandeja de
          spam y márcanos como “no spam” para asegurarte de recibir nuestras notificaciones.
        </p>
      </div>
    </div>
  )
}
