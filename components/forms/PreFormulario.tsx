'use client'

import { FormData } from '../../lib/hooks/useFormState';

interface PreFormularioProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  titulo?: string;
  descripcion?: string;
}

export default function PreFormulario({
  formData,
  handleChange,
  onSubmit,
  titulo = "Bienvenido a MarcaPágina",
  descripcion = "Comparte tu relato con nuestra comunidad de lectores. En MarcaPágina publicamos textos que abrazan la creatividad y la imaginación."
}: PreFormularioProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-4">{titulo}</h2>
      <p className="mb-4">{descripcion}</p>
      
      <p className="px-4 py-2 rounded font-semibold" style={{ background: '#faff00', color: '#222', boxShadow: '0 0 8px #faff00' }}>
        <strong>Nota:</strong> Para publicar tu relato, primero necesitamos que completes un breve desafío de lectura.
      </p>
      
      <form 
        onSubmit={onSubmit}
        className="mx-auto max-w-xl space-y-6 bg-white dark:bg-gray-800 p-8 border border-black border-2 rounded-lg shadow mt-8"
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
            className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
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
            className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
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
        
        <div className="text-center mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-[#faff00] rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Comenzar Desafío
          </button>
        </div>
      </form>
    </div>
  );
} 