'use client'

import { useState, useEffect, useRef, DragEvent } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import PageTitle from '@/components/PageTitle'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'

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

// Utilidad para enviar eventos a Google Analytics
function sendGAEvent({ action, category, label, value }: { action: string; category: string; label?: string; value?: string | number }) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export default function ColaboradorDirectoClient() {
  const router = useRouter()

  // Estado para el formulario
  const [formData, setFormData] = useState({
    email: '',
    description: '',
    files: [] as File[],
    agree: false,
    source: 'colaborador', // Fuente predeterminada para tracking
  })
  const [token, setToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [dotCount, setDotCount] = useState(0)

  const allowedExtensions = ['pdf', 'docx', 'txt']

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const processFiles = (incoming: File[]) => {
    // Si ya tenemos un archivo, ignorar
    if (formData.files.length > 0) {
      alert('Solo se permite un archivo. Por favor, elimina el archivo actual antes de agregar uno nuevo.')
      return []
    }
    
    const valid: File[] = []
    for (const file of incoming) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      
      // Verificar extensión
      if (!ext || !allowedExtensions.includes(ext)) {
        alert(`Formato no soportado: ${file.name}`)
        continue
      }
      
      // Verificar tamaño (1MB = 1048576 bytes)
      if (file.size > 1048576) {
        alert(`El archivo ${file.name} excede el límite de 1MB (${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
        continue
      }
      
      // Solo aceptar el primer archivo válido
      valid.push(file)
      break
    }
    
    return valid
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    const valid = processFiles(dropped)
    setFormData(prev => ({ ...prev, files: [...prev.files, ...valid] }))
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault()

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const valid = processFiles(Array.from(e.target.files))
    setFormData(prev => ({ ...prev, files: [...prev.files, ...valid] }))
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
    // Inicializar Turnstile cuando la página se carga
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
    
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setDotCount(prev => (prev + 1) % 4)
      }, 500)
      return () => clearInterval(interval)
    } else {
      setDotCount(0)
    }
  }, [isSubmitting])

  // Registrar visita a la página
  useEffect(() => {
    // Registro de pageview para analíticas
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Portal Colaboradores',
        page_location: window.location.href,
        page_path: '/publica/colaboradores',
        send_to: siteMetadata?.analytics?.googleAnalytics?.googleAnalyticsId
      });
    }
    
    sendGAEvent({
      action: 'view_colaborador',
      category: 'PortalColaboradores',
      label: 'Página de colaboradores vista'
    });
  }, []);

  // Registrar datos en Google Sheets
  const registrarVisita = async () => {
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email || 'no-email@colaborador',
          source: 'colaborador_invitado',
          etapa: 'pre_formulario',
          fechaRegistro: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error al registrar visita:', error);
    }
  };
  
  useEffect(() => {
    registrarVisita();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    sendGAEvent({
      action: 'submit_colaborador_form',
      category: 'ColaboradorForm',
      label: formData.email,
      value: formData.files.length,
    })
    if (!token) {
      alert('Por favor completa el CAPTCHA.')
      return
    }
    try {
      setIsSubmitting(true)
      setStatus(null)
      
      // Crear FormData para enviar al servidor
      const body = new FormData()
      
      // Añadir todos los campos necesarios
      body.append('email', formData.email)
      body.append('description', formData.description)
      body.append('response', token)
      
      // Añadir archivos
      if (formData.files.length > 0) {
        for (const file of formData.files) {
          body.append('files', file)
        }
      }
      
      console.log('Enviando formulario desde colaboradores:', { 
        email: formData.email, 
        description: formData.description.substring(0, 30) + '...',
        filesCount: formData.files.length
      });

      // Enviar al endpoint
      const res = await fetch('/api/publica', { 
        method: 'POST', 
        body 
      })
      
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error en el envío')

      // Actualizar Google Sheets para indicar que completó todo el proceso
      try {
        await fetch('/api/sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            source: 'colaborador_invitado',
            etapa: 'formulario_completo',
            archivoEnviado: true,
            fechaEnvio: new Date().toISOString()
          }),
        });
      } catch (error) {
        console.error('Error al actualizar datos en Google Sheets:', error);
      }

      setFormData(prev => ({ ...prev, description: '', files: [], agree: false }))
      setToken(null)
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }

      router.push('/publica/gracias')
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      setStatus({ success: false, message: (err as Error).message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-4">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <article className="prose prose-lg dark:prose-invert mx-auto mb-5">
        <PageTitle>Portal para Colaboradores</PageTitle>
        <p>
          Bienvenido al portal exclusivo para colaboradores de MarcaPágina. Esta área está reservada para envíos directos.
        </p>
        <p>Comparte tu relato (máximo 5-7 cuartillas).</p>
        <p className="px-4 py-2 rounded font-semibold" style={{ background: '#faff00', color: '#222', boxShadow: '0 0 8px #faff00' }}>
          <strong>Nota:</strong> Los archivos enviados serán evaluados antes de ser publicados.
        </p>
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
        className="mx-auto max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-8 border border-black border-2 rounded-lg shadow"
        encType="multipart/form-data"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">Todos los campos son obligatorios. Los campos marcados con (<span className="text-red-600">*</span>) son requeridos.</p>

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
            className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
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
            className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Cuéntanos un poco sobre ti y tu relato..."
          />
        </div>

        {/* Archivos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Archivo (PDF, DOCX, TXT - máx. 1MB) <span className="text-red-600">*</span>
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-1 relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-6 text-gray-500"
          >
            <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
            <p className="text-sm text-gray-500">Máximo 1 archivo de 1MB (5-7 cuartillas)</p>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border border-black border-2 rounded-lg"
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
                  <span className="truncate">{f.name} ({(f.size / (1024 * 1024)).toFixed(2)} MB)</span>
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
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border border-black border-2 rounded-lg"
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
            className="w-full inline-flex justify-center rounded-md bg-black py-2 px-4 text-[#faff00] shadow hover:bg-gray-900 focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
          >
            {isSubmitting ? `Enviando${'.'.repeat(dotCount)}` : 'Enviar relato'}
          </button>
        </div>
      </form>
    </div>
  )
} 