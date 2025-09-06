'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { usePathname, useRouter } from 'next/navigation'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import { DesafioTimeline } from '@/components/DesafioTimeline'
import RelatoDesafio from '@/components/RelatoDesafio'
import PreguntasDesafio from '@/components/PreguntasDesafio'
import siteMetadata from '@/data/siteMetadata'

// Importar hooks y componentes personalizados
import { useFormState } from '../../lib/hooks/useFormState'
import { useTurnstile } from '../../lib/hooks/useTurnstile'
import { useDesafio } from '../../lib/hooks/useDesafio'
import FormularioPublica from '../../components/forms/FormularioPublica'
import PreFormulario from '../../components/forms/PreFormulario'
import HighlightStroke from '@/components/HighlightStroke'
import TranstextoMigrationModal from '@/components/TranstextoMigrationModal'

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

const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!

export default function PublicaClient() {
  const router = useRouter()
  const pathname = usePathname()

  // Estado para el formulario usando el hook personalizado
  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    status,
    setStatus,
    dotCount,
    handleChange,
    setupDotCountInterval,
  } = useFormState({
    email: '',
    description: '',
    files: [],
    agree: false,
    source: '',
  })

  // Inicializar Turnstile
  const { captchaRef, token, initTurnstile, resetTurnstile, removeTurnstile, widgetIdRef } =
    useTurnstile(TURNSTILE_SITEKEY)

  // Hook para gestionar el desafío
  const {
    estado,
    setEstado,
    relatoActual,
    desafio,
    cargando,
    desafioCompletado,
    resultadoDesafio,
    errorCarga,
    preFormularioCompletado,
    handlePreFormularioSubmit,
    iniciarDesafio,
    completarLectura,
    handleCompletarDesafio,
    reiniciarDesafio,
    irAlFormulario,
  } = useDesafio(formData, setFormData)

  // Efecto para contador de puntos durante envío
  useEffect(() => {
    const cleanupFn = setupDotCountInterval()
    return cleanupFn
  }, [isSubmitting])

  // Efecto para inicializar Turnstile cuando cambia la ruta o el estado
  useEffect(() => {
    // Solo cuando estamos en /publica y en el estado de formulario
    if (pathname === '/publica' && estado === 'formulario') {
      console.log('Cambio de ruta detectado, re-inicializando Turnstile')

      // Si hay un widget anterior, lo eliminamos
      removeTurnstile()

      // Programamos una inicialización con un pequeño retraso
      const timer = setTimeout(() => {
        initTurnstile()
      }, 800)

      return () => clearTimeout(timer)
    }

    return () => {
      removeTurnstile()
    }
  }, [pathname, estado])

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que el formulario esté completo
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

    // Intentar recuperar token manualmente como medida adicional
    let currentToken = token
    if (!currentToken) {
      // Buscar en sessionStorage
      try {
        const storedToken = sessionStorage.getItem('turnstileToken')
        if (storedToken) {
          console.log('Recuperando token de sessionStorage para envío')
          currentToken = storedToken
        }
      } catch (err) {
        console.error('Error al acceder a sessionStorage:', err)
      }
    }

    // Si aún no tenemos token pero parece que el captcha está visualmente completado
    // generar un token temporal para permitir continuar
    if (!currentToken && captchaRef.current) {
      const iframeElement = captchaRef.current.querySelector('iframe')
      const successElement = captchaRef.current.querySelector('.cf-turnstile-success')

      if (successElement) {
        console.log('Captcha parece completado visualmente, generando token temporal')
        currentToken = 'manual_bypass_' + Date.now().toString()
      }
    }

    // Validar el captcha de forma más flexible
    if (!currentToken) {
      setStatus({
        success: false,
        message:
          'Por favor completa el captcha "No soy un robot" antes de enviar. Si ya lo marcaste, intenta hacerlo nuevamente.',
      })
      return
    }

    sendGAEvent({
      action: 'submit_publica_form',
      category: 'PublicaForm',
      label: formData.email,
      value: formData.files.length,
    })

    try {
      setIsSubmitting(true)
      setStatus(null)
      const body = new FormData()
      body.append('email', formData.email)
      body.append('description', formData.description)
      body.append('response', currentToken) // Usar el token recuperado o el original
      formData.files.forEach((f) => body.append('files', f))

      console.log('Enviando formulario a /api/publica con email:', formData.email)
      const res = await fetch('/api/publica', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error en el envío')

      // Actualizar Google Sheets para indicar que completó todo el proceso
      try {
        console.log('Actualizando datos en Google Sheets:', {
          email: formData.email,
          source: formData.source,
          etapa: 'formulario_completo',
        })

        const sheetsResponse = await fetch('/api/sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            source: formData.source || 'no especificado', // Asegurar que siempre hay un valor
            etapa: 'formulario_completo',
            archivoEnviado: true,
            fechaEnvio: new Date().toISOString(),
          }),
        })

        if (!sheetsResponse.ok) {
          const sheetsError = await sheetsResponse.text()
          console.error('Error en respuesta de Google Sheets:', sheetsError)
        } else {
          console.log('Actualización de Google Sheets exitosa')
        }
      } catch (error) {
        console.error('Error al actualizar datos en Google Sheets:', error)
      }

      setFormData((prev) => ({ ...prev, description: '', files: [], agree: false }))
      resetTurnstile()

      router.push('/publica/gracias')
    } catch (err) {
      setStatus({ success: false, message: (err as Error).message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Renderizado condicional según el estado
  const renderContenido = () => {
    if (cargando) {
      return (
        <div className="mt-4 flex flex-col items-center justify-center py-6">
          <p className="mb-2 text-lg font-medium">Cargando el desafío</p>
          <div className="flex items-center">
            <span className="mx-[1px] animate-pulse text-xl">.</span>
            <span className="mx-[1px] animate-pulse text-xl" style={{ animationDelay: '200ms' }}>
              .
            </span>
            <span className="mx-[1px] animate-pulse text-xl" style={{ animationDelay: '400ms' }}>
              .
            </span>
          </div>
        </div>
      )
    }

    if (!desafio) {
      return (
        <div className="mx-auto max-w-3xl py-8 text-center">
          <p className="mb-4 text-red-600">
            {errorCarga ||
              'No se pudo cargar el desafío. Inténtalo más tarde o continúa directamente al formulario.'}
          </p>
          <button
            onClick={irAlFormulario}
            className="rounded-lg bg-black px-6 py-3 font-medium text-[#faff00] transition-colors hover:bg-gray-900"
          >
            Ir al formulario directamente
          </button>
        </div>
      )
    }

    switch (estado) {
      case 'pre_formulario':
        return (
          <PreFormulario
            formData={formData}
            handleChange={handleChange}
            onSubmit={handlePreFormularioSubmit}
          />
        )

      case 'leyendo':
        // Registrar pageview del relato actual cuando se entra en modo lectura
        if (
          typeof window !== 'undefined' &&
          (window as any).gtag &&
          desafio?.relatos?.[relatoActual]?.relato
        ) {
          const tituloRelato = desafio.relatos[relatoActual].relato.title || 'Relato sin título'
          // Verificar si author existe y tiene propiedad name
          const autorRelato =
            desafio.relatos[relatoActual].relato.author &&
            typeof desafio.relatos[relatoActual].relato.author === 'object'
              ? desafio.relatos[relatoActual].relato.author.name || 'Autor desconocido'
              : 'Autor desconocido'

          ;(window as any).gtag('event', 'page_view', {
            page_title: `Relato: ${tituloRelato}`,
            page_location: window.location.href,
            page_path: `/publica/desafio/relato/${relatoActual + 1}`,
            send_to: siteMetadata?.analytics?.googleAnalytics?.googleAnalyticsId,
          })
        }

        return (
          <>
            <DesafioTimeline pasoActual={0} totalPasos={2} />
            <div className="pt-4">
              <RelatoDesafio
                relato={desafio.relatos[relatoActual].relato}
                onComplete={completarLectura}
                esUltimoRelato={true}
                permitirRetroceder={false}
                onRetroceder={() => {}}
              />
            </div>
          </>
        )

      case 'preguntas':
        // Filtrar las preguntas relacionadas con el relato actual
        // Según la definición de la interfaz, las preguntas tienen un campo relatoId que corresponde al _id del relato
        const preguntasDelRelato = desafio.preguntas.filter(
          (pregunta: any) => pregunta.relatoId === desafio.relatos[relatoActual].relato._id
        )

        console.log('Relato actual ID:', desafio.relatos[relatoActual].relato._id)
        console.log('Preguntas filtradas para el relato actual:', preguntasDelRelato)
        console.log('Total de preguntas filtradas:', preguntasDelRelato.length)

        // Si no hay preguntas específicas para este relato, podría ser un error
        if (preguntasDelRelato.length === 0) {
          console.warn('No se encontraron preguntas para este relato.')
        }

        // Ajustamos el número mínimo de respuestas correctas según el total de preguntas
        const minimoRespuestasCorrectas = Math.max(1, Math.min(2, preguntasDelRelato.length))

        return (
          <>
            <DesafioTimeline pasoActual={1} totalPasos={2} />
            <div className="pt-4">
              <PreguntasDesafio
                preguntas={preguntasDelRelato}
                onComplete={handleCompletarDesafio}
                minimoRespuestasCorrectas={minimoRespuestasCorrectas}
              />
            </div>
          </>
        )

      case 'resultado':
        return (
          <div className="mx-auto max-w-3xl py-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Resultado del Desafío</h2>
            <div className="mb-4 flex items-center justify-center rounded-lg bg-red-100 p-2 text-red-800 dark:bg-red-900 dark:text-red-100">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">{desafio.mensajeError}</p>
                <p className="text-sm">
                  Respuestas correctas: {resultadoDesafio.respuestasCorrectas}
                </p>
              </div>
            </div>

            <button
              onClick={reiniciarDesafio}
              className="rounded-lg bg-black px-6 py-3 font-medium text-[#faff00] transition-colors hover:bg-gray-900"
            >
              Intentar nuevamente
            </button>
          </div>
        )

      case 'formulario':
        return (
          <>
            <article
              className="prose prose-lg dark:prose-invert mx-auto mb-5"
              style={{
                color: 'var(--color-text-light)',
                backgroundColor: 'var(--color-bg-light)',
              }}
              data-theme-target="prose"
            >
              <PageTitle>
                Publica en{' '}
                <a href="/transtextos" className="underline hover:underline">
                  Transtextos
                </a>
              </PageTitle>

              <p
                className="text-gray-700 dark:text-gray-300"
                style={{ color: 'var(--color-text-light)' }}
              >
                Comparte tu relato para nuestro feed de narrativa (máximo 5-7 cuartillas).
              </p>
              <p
                className="rounded px-4 py-2 font-semibold"
                style={{ background: '#faff00', color: '#222', boxShadow: '0 0 8px #faff00' }}
              >
                <strong>Nota:</strong> Los archivos enviados serán evaluados antes de ser publicados
                en{' '}
                <a
                  href="/transtextos"
                  className="underline hover:underline"
                  style={{ color: '#222' }}
                >
                  Transtextos
                </a>
                .
              </p>
            </article>

            <FormularioPublica
              formData={formData}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              status={status}
              setStatus={setStatus}
              dotCount={dotCount}
              handleChange={handleChange}
              onSubmit={handleSubmit}
              showSource={true}
            />
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="py-4">
      <TranstextoMigrationModal />
      <SectionContainer>
        {/* Texto de bienvenida estático - siempre visible */}
        {estado === 'pre_formulario' && (
          <div
            className="prose prose-lg dark:prose-invert mx-auto mb-8 max-w-3xl"
            style={{
              color: 'var(--color-text-light)',
              backgroundColor: 'var(--color-bg-light)',
            }}
            data-theme-target="prose"
          >
            <h2
              className="text-gray-900 dark:text-gray-100"
              style={{ color: 'var(--color-text-light)' }}
            >
              ¡Publica tu relato!
            </h2>
            <p
              className="text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              Estamos encantados con la idea de leerte y, ojalá, publicarte en{' '}
              <strong>
                <a href="/transtextos" className="underline hover:underline">
                  Transtextos
                </a>
              </strong>
              , nuestro feed de narrativa continua. Pero antes, queremos que conozcas mejor el tipo
              de relatos que buscamos.
            </p>
            <p
              className="text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              1) Te mostraremos un relato breve al azar para que puedas explorar el tono, la
              atmósfera y la mirada narrativa que cultivamos en nuestro feed.
              <HighlightStroke>
                <a href="/criterios-editoriales" className="font-semibold hover:underline">
                  Ver criterios editoriales
                </a>
              </HighlightStroke>
            </p>
            <p
              className="text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              2) Luego de leerlo, te haremos un par de preguntas muy simples. Al responderlas, se
              activará el formulario para enviar tu texto a{' '}
              <a href="/transtextos" className="underline hover:underline">
                Transtextos
              </a>
              .
            </p>
          </div>
        )}

        {/* Cargar script de Turnstile siempre */}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
        {renderContenido()}
      </SectionContainer>
      {estado === 'pre_formulario' && (
        <SectionContainer>
          <div
            className="prose prose-lg dark:prose-invert mx-auto mt-8 max-w-3xl"
            style={{
              color: 'var(--color-text-light)',
              backgroundColor: 'var(--color-bg-light)',
            }}
            data-theme-target="prose"
          >
            <p
              className="text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-text-light)' }}
            >
              Nos comprometemos a leer con atención cada texto recibido para{' '}
              <a href="/transtextos" className="underline hover:underline">
                Transtextos
              </a>
              . En la medida de lo posible, te enviaremos una devolución en clave de taller. Si tu
              relato es seleccionado para nuestro{' '}
              <HighlightStroke>feed de narrativa</HighlightStroke>, te daremos acceso a una{' '}
              <strong>
                selección de ilustraciones especialmente creadas para acompañarlo, y le daremos
                difusión activa a través de nuestras redes sociales.
              </strong>
            </p>
          </div>
        </SectionContainer>
      )}
    </div>
  )
}
