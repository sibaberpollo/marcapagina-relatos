'use client'

import { useState, useEffect, useRef, DragEvent } from 'react'
import Script from 'next/script'
import { usePathname, useRouter } from 'next/navigation'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import { DesafioTimeline } from '@/components/DesafioTimeline'
import RelatoDesafio from '@/components/RelatoDesafio'
import PreguntasDesafio from '@/components/PreguntasDesafio'
import Image from '@/components/Image'
import * as sanityClient from '../../lib/sanity'

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
const DESAFIO_ID = '328105b0-f2c4-4c54-97ad-4b5e2d5720a8' // ID del desafío creado

// Desafío de respaldo en caso de fallar la conexión con Sanity
const DESAFIO_RESPALDO = {
  titulo: "Bienvenido a MarcaPágina",
  descripcion: "Comparte tu relato con nuestra comunidad de lectores. En MarcaPágina publicamos textos que abrazan la creatividad y la imaginación.",
  activo: true,
  mensajeExito: "¡Felicidades! Has completado el desafío. Ahora puedes enviar tu relato.",
  mensajeError: "No has superado el desafío. Inténtalo de nuevo o continúa directamente al formulario.",
  preguntas: []
};

// Estados posibles
type Estado = 'bienvenida' | 'leyendo' | 'preguntas' | 'formulario' | 'resultado'

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

