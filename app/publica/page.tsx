// File: tailwind-nextjs-starter-blog/app/publica/page.tsx
'use client'

import { useState, useEffect, useRef, DragEvent } from 'react'
import Script from 'next/script'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import Link from '@/components/Link'

// Reemplaza con tu sitekey de hCaptcha
const HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? ''

export default function PublicaPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    files: [] as File[],
    agree: false,
  })
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const widgetIdRef = useRef<number | null>(null)
  const captchaRef = useRef<HTMLDivElement>(null)

  // Extensiones permitidas
  const allowedExtensions = ['pdf', 'docx', 'txt']

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
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
    const valid = processFiles(dropped)
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...valid].slice(0, 5),
    }))
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const valid = processFiles(Array.from(e.target.files))
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...valid].slice(0, 5),
    }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => {
      const newFiles = [...prev.files]
      newFiles.splice(index, 1)
      return { ...prev, files: newFiles }
    })
  }

  // Renderiza el widget de hCaptcha solo una vez
  const renderCaptcha = () => {
    if (window.hcaptcha && captchaRef.current && widgetIdRef.current === null) {
      widgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
        sitekey: HCAPTCHA_SITEKEY,
        callback: (token: string) => setCaptchaToken(token),
      })
    }
  }

  useEffect(() => {
    renderCaptcha()
  }, [])

  const onScriptLoad = () => {
    renderCaptcha()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaToken) {
      alert('Por favor, completa el CAPTCHA para verificar que eres humano.')
      return
    }
    // TODO: enviar formData y captchaToken a tu API
    console.log({ formData, captchaToken })
    alert('¡Relato enviado!')
  }

  return (
    <SectionContainer className="py-16">
      {/* Carga el script de hCaptcha */}
      <Script
        src="https://js.hcaptcha.com/1/api.js"
        strategy="afterInteractive"
        onLoad={onScriptLoad}
      />

      <article className="prose prose-lg dark:prose-invert mx-auto mb-5">
        <PageTitle>Publica con nosotros</PageTitle>
        <p>
          En MarcaPagina celebramos la fuerza de la ficción para encender la imaginación y tejer nuevos mundos.
        </p>
        <p>
          Comparte tu relato a través del siguiente formulario: cuéntanos quién eres, tus influencias y adjunta tu historia.
        </p>
      </article>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow"
        encType="multipart/form-data"
      >
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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

        {/* Descripción breve */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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

        {/* Drag & Drop */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Archivos (máx. 5) - PDF, DOCX, TXT
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-1 relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-6 text-center text-gray-500 hover:border-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <p>Arrastra y suelta tus archivos aquí o haz clic para seleccionar</p>
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
                <li key={idx} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <span className="truncate">{file.name}</span>
                  <button type="button" onClick={() => removeFile(idx)} className="ml-2 text-red-600 hover:text-red-800">&times;</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* hCaptcha widget */}
        <div className="mt-4">
          <div ref={captchaRef}></div>
        </div>

        {/* Consentimiento */}
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
          <label htmlFor="agree" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Acepto que este texto es original y cedo derechos de publicación a MarcaPagina.
          </label>
        </div>

        {/* Enviar */}
        <div>
          <button
            type="submit"
            disabled={!captchaToken}
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar relato
          </button>
        </div>
      </form>
    </SectionContainer>
  )
}