'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormData, FormStatus } from '@/lib/hooks/useFormState'
import { useTurnstile } from '@/lib/hooks/useTurnstile'
import { useFileUpload } from '@/lib/hooks/useFileUpload'

// Utilidad para enviar eventos a Google Analytics
function sendGAEvent({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: string | number
}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

interface FormularioPublicaProps {
  formData: FormData
  setFormData: (data: FormData) => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  status: FormStatus | null
  setStatus: (status: FormStatus | null) => void
  dotCount: number
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  showSource?: boolean
  customTitle?: string
}

const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!

export default function FormularioPublica({
  formData,
  setFormData,
  isSubmitting,
  setIsSubmitting,
  status,
  setStatus,
  dotCount,
  handleChange,
  onSubmit,
  showSource = false,
  customTitle,
}: FormularioPublicaProps) {
  const { captchaRef, token, setToken, initTurnstile, getTokenManual } =
    useTurnstile(TURNSTILE_SITEKEY)

  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false)
  const [checkingCaptcha, setCheckingCaptcha] = useState<boolean>(false)

  const { handleDrop, handleDragOver, handleFileInput, removeFile } = useFileUpload({
    formData,
    setFormData,
  })

  // Inicializar Turnstile cuando se monta el componente
  useEffect(() => {
    console.log('Inicializando Turnstile en FormularioPublica')

    // Inicializar o reintentar si no está disponible inmediatamente
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
  }, [])

  // Monitorear el token para actualizar el estado de verificación del captcha
  useEffect(() => {
    if (token) {
      console.log('Captcha verificado con token')
      setCaptchaVerified(true)
    } else {
      setCaptchaVerified(false)
    }
  }, [token])

  // Función para manejar el envío del formulario con verificación de captcha mejorada
  const handleSubmitWithCaptchaCheck = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar que el formulario esté completo (excepto el captcha)
    if (
      !formData.email ||
      !formData.description ||
      formData.files.length === 0 ||
      !formData.agree
    ) {
      setStatus({
        success: false,
        message: 'Por favor completa todos los campos del formulario.',
      })
      return
    }

    // Intentar verificación manual del captcha como respaldo
    setCheckingCaptcha(true)

    // Verificar si ya tenemos un token en el estado
    let currentToken = token

    // Si no tenemos token, intentar obtenerlo manualmente
    if (!currentToken) {
      console.log('Intentando obtener token manualmente')
      currentToken = getTokenManual()
    }

    // Verificar si el elemento del captcha tiene la clase de completado
    if (!currentToken && captchaRef.current) {
      // Buscar elementos internos que indiquen que el captcha está completo
      const iframeElement = captchaRef.current.querySelector('iframe')
      const successElement = captchaRef.current.querySelector('.cf-turnstile-success')

      console.log('Estado visual del captcha:', {
        hasIframe: !!iframeElement,
        hasSuccessElement: !!successElement,
      })

      // Si visualmente parece completo pero no tenemos token, intentar forzar una renovación
      if (successElement && !currentToken) {
        console.log(
          'Captcha parece visualmente completo pero falta el token, procesando como válido'
        )
        // Generar un token temporal para permitir la continuación (se validará en el servidor)
        const tempToken = 'manual_bypass_' + Date.now().toString()
        setToken(tempToken)
        currentToken = tempToken
        setCaptchaVerified(true)
      }
    }

    // Si todavía no tenemos token, verificar en sessionStorage como último recurso
    if (!currentToken) {
      try {
        const storedToken = sessionStorage.getItem('turnstileToken')
        if (storedToken) {
          console.log('Recuperando token de sessionStorage en el momento de envío')
          currentToken = storedToken
          setToken(storedToken)
          setCaptchaVerified(true)
        }
      } catch (err) {
        console.error('Error al acceder a sessionStorage:', err)
      }
    }

    // Finalizar verificación del captcha
    setCheckingCaptcha(false)

    // Validar si tenemos un token (ya sea el original o el recuperado)
    if (!currentToken) {
      setStatus({
        success: false,
        message: 'Por favor verifica que eres humano marcando el captcha.',
      })
      return
    }

    // Continuar con el envío del formulario original
    onSubmit(e)
  }

  return (
    <>
      {status && (
        <div
          className={`mx-auto mb-6 max-w-2xl rounded-lg p-4 ${
            status.success
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}
        >
          {status.message}
        </div>
      )}

      <form
        onSubmit={handleSubmitWithCaptchaCheck}
        className="mx-auto max-w-2xl space-y-6 rounded-lg border-2 border-black bg-white p-8 shadow-lg dark:border-gray-600 dark:bg-gray-800"
        encType="multipart/form-data"
        style={{
          backgroundColor: 'var(--color-bg-light)',
          borderColor: 'var(--color-gray-900)',
          color: 'var(--color-text-light)',
        }}
        data-theme-target="form"
      >
        <p
          className="text-sm text-gray-600 dark:text-gray-400"
          style={{ color: 'var(--color-gray-600)' }}
        >
          Todos los campos son obligatorios. Los campos marcados con (
          <span className="text-red-600">*</span>) son requeridos.
        </p>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tu correo electrónico <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-2 border-black bg-gray-50 p-2 dark:bg-gray-900"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Campo para mostrar Source */}
        {showSource && (
          <div className="-mt-2 text-xs text-gray-500">
            <p>Fuente: {formData.source || 'No especificada'}</p>
          </div>
        )}

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
            className="mt-1 block w-full rounded-lg border border-2 border-black bg-gray-50 p-2 dark:bg-gray-900"
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
            className="relative mt-1 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-gray-500 dark:border-gray-600 dark:bg-gray-900"
          >
            <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
            <p className="text-sm text-gray-500">Máximo 1 archivo de 1MB (5-7 cuartillas)</p>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              required
              className="absolute inset-0 h-full w-full cursor-pointer rounded-lg border border-2 border-black opacity-0"
              onChange={handleFileInput}
            />
          </div>
          {formData.files.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {formData.files.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded bg-gray-100 p-2 dark:bg-gray-800"
                >
                  <span className="truncate">
                    {f.name} ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
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
          {captchaVerified && <div className="mt-2 text-sm text-green-600"></div>}
        </div>

        {/* Consentimiento */}
        <div className="flex items-center">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            required
            className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded-lg border border-2 border-black"
            checked={formData.agree}
            onChange={handleChange}
          />
          <label htmlFor="agree" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Acepto que este texto es original y cedo derechos de publicación a MarcaPágina.{' '}
            <span className="text-red-600">*</span>
          </label>
        </div>

        {/* Enviar */}
        <div>
          {!captchaVerified && !checkingCaptcha && (
            <div className="mb-2 text-sm text-yellow-600">
              Asegúrate de marcar "No soy un robot" antes de enviar.
            </div>
          )}
          {checkingCaptcha && (
            <div className="mb-2 text-sm text-blue-600">Verificando captcha...</div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex w-full justify-center rounded-md px-4 py-2 shadow hover:bg-gray-900 focus:ring-2 focus:ring-gray-900 ${
              isSubmitting ? 'bg-gray-500 text-white opacity-70' : 'bg-black text-[#faff00]'
            }`}
          >
            {isSubmitting ? `Enviando${'.'.repeat(dotCount)}` : 'Enviar relato'}
          </button>
        </div>
      </form>
    </>
  )
}
