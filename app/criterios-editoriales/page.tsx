import { genPageMetadata } from 'app/seo'
import PageTitle from '@/components/common/PageTitle'
import SectionContainer from '@/components/layout/SectionContainer'

export const metadata = genPageMetadata({
  title: 'Criterios Editoriales',
  description:
    'Qué buscamos (y qué no) en los textos que recibimos en Marcapágina. Conoce nuestros criterios de selección.',
})

export default function CriteriosEditorialesPage() {
  return (
    <SectionContainer>
      <article className="mx-auto max-w-3xl">
        <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
          <div
            className="prose prose-lg dark:prose-invert max-w-none pt-8 pb-8"
            style={{
              color: 'var(--color-text-light)',
              backgroundColor: 'var(--color-bg-light)',
            }}
            data-theme-target="prose"
          >
            <PageTitle>Criterios Editoriales</PageTitle>

            <h2
              className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100"
              style={{ color: 'var(--color-text-light)' }}
            >
              Qué buscamos (y qué no) en los textos que recibimos
            </h2>

            <p
              className="text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              En{' '}
              <a href="/transtextos" className="underline hover:underline">
                Transtextos
              </a>{' '}
              leemos con atención. Y creemos en decir que no cuando un texto aún no está listo,
              incluso si tiene una "buena idea". No publicamos por compromiso ni por amabilidad.
              Publicamos lo que nos conmueve, lo que deja una imagen viva, una atmósfera, una voz.
            </p>

            <h3
              className="mt-8 mb-4 text-lg font-bold text-gray-900 dark:text-gray-100"
              style={{ color: 'var(--color-text-light)' }}
            >
              Lo que sí buscamos:
            </h3>

            <ul
              className="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              <li>Narrativas breves o fragmentos con una mirada literaria elaborada</li>
              <li>Personajes con contradicción interna, con deseo, con grietas</li>
              <li>Lenguaje trabajado: imágenes sugerentes, ritmo, cuidado formal</li>
              <li>Textos que se sostengan sin necesidad de explicarse</li>
              <li>Finales que abran resonancia, no que cierren con moraleja</li>
            </ul>

            <h3
              className="mt-8 mb-4 text-lg font-bold text-gray-900 dark:text-gray-100"
              style={{ color: 'var(--color-text-light)' }}
            >
              Lo que no publicamos:
            </h3>

            <ul
              className="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              <li>Textos escritos como si la historia fuese suficiente sin forma</li>
              <li>Relatos que repiten estereotipos sin transformarlos</li>
              <li>Escrituras con lenguaje plano, sin tensión ni atmósfera</li>
              <li>Anécdotas contadas de corrido, sin estructura narrativa</li>
              <li>Cierres explicativos que repiten lo ya dicho en lugar de generar eco</li>
            </ul>

            <h3
              className="mt-8 mb-4 text-lg font-bold text-gray-900 dark:text-gray-100"
              style={{ color: 'var(--color-text-light)' }}
            >
              ❌ Y lo que especialmente no publicamos:
            </h3>

            <ul
              className="space-y-2 pl-5 text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              <li>Autores menores de edad</li>
              <li>Journaling</li>
            </ul>

            <p
              className="mt-8 text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              Sabemos que escribir es un oficio. Y por eso mismo, no todo lo que se escribe está
              listo para circular. Si lo tuyo todavía no encaja con nuestra línea, quizás sea
              cuestión de tiempo, de reescritura o simplemente de otra editorial.
            </p>

            <p
              className="text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              Queremos que{' '}
              <a href="/transtextos" className="underline hover:underline">
                Transtextos
              </a>{' '}
              sea un espacio de lectura compartida, no una vitrina. Preferimos decir un "no" honesto
              a publicar algo que no está a la altura del proyecto.
            </p>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