export default function PublicaClient() {
  const router = useRouter()
  const pathname = usePathname()

  // Estado para el formulario original
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
  const [dotCount, setDotCount] = useState(0)
  
  // Estados nuevos para el desafío
  const [estado, setEstado] = useState<Estado>('bienvenida')
  const [relatoActual, setRelatoActual] = useState(0)
  const [desafio, setDesafio] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [desafioCompletado, setDesafioCompletado] = useState(false)
  const [resultadoDesafio, setResultadoDesafio] = useState({
    respuestasCorrectas: 0,
    aprobado: false
  })
  const [errorCarga, setErrorCarga] = useState<string | null>(null)

  const allowedExtensions = ['pdf', 'docx', 'txt']

  // Verificar si el usuario ya completó el desafío
  useEffect(() => {
    const yaCompletado = localStorage.getItem('desafioCompletado')
    if (yaCompletado === 'true') {
      setDesafioCompletado(true)
      setEstado('formulario')
    }
    
    // Cargar el desafío
    const cargarDesafio = async () => {
      setCargando(true)
      setErrorCarga(null)
      try {
        console.log('Intentando cargar el desafío con ID:', DESAFIO_ID);
        
        // Intentar primero con el ID específico
        let data = await sanityClient.getDesafioById(DESAFIO_ID);
        
        // Si falla, intentar con el desafío activo
        if (!data) {
          console.log('Intentando cargar el desafío activo...');
          data = await sanityClient.getDesafioActivo();
        }
        
        console.log('Respuesta del desafío:', data);
        
        if (data) {
          setDesafio(data)
        } else {
          console.error('El desafío retornó null o undefined');
          setErrorCarga('No se pudo encontrar un desafío activo');
        }
      } catch (error) {
        console.error('Error al cargar el desafío:', error);
        setErrorCarga('Error de conexión a Sanity. Por favor inténtalo más tarde.');
      } finally {
        setCargando(false)
      }
    }
    
    cargarDesafio()
  }, [])

  // Manejar cambios en el formulario
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
    if (pathname === '/publica' && estado === 'formulario') {
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
  }, [pathname, estado])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    sendGAEvent({
      action: 'submit_publica_form',
      category: 'PublicaForm',
      label: formData.name,
      value: formData.files.length,
    })
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

  // Funciones para el desafío
  const iniciarDesafio = () => {
    sendGAEvent({
      action: 'iniciar_desafio',
      category: 'Desafio',
      label: 'Inicio del desafío'
    })
    setEstado('leyendo')
  }

  const avanzarRelato = () => {
    if (relatoActual < desafio.relatos.length - 1) {
      setRelatoActual(relatoActual + 1)
      
      sendGAEvent({
        action: 'leer_relato',
        category: 'Desafio',
        label: `Relato ${relatoActual + 1} completado`
      })
    } else {
      sendGAEvent({
        action: 'iniciar_preguntas',
        category: 'Desafio',
        label: 'Todos los relatos leídos'
      })
      setEstado('preguntas')
    }
  }

  const retrocederRelato = () => {
    if (relatoActual > 0) {
      setRelatoActual(relatoActual - 1)
      
      sendGAEvent({
        action: 'retroceder_relato',
        category: 'Desafio',
        label: `Volver al relato ${relatoActual}`
      })
    }
  }

  const handleCompletarDesafio = (respuestasCorrectas: number, aprobado: boolean) => {
    setResultadoDesafio({
      respuestasCorrectas,
      aprobado
    })
    
    sendGAEvent({
      action: 'completar_desafio',
      category: 'Desafio',
      label: aprobado ? 'Desafío superado' : 'Desafío fallido',
      value: respuestasCorrectas
    })
    
    if (aprobado) {
      // Guardar en localStorage que completó el desafío
      localStorage.setItem('desafioCompletado', 'true')
      setDesafioCompletado(true)
      setEstado('formulario')
    } else {
      setEstado('resultado')
    }
  }

  const reiniciarDesafio = () => {
    setRelatoActual(0)
    setEstado('leyendo')
    
    sendGAEvent({
      action: 'reiniciar_desafio',
      category: 'Desafio',
      label: 'Desafío reiniciado'
    })
  }

  // Función para ir directo al formulario sin desafío
  const irAlFormulario = () => {
    console.log('Yendo directamente al formulario');
    setDesafioCompletado(true);
    localStorage.setItem('desafioCompletado', 'true');
    setEstado('formulario');
  };

  // Renderizado condicional según el estado
  const renderContenido = () => {
    if (cargando) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        </div>
      )
    }
    
    if (!desafio) {
      return (
        <div className="py-8 text-center max-w-3xl mx-auto">
          <p className="text-red-600 mb-4">
            {errorCarga || 'No se pudo cargar el desafío. Inténtalo más tarde o continúa directamente al formulario.'}
          </p>
          <button
            onClick={irAlFormulario}
            className="px-6 py-3 bg-black text-[#faff00] rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Ir al formulario directamente
          </button>
        </div>
      )
    }
    
    switch (estado) {
      case 'bienvenida':
        return (
          <div className="prose dark:prose-invert max-w-none">
            <div className="flex flex-col items-center mb-8">
              <Image
                src="/static/images/logo.jpg"
                alt="Marcapágina Logo"
                width={150}
                height={150}
                className="h-36 w-36 rounded-full border-4 border-black mb-4"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{desafio.titulo}</h2>
            <p className="mb-4">{desafio.descripcion}</p>
            
            <p className="px-4 py-2 rounded font-semibold" style={{ background: '#faff00', color: '#222', boxShadow: '0 0 8px #faff00' }}>
              <strong>Nota:</strong> Este proceso nos ayuda a mantener la calidad y coherencia de nuestras publicaciones.
            </p>
            
            <div className="text-center mt-8">
              <button
                onClick={iniciarDesafio}
                className="px-6 py-3 bg-black text-[#faff00] rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Comenzar Desafío
              </button>
            </div>
          </div>
        )
        
      case 'leyendo':
        return (
          <>
            <DesafioTimeline pasoActual={relatoActual} totalPasos={desafio.relatos.length + 1} />
            <div className="pt-4">
              <RelatoDesafio
                relato={desafio.relatos[relatoActual].relato}
                onComplete={avanzarRelato}
                esUltimoRelato={relatoActual === desafio.relatos.length - 1}
                permitirRetroceder={relatoActual > 0}
                onRetroceder={retrocederRelato}
              />
            </div>
          </>
        )
        
      case 'preguntas':
        return (
          <>
            <DesafioTimeline pasoActual={desafio.relatos.length} totalPasos={desafio.relatos.length + 1} />
            <div className="pt-4">
              <PreguntasDesafio
                preguntas={desafio.preguntas}
                onComplete={handleCompletarDesafio}
                minimoRespuestasCorrectas={4}
              />
            </div>
          </>
        )
        
      case 'resultado':
        return (
          <div className="max-w-3xl mx-auto text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Resultado del Desafío</h2>
            <div className="p-6 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 mb-6">
              <p className="text-lg font-semibold mb-2">{desafio.mensajeError}</p>
              <p>Respuestas correctas: {resultadoDesafio.respuestasCorrectas}</p>
            </div>
            
            <button
              onClick={reiniciarDesafio}
              className="px-6 py-3 bg-black text-[#faff00] rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        )
        
      case 'formulario':
        return (
          <>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="afterInteractive"
            />

            <article className="prose prose-lg dark:prose-invert mx-auto mb-5">
              <PageTitle>Publica con nosotros</PageTitle>
              {desafioCompletado && desafio && (
                <div className="p-4 mb-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                  <p className="font-semibold">{desafio.mensajeExito}</p>
                </div>
              )}
              {desafioCompletado && !desafio && (
                <div className="p-4 mb-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                  <p className="font-semibold">¡Gracias por tu interés en publicar con nosotros! Por favor, completa el formulario a continuación.</p>
                </div>
              )}
              {!desafioCompletado && !desafio && (
                <div className="p-4 mb-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100">
                  <p className="font-semibold">Bienvenido al formulario de publicación. Por favor, comparte tu relato con nosotros.</p>
                </div>
              )}
              <p>
                En MarcaPágina celebramos la fuerza de la ficción para encender la imaginación y tejer nuevos mundos.
              </p>
              <p>Comparte tu relato: cuéntanos quién eres, tus influencias y adjunta tu historia.</p>
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
                  className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
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
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="py-16">
      <SectionContainer>
        {renderContenido()}
      </SectionContainer>
    </div>
  )
}
