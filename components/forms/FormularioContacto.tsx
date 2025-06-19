'use client'

import { useState } from 'react'

interface FormData {
  nombre: string
  email: string
  telefono: string
  motivo: string
  mensaje: string
}

interface FormStatus {
  success: boolean
  message: string
}

export default function FormularioContacto({ locale = 'es' }: { locale?: string }) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    motivo: '',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<FormStatus | null>(null)

  const isEn = locale === 'en'

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre || !formData.email || !formData.motivo || !formData.mensaje) {
      setStatus({
        success: false,
        message: isEn ? 'Please fill in the required fields.' : 'Por favor completa los campos requeridos.'
      })
      return
    }
    if (formData.mensaje.length > 500) {
      setStatus({
        success: false,
        message: isEn ? 'The message must not exceed 500 characters.' : 'El mensaje no debe superar 500 caracteres.'
      })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus(null)
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || (isEn ? 'Submission error' : 'Error en el envío'))
      setStatus({ success: true, message: isEn ? 'Message sent successfully.' : 'Mensaje enviado correctamente.' })
      setFormData({ nombre: '', email: '', telefono: '', motivo: '', mensaje: '' })
    } catch (err) {
      setStatus({ success: false, message: (err as Error).message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-6 bg-white dark:bg-gray-800 p-8 border border-black border-2 rounded-lg shadow"
    >
      <div className="rounded-lg bg-yellow-100 p-4 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
        {isEn ? 'To publish, do it via ' : 'Para publicar, hazlo a través de '}
        <a
          href="https://www.marcapagina.page/publica"
          className="font-bold underline"
        >
          /publica
        </a>
        .
      </div>
      {status && (
        <div
          className={`p-4 rounded ${status.success ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'}`}
        >
          {status.message}
        </div>
      )}
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {isEn ? 'Full name' : 'Nombre y apellido'}{' '}
          <span className="text-red-600">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
          value={formData.nombre}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {isEn ? 'Email' : 'Correo electrónico'}{' '}
          <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="motivo"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {isEn ? 'Reason' : 'Motivo'} <span className="text-red-600">*</span>
        </label>
        <select
          id="motivo"
          name="motivo"
          required
          className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
          value={formData.motivo}
          onChange={handleChange}
        >
          <option value="">{isEn ? 'Select an option' : 'Selecciona una opción'}</option>
          <option value="contactar">{isEn ? 'Contact' : 'Contacto'}</option>
          <option value="asesoria">{isEn ? 'Consulting, reading, editing' : 'Asesoría, lectura, corrección'}</option>
          <option value="imagenes">{isEn ? 'Illustrations, graphic design' : 'Ilustraciones, diseño gráfico'}</option>
          <option value="apps">{isEn ? 'App and web development' : 'Desarrollo de aplicaciones, web'}</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="telefono"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {isEn ? 'Phone (optional)' : 'Teléfono (opcional)'}
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
          value={formData.telefono}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="mensaje"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {isEn ? 'Message' : 'Mensaje'} <span className="text-red-600">*</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          maxLength={500}
          required
          className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
          value={formData.mensaje}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formData.mensaje.length}/500
        </p>
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full inline-flex justify-center rounded-md py-2 px-4 shadow hover:bg-gray-900 focus:ring-2 focus:ring-gray-900 ${isSubmitting ? 'bg-gray-500 text-white opacity-70' : 'bg-black text-[#faff00]'}`}
        >
          {isSubmitting ? (isEn ? 'Sending...' : 'Enviando...') : isEn ? 'Send' : 'Enviar'}
        </button>
      </div>
    </form>
  )
}
