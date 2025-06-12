import { genPageMetadata } from 'app/seo'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'

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
          <div className="pt-8 pb-8 prose prose-lg dark:prose-invert">
            <PageTitle>Criterios Editoriales</PageTitle>
            
            <h2 className="text-xl font-bold mb-4">Qué buscamos (y qué no) en los textos que recibimos</h2>
            
            <p>
              En Marcapágina leemos con atención. Y creemos en decir que no cuando un texto aún no está listo, incluso si tiene una "buena idea". No publicamos por compromiso ni por amabilidad. Publicamos lo que nos conmueve, lo que deja una imagen viva, una atmósfera, una voz.
            </p>

            <h3 className="text-lg font-bold mt-8 mb-4">Lo que sí buscamos:</h3>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Narrativas breves o fragmentos con una mirada literaria elaborada</li>
              <li>Personajes con contradicción interna, con deseo, con grietas</li>
              <li>Lenguaje trabajado: imágenes sugerentes, ritmo, cuidado formal</li>
              <li>Textos que se sostengan sin necesidad de explicarse</li>
              <li>Finales que abran resonancia, no que cierren con moraleja</li>
            </ul>

            <h3 className="text-lg font-bold mt-8 mb-4">Lo que no publicamos:</h3>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Textos escritos como si la historia fuese suficiente sin forma</li>
              <li>Relatos que repiten estereotipos sin transformarlos</li>
              <li>Escrituras con lenguaje plano, sin tensión ni atmósfera</li>
              <li>Anécdotas contadas de corrido, sin estructura narrativa</li>
              <li>Cierres explicativos que repiten lo ya dicho en lugar de generar eco</li>
            </ul>

            <h3 className="text-lg font-bold mt-8 mb-4">❌ Y lo que especialmente no publicamos:</h3>
            
            <ul className="pl-5 space-y-2">
              <li>Autores menores de edad</li>
              <li>Fanfics</li>
              <li>Copeyanos</li>
            </ul>

            <p className="mt-8">
              Sabemos que escribir es un oficio. Y por eso mismo, no todo lo que se escribe está listo para circular. Si lo tuyo todavía no encaja con nuestra línea, quizás sea cuestión de tiempo, de reescritura o simplemente de otra editorial.
            </p>

            <p>
              Queremos que Marcapágina sea un espacio de lectura compartida, no una vitrina. Preferimos decir un "no" honesto a publicar algo que no está a la altura del proyecto.
            </p>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
} 