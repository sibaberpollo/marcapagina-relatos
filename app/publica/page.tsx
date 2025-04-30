'use client'
import { useState, DragEvent } from 'react'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import Link from '@/components/Link'

export default function PublicaPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    tags: '',
    description: '',
    files: [] as File[],
    agree: false,
  })

  // Extensiones permitidas
  const allowedExtensions = ['pdf', 'docx', 'txt']

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const processFiles = (incoming: File[]) => {
    const valid: File[] = []
    incoming.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext && allowedExtensions.includes(ext)) {
        valid.push(file)
      } else {
        alert(`Formato no soportado: ${file.name}`)
      }
    })
    return valid
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    const validFiles = processFiles(dropped)
    setFormData(prev => {
      const combined = [...prev.files, ...validFiles].slice(0, 5)
      return { ...prev, files: combined }
    })
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    const valid = processFiles(selected)
    setFormData(prev => {
      const combined = [...prev.files, ...valid].slice(0, 5)
      return { ...prev, files: combined }
    })
  }

  const removeFile = (index: number) => {
    setFormData(prev => {
      const newFiles = [...prev.files]
      newFiles.splice(index, 1)
      return { ...prev, files: newFiles }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: enviar datos a API
    console.log(formData)
    alert('¡Relato enviado!')
  }

  return (
    <SectionContainer className="py-16">
      <article className="prose prose-lg dark:prose-invert mx-auto mb-5">
        <PageTitle>Publica con nosotros</PageTitle>
        <p>
          En MarcaPagina celebramos la fuerza de la ficción para encender la imaginación
          y tejer nuevos mundos. Aquí tu voz tiene un lugar: ya seas un narrador
          incipiente o un cuentista con recorrido, queremos leer lo que guardas en tu
          Libreta de ideas.
        </p>
        <p>
          Comparte tu relato a través del siguiente formulario: cuéntanos quién eres,
          tus influencias, y adjunta tu historia. Nos comprometemos a revisar cada
          envío con respeto y dedicación.
        </p>
      </article>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow"
        encType="multipart/form-data"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nombre o seudónimo
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 focus:border-primary-500 focus:ring-primary-500"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 focus:border-primary-500 focus:ring-primary-500"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Título del relato
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 focus:border-primary-500 focus:ring-primary-500"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Etiquetas (separar con comas)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 focus:border-primary-500 focus:ring-primary-500"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Presentación breve
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 focus:border-primary-500 focus:ring-primary-500"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Archivos (máx. 5) - formatos soportados: PDF, DOCX, TXT
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-1 relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-6 text-center text-gray-500 hover:border-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <p>Arrastra y suelta tus archivos aquí o haz clic para seleccionar</p>
            <p className="text-xs text-gray-400 mt-1">(PDF, DOCX, TXT)</p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileInput}
            />
          </div>
          {formData.files.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {formData.files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
            checked={formData.agree}
            onChange={handleChange}
          />
          <label
            htmlFor="agree"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Acepto que este texto es original y cedo derechos de publicación a MarcaPagina.
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Enviar relato
          </button>
        </div>
      </form>
    </SectionContainer>
  )
}