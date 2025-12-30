import { Metadata } from 'next'
import { CreateCorpseForm } from '@/components/corpse/CreateCorpseForm'

export const metadata: Metadata = {
  title: 'Crear Micronarrativa | MarcaPágina',
  description: 'Crea una nueva micronarrativa colaborativa con otros autores de MarcaPágina.',
}

export default function NuevaMicronarrativaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Crear nueva micronarrativa
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Inicia una historia colaborativa donde múltiples autores contribuirán con segmentos de
            texto. Cada participante añade su voz a la narrativa colectiva.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <CreateCorpseForm />
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h2 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
            ¿Cómo funciona?
          </h2>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Define un título atractivo y elige un prompt creativo (opcional)</li>
            <li>• Establece el número máximo de colaboradores (7-10 autores)</li>
            <li>• Los autores se unen automáticamente y contribuyen por turnos</li>
            <li>• Cada segmento debe tener entre 50-100 palabras</li>
            <li>• Tienes 2 minutos para escribir cada segmento</li>
            <li>
              • La historia se completa cuando todos han contribuido o se vota para finalizarla
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
