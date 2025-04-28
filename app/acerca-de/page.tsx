import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Acerca de' })

export default function AcercaDePage() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-2 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Acerca de
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Textos de gente que escribe cuando nadie los ve.
          </p>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="flex flex-col items-center pt-8">
            <Image
              src="/static/images/logo.jpg"
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
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-2 pb-2 xl:col-span-2">
            <p>
              Marcapágina fue, entre 2009 y 2015, una revista literaria dedicada a la crítica, la divulgación y la conversación sobre libros.
              Un proyecto pequeño, nacido de las ganas, de la amistad y de la necesidad de escribir aunque el mundo pareciera ocupado en otras cosas.
            </p>
            <p>
              Hoy, retomamos esa semilla con una mirada nueva.
              Sabemos que el tiempo pasa, que las ideas mutan, y que lo importante —cuando persiste— encuentra otras formas de seguir respirando.
            </p>
            <p>
              En esta nueva etapa, Marcapágina será un espacio exclusivamente dedicado a la publicación de relatos: cortos, medianos o largos.
              Un lugar sin apuro, sin algoritmos que dicten ritmos, y con el único compromiso de cuidar lo que verdaderamente importa: el texto.
            </p>
            <p>
              Iremos recuperando, poco a poco, algunos materiales de la época de la revista, en la medida en que sigan dialogando con el espíritu actual.
              Pero nuestro centro será, ante todo, contar historias.
            </p>
            <p>
              Aquí creemos que escribir —y leer— siguen siendo actos íntimos, valiosos, aunque muchas veces pasen inadvertidos.
            </p>
            <p>
              Por eso, trabajamos con especial cuidado para ofrecer no solo los relatos, sino también una experiencia de lectura que los acompañe: limpia, refinada, enriquecida desde lo técnico y lo visual.
              Un pequeño lujo, quizás, para quienes todavía disfrutan de perderse en una buena historia.
            </p>
          </div>
        </div>
      </div>
    </>
  )
} 