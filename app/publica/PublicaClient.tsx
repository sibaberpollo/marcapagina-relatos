'use client'

import { useState, useEffect, useRef, DragEvent } from 'react'
import Script from 'next/script'
import { usePathname, useRouter } from 'next/navigation'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!

export default function PublicaClient() {
  const router = useRouter()
  const pathname = usePathname()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    files: [] as File[],
    agree: false,
  })
  const [token, setToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const allowedExtensions = ['pdf', 'docx', 'txt']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (ext && allowedExtensions.includes(ext)) valid.push(file)
      else alert(`Formato no soportado: ${file.name}`)
    })
    return valid
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    const valid = processFiles(dropped)
    setFormData(prev => ({ ...prev, files: [...prev.files, ...valid].slice(0, 5) }))
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault()

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const valid = processFiles(Array.from(e.target.files))
    setFormData(prev => ({ ...prev, files: [...prev.files, ...valid].slice(0, 5) }))
  }

  const removeFile = (idx: number) => {
    setFormData(prev => {
      const arr = [...prev.files]
      arr.splice(idx, 1)
      return { ...prev, files: arr }
    })
  }

  const initTurnstile = () => {
    if (window.turnstile && captchaRef.current && widgetIdRef.current === null) {
      const id = window.turnstile.render(captchaRef.current, {
        sitekey: TURNSTILE_SITEKEY,
        callback: t => setToken(t),
      })
      widgetIdRef.current = id
    }
  }

  useEffect(() => {
    if (pathname === '/publica') {
      if (window.turnstile) {
        initTurnstile()
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            initTurnstile()
            clearInterval(interval)
          }
        }, 300)
        return () => clearInterval(interval)
      }
    }
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [pathname])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      alert('Por favor completa el CAPTCHA.')
      return
    }
    try {
      setIsSubmitting(true)
      setStatus(null)
      const body = new FormData()
      body.append('name', formData.name)
      body.append('email', formData.email)
      body.append('description', formData.description)
      body.append('response', token)
      formData.files.forEach(f => body.append('files', f))

      const res = await fetch('/api/publica', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error en el envío')

      setFormData({ name: '', email: '', description: '', files: [], agree: false })
      setToken(null)
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }

      router.push('/publica/gracias')
    } catch (err) {
      setStatus({ success: false, message: (err as Error).message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-16">
      <SectionContainer>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />

        <article className="prose prose-lg dark:prose-invert mx-auto mb-5">
          <PageTitle>Publica con nosotros</PageTitle>
          <p>
            En MarcaPágina celebramos la fuerza de la ficción para encender la imaginación y tejer nuevos mundos.
          </p>
          <p>Comparte tu relato: cuéntanos quién eres, tus influencias y adjunta tu historia.</p>
        </article>

        {status && (
          <div
            className={`mx-auto max-w-2xl p-4 mb-6 rounded-lg ${
              status.success
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
            }`}
          >
            {status.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow"
          encType="multipart/form-data"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Todos los campos son obligatorios. Los campos marcados con (<span className="text-red-600">*</span>) son requeridos.</p>

          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre o seudónimo <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Correo electrónico <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Presentación breve <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Archivos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Archivos (máx. 5) – PDF, DOCX, TXT <span className="text-red-600">*</span>
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="mt-1 relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-6 text-gray-500"
            >
              <p>Arrastra y suelta archivos aquí o haz clic para seleccionar</p>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInput}
              />
            </div>
            {formData.files.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {formData.files.map((f, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded"
                  >
                    <span className="truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CAPTCHA */}
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
            <label
              htmlFor="agree"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Acepto que este texto es original y cedo derechos de publicación a MarcaPágina. <span className="text-red-600">*</span>
            </label>
          </div>

          {/* Enviar */}
          <div>
            <button
              type="submit"
              disabled={!token || isSubmitting}
              className="w-full inline-flex justify-center rounded-md bg-primary-600 py-2 px-4 text-white shadow hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar relato'}
            </button>
          </div>
        </form>
      </SectionContainer>
    </div>
  )
}
