'use client'

import { FormData } from '../../lib/hooks/useFormState'

interface PreFormularioProps {
  formData: FormData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  titulo?: string
  descripcion?: string
}

export default function PreFormulario({
  formData,
  handleChange,
  onSubmit,
  titulo = 'Bienvenido a MarcaPágina',
  descripcion = 'Comparte tu relato con nuestra comunidad de lectores. En MarcaPágina publicamos textos que abrazan la creatividad y la imaginación.',
}: PreFormularioProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {/* Título y descripción eliminados ya que se muestran en el componente padre */}

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-8 max-w-xl space-y-6 rounded-lg border border-2 border-black bg-white p-8 shadow dark:bg-gray-800"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="pre-email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Correo electrónico <span className="text-red-600">*</span>
          </label>
          <input
            id="pre-email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-2 border-black bg-gray-50 p-2 dark:bg-gray-900"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Fuente */}
        <div>
          <label
            htmlFor="source"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            ¿Cómo supiste de nosotros? <span className="text-red-600">*</span>
          </label>
          <select
            id="source"
            name="source"
            required
            className="mt-1 block w-full rounded-lg border border-2 border-black bg-gray-50 p-2 dark:bg-gray-900"
            value={formData.source}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter/X</option>
            <option value="web">Búsqueda web</option>
            <option value="amigo">Recomendación de un amigo</option>
            <option value="otra">Otra fuente</option>
          </select>
        </div>

        <div className="mt-4 text-center">
          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 font-medium text-[#faff00] transition-all duration-200 hover:scale-105 hover:bg-gray-900"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  )
}
