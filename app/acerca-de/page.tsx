import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import Link from 'next/link'
import { genPageMetadata } from 'app/seo'
import HighlightStroke from '@/components/HighlightStroke'
import { headers } from 'next/headers'

function getLocaleFromHeaders(headers: Headers): string {
  return headers.get('x-locale') || 'es'
}

export async function generateMetadata() {
  const headersList = await headers()
  const locale = getLocaleFromHeaders(headersList)

  const isEn = locale === 'en'
  const title = isEn ? 'About | Marcapágina' : 'Acerca de | Marcapágina'
  const description = isEn
    ? 'Marcapágina is reborn as a space dedicated to publishing short fiction: a place without algorithms that cares for the text and the reading experience, where authors share stories that invite you to lose yourself in new worlds.'
    : 'Marcapágina renace como un espacio dedicado a la publicación de relatos literarios: un lugar sin algoritmos, centrado en cuidar el texto y la experiencia de lectura, donde autores comparten historias que invitan a perderse en mundos nuevos.'

  return genPageMetadata({
    title,
    description,
    alternates: {
      canonical: `${siteMetadata.siteUrl}${isEn ? '/en/acerca-de' : '/acerca-de'}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteMetadata.siteUrl}${isEn ? '/en/acerca-de' : '/acerca-de'}`,
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

const pressArticles = [
  {
    id: 1,
    title: "Marcapágina: la app que quiere convertirse en el mejor lugar para leer literatura en español",
    publication: "El Estímulo",
    date: "13 de junio de 2025",
    url: "https://elestimulo.com/cultura/literatura/2025-06-13/marcapagina-app-literatura-relatos/",
    description: "Una entrevista y recorrido por la historia del proyecto, desde sus inicios como revista digital hasta la actual plataforma de publicación literaria.",
    logoSrc: "https://res.cloudinary.com/dx98vnos1/image/upload/v1749903568/marcapagina-1a-520x380_iacr6y.webp",
    logoAlt: "El Estímulo",
  },
]

export default async function AcercaDePage() {
  const headersList = await headers()
  const locale = getLocaleFromHeaders(headersList)

  const isEn = locale === 'en'
  const paragraphs = isEn
    ? [
        'Between 2009 and 2014 Marcapágina was a digital literary magazine born from friendship, the desire to read with others and the urge to write even when the world was looking away.',
        'By 2016, the three founding members —Anairene, Hazael and Pino— had emigrated. In that limbo, and following the death of Alejandro Rebolledo, we attempted a tribute issue with what was said on social media: texts, comments, praise and hate. But then the project went silent again. Until now.',
        'This current version of Marcapágina is not a nostalgic revival but a new form of the same idea: a platform exclusively dedicated to publishing literary short fiction, designed with the reading experience in mind.',
        'It is also a technical and aesthetic project: our own development, carefully crafted to give each text the place it deserves. A place without algorithms, without rush, where every story is published because we believe it is worth reading.',
        "We don't publish everything that comes our way. But we do read it all carefully. And whatever we decide to share comes with thought, editing and design. Because the text matters, and so does how it's presented.",
      ]
    : [
        'Marcapágina fue, entre 2009 y 2014, una revista digital de literatura que surgió de la amistad, del deseo de leer con otros y del impulso por escribir aunque el mundo estuviera mirando hacia otro lado.',
        'En 2016, ya los tres miembros fundadores —Anairene, Hazael y Pino— habíamos emigrado. En ese limbo, y a raíz de la muerte de Alejandro Rebolledo, intentamos un número homenaje con lo que se decía en las RRSS: textos, comentarios, elogios, hate. Pero después el proyecto volvió a apagarse. Hasta ahora.',
        'La versión actual de Marcapágina no es una resurrección nostálgica, sino una forma nueva de lo mismo: una plataforma dedicada exclusivamente a la publicación de relatos literarios, pensada desde la experiencia de lectura.',
        'Es también un proyecto técnico y estético: un desarrollo propio, cuidado al detalle, que busca dar a cada texto un lugar a la altura. Un lugar sin algoritmos, sin apuro, donde cada relato se publica porque creemos que vale la pena ser leído.',
        'Aquí no publicamos todo lo que llega. Pero sí leemos todo con atención. Y lo que decidimos compartir lo acompañamos con criterio, edición y diseño. Porque el texto importa. Y también cómo se presenta.',
      ]

  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-2 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {isEn ? 'About' : 'Acerca de'}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {(() => {
              const desc = isEn
                ? 'Texts by people who write when nobody is looking (2009 ~ 2014 → 2025 ➔ ∞)'
                : siteMetadata.descriptionRich
              const match = desc.match(/(.*?)(\(2009 ~ 2014 → 2025 ➔ ∞\))/)
              if (match) {
                return (
                  <>
                    {match[1]}
                    <HighlightStroke>
                      <span className="underline font-semibold">{match[2]}</span>
                    </HighlightStroke>
                  </>
                )
              }
              return desc
            })()}
          </p>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="flex flex-col items-center pt-8">
            <Image
              src="/static/images/logo_amarillo.png"
              alt="Marcapágina Logo"
              width={192}
              height={192}
              className="h-48 w-48 rounded-full border-4 border-black"
              style={{ boxSizing: 'content-box' }}
            />
            <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">Marcapágina</h3>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="github" href={siteMetadata.github} />
              <SocialIcon kind="instagram" href={siteMetadata.instagram} />
              <SocialIcon kind="spotify" href={siteMetadata.spotify} />
              <SocialIcon kind="youtube" href={siteMetadata.youtube} />
              <SocialIcon kind="bluesky" href={siteMetadata.bluesky} />
              <SocialIcon kind="threads" href={siteMetadata.threads} />
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-8 pb-2 xl:col-span-2">
            {paragraphs.map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </div>
        </div>

        {/* Sección de Creadores */}
        <div className="pt-10 pb-8">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14 mb-8">
            {isEn ? 'We were/We are:' : 'Fuimos/Somos:'}
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Anairene */}
            <div className="flex flex-col items-center">
              <Link href="/autor/anairene" className="group">
                <Image
                  src="https://res.cloudinary.com/dx98vnos1/image/upload/v1746708177/anairene_i2d4uc.jpg"
                  alt="Anairene"
                  width={150}
                  height={150}
                  className="h-36 w-36 rounded-full object-cover transition-all duration-200 group-hover:scale-105"
                />
                <h3 className="mt-4 text-xl font-bold text-center text-gray-900 dark:text-gray-100 group-hover:text-[#333333] dark:group-hover:text-[#cccccc]">
                  Anairene
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">Contenido</p>
              </Link>
            </div>

            {/* Hazael */}
            <div className="flex flex-col items-center">
              <Link href="/autor/hazael" className="group">
                <Image
                  src="https://res.cloudinary.com/dx98vnos1/image/upload/v1746708178/hazael_cyxoy3.png"
                  alt="Hazael"
                  width={150}
                  height={150}
                  className="h-36 w-36 rounded-full object-cover transition-all duration-200 group-hover:scale-105"
                />
                <h3 className="mt-4 text-xl font-bold text-center text-gray-900 dark:text-gray-100 group-hover:text-[#333333] dark:group-hover:text-[#cccccc]">
                  Hazael
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">Textos</p>
              </Link>
            </div>

            {/* Pino */}
            <div className="flex flex-col items-center">
              <Link href="/autor/pino" className="group">
                <Image
                  src="https://res.cloudinary.com/dx98vnos1/image/upload/v1746708177/pino_gf3ue8.jpg"
                  alt="Pino"
                  width={150}
                  height={150}
                  className="h-36 w-36 rounded-full object-cover transition-all duration-200 group-hover:scale-105"
                />
                <h3 className="mt-4 text-xl font-bold text-center text-gray-900 dark:text-gray-100 group-hover:text-[#333333] dark:group-hover:text-[#cccccc]">
                  Pino
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">Textos/Desarrollo</p>
              </Link>
            </div>

            {/* Mayling */}
            <div className="flex flex-col items-center">
              <div className="group">
                <Image
                  src="https://res.cloudinary.com/dx98vnos1/image/upload/v1746708177/mayling_aytspj.jpg"
                  alt="Mayling"
                  width={150}
                  height={150}
                  className="h-36 w-36 rounded-full object-cover transition-all duration-200 group-hover:scale-105"
                />
                <h3 className="mt-4 text-xl font-bold text-center text-gray-900 dark:text-gray-100 group-hover:text-[#333333] dark:group-hover:text-[#cccccc]">
                  Mayling
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">Diseño Gráfico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Prensa */}
        <div id="prensa" className="pt-16 pb-8">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14 mb-8">
            {isEn ? 'Marcapágina in the media' : 'Marcapágina en los medios'}
          </h2>
          <div className="space-y-10">
            {pressArticles.map((article) => (
              <div key={article.id} className="flex flex-col md:flex-row md:items-start gap-6">
                <Image
                  src={article.logoSrc}
                  alt={article.logoAlt}
                  width={520}
                  height={380}
                  className="object-contain w-full h-auto md:w-32 md:h-20"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    <Link href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {article.publication} · {article.date}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {article.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
