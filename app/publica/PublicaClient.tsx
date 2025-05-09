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
type Estado = 'pre_formulario' | 'leyendo' | 'preguntas' | 'formulario' | 'resultado'

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
    email: '',
    description: '',
    files: [] as File[],
    agree: false,
    source: '', // Cómo nos encontró
  })
  const [token, setToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [dotCount, setDotCount] = useState(0)
  
  // Estados nuevos para el desafío
  const [estado, setEstado] = useState<Estado>('pre_formulario')
  const [relatoActual, setRelatoActual] = useState(0)
  const [desafio, setDesafio] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [desafioCompletado, setDesafioCompletado] = useState(false)
  const [resultadoDesafio, setResultadoDesafio] = useState({
    respuestasCorrectas: 0,
    aprobado: false
  })
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [preFormularioCompletado, setPreFormularioCompletado] = useState(false)

  const allowedExtensions = ['pdf', 'docx', 'txt']

  // Verificar si el usuario ya completó el desafío
  useEffect(() => {
    const yaCompletado = localStorage.getItem('desafioCompletado')
    if (yaCompletado === 'true') {
      setDesafioCompletado(true)
      setEstado('formulario')

      // Recuperar email y source si existen
      const emailGuardado = localStorage.getItem('desafioEmail')
      const sourceGuardado = localStorage.getItem('desafioSource')
      
      console.log('Datos recuperados de localStorage:', { 
        email: emailGuardado, 
        source: sourceGuardado 
      });
      
      // Actualizar formData con los valores guardados
      setFormData(prev => ({
        ...prev,
        email: emailGuardado || prev.email,
        source: sourceGuardado || prev.source
      }))
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
    console.log('Intentando inicializar Turnstile...', {
      turnstileExists: !!window.turnstile,
      captchaRefExists: !!captchaRef.current,
      widgetIdExists: !!widgetIdRef.current
    });
    
    // Pequeño retraso para asegurar que el DOM esté listo
    setTimeout(() => {
      if (window.turnstile && captchaRef.current && widgetIdRef.current === null) {
        console.log('Renderizando widget de Turnstile');
        try {
          const id = window.turnstile.render(captchaRef.current, {
            sitekey: TURNSTILE_SITEKEY,
            callback: t => {
              console.log('Callback de Turnstile ejecutado');
              setToken(t);
            },
          });
          widgetIdRef.current = id;
          console.log('Widget de Turnstile renderizado con ID:', id);
        } catch (error) {
          console.error('Error al renderizar Turnstile:', error);
        }
      } else {
        console.log('No se puede inicializar Turnstile ahora', {
          turnstileExists: !!window.turnstile,
          captchaRefExists: !!captchaRef.current,
          widgetIdExists: !!widgetIdRef.current
        });
      }
    }, 500);
  }

  useEffect(() => {
    if (estado === 'formulario') {
      // Forzar la inicialización de Turnstile cuando cambie el estado a 'formulario'
      console.log('Estado cambiado a formulario, inicializando Turnstile');
      
      // Función para verificar e inicializar Turnstile
      const verificarTurnstile = () => {
        // Si ya existe un widget, removemos para recrearlo
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
        
        // Tratar de inicializar
        if (window.turnstile && captchaRef.current) {
          initTurnstile();
          return true; // Éxito
        }
        return false; // Fallo
      };
      
      // Intento inmediato después de un breve retraso
      const timerInicial = setTimeout(() => {
        if (!verificarTurnstile()) {
          console.log('Primer intento de inicialización fallido, programando intentos adicionales');
        }
      }, 500);
      
      // Intentos adicionales periódicos por si el primer intento falla
      const interval = setInterval(() => {
        if (verificarTurnstile()) {
          console.log('Turnstile inicializado exitosamente en un intento posterior');
          clearInterval(interval);
        }
      }, 1000);
      
      return () => {
        clearTimeout(timerInicial);
        clearInterval(interval);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }
  }, [estado]);

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

  // Validar y procesar el pre-formulario
  const handlePreFormularioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que el email esté completo
    if (!formData.email || !formData.source) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }
    
    // Registrar en Analytics
    sendGAEvent({
      action: 'submit_pre_form',
      category: 'PreFormulario',
      label: formData.email,
      value: 1
    });
    
    // Marcar como completado
    setPreFormularioCompletado(true);
    
    try {
      // Enviar datos al backend
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          source: formData.source,
          etapa: 'pre_formulario',
          fechaRegistro: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        console.error('Error al enviar datos del pre-formulario');
      }
    } catch (error) {
      console.error('Error al enviar datos a la API:', error);
    }
    
    // Avanzar al desafío
    iniciarDesafio();
  };
  
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
      const nuevoRelatoIndex = relatoActual + 1;
      setRelatoActual(nuevoRelatoIndex);
      
      // Registrar pageview del relato
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const tituloRelato = desafio.relatos[nuevoRelatoIndex].relato.title;
        const autorRelato = desafio.relatos[nuevoRelatoIndex].relato.author.name;
        (window as any).gtag('event', 'page_view', {
          page_title: `Relato: ${tituloRelato}`,
          page_location: window.location.href,
          page_path: `/publica/desafio/relato/${nuevoRelatoIndex + 1}`,
          send_to: siteMetadata?.analytics?.googleAnalytics?.googleAnalyticsId
        });
      }
      
      sendGAEvent({
        action: 'leer_relato',
        category: 'Desafio',
        label: `Relato ${relatoActual + 1} completado`
      });
    } else {
      sendGAEvent({
        action: 'iniciar_preguntas',
        category: 'Desafio',
        label: 'Todos los relatos leídos'
      });
      setEstado('preguntas');
    }
  }

  const retrocederRelato = () => {
    if (relatoActual > 0) {
      const nuevoRelatoIndex = relatoActual - 1;
      setRelatoActual(nuevoRelatoIndex);
      
      // Registrar pageview del relato
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const tituloRelato = desafio.relatos[nuevoRelatoIndex].relato.title;
        const autorRelato = desafio.relatos[nuevoRelatoIndex].relato.author.name;
        (window as any).gtag('event', 'page_view', {
          page_title: `Relato: ${tituloRelato}`,
          page_location: window.location.href,
          page_path: `/publica/desafio/relato/${nuevoRelatoIndex + 1}`,
          send_to: siteMetadata?.analytics?.googleAnalytics?.googleAnalyticsId
        });
      }
      
      sendGAEvent({
        action: 'retroceder_relato',
        category: 'Desafio',
        label: `Volver al relato ${relatoActual}`
      });
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

      // Guardar el email y la fuente en localStorage
      if (formData.email) {
        localStorage.setItem('desafioEmail', formData.email)
        
        // Asegurarnos de que el formData tenga el email actualizado
        setFormData(prev => ({
          ...prev,
          email: formData.email
        }))
      }
      
      // Guardar también la fuente (source) en localStorage
      if (formData.source) {
        localStorage.setItem('desafioSource', formData.source)
      }
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
    
    // Guardar datos en localStorage
    if (formData.email) {
      localStorage.setItem('desafioEmail', formData.email);
    }
    
    if (formData.source) {
      localStorage.setItem('desafioSource', formData.source);
    }
    
    // Si no hay email o source actual, intentar recuperarlos del localStorage
    const formDataActualizado = { ...formData };
    let datosRecuperados = false;
    
    const emailGuardado = localStorage.getItem('desafioEmail');
    if (!formDataActualizado.email && emailGuardado) {
      formDataActualizado.email = emailGuardado;
      datosRecuperados = true;
    }
    
    const sourceGuardado = localStorage.getItem('desafioSource');
    if (!formDataActualizado.source && sourceGuardado) {
      formDataActualizado.source = sourceGuardado;
      datosRecuperados = true;
    }
    
    // Actualizar el formData si recuperamos algún dato
    if (datosRecuperados) {
      setFormData(formDataActualizado);
    }
    
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
      case 'pre_formulario':
        return (
          <div className="prose dark:prose-invert max-w-none">
            
            <h2 className="text-2xl font-bold mb-4">{desafio?.titulo || "Bienvenido a MarcaPágina"}</h2>
            <p className="mb-4">{desafio?.descripcion || "Comparte tu relato con nuestra comunidad de lectores. En MarcaPágina publicamos textos que abrazan la creatividad y la imaginación."}</p>
            
            <p className="px-4 py-2 rounded font-semibold" style={{ background: '#faff00', color: '#222', boxShadow: '0 0 8px #faff00' }}>
              <strong>Nota:</strong> Para publicar tu relato, primero necesitamos que completes un breve desafío de lectura.
            </p>
            
            <form 
              onSubmit={handlePreFormularioSubmit}
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
        )
        
      case 'leyendo':
        // Registrar pageview del relato actual cuando se entra en modo lectura
        if (typeof window !== 'undefined' && (window as any).gtag) {
          const tituloRelato = desafio.relatos[relatoActual].relato.title;
          const autorRelato = desafio.relatos[relatoActual].relato.author.name;
          (window as any).gtag('event', 'page_view', {
            page_title: `Relato: ${tituloRelato}`,
            page_location: window.location.href,
            page_path: `/publica/desafio/relato/${relatoActual + 1}`,
            send_to: siteMetadata?.analytics?.googleAnalytics?.googleAnalyticsId
          });
        }
        
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
                  Tu correo electrónico <span className="text-red-600">*</span>
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

              {/* Campo oculto para Source */}
              <div className="text-xs text-gray-500 -mt-2">
                <p>Fuente: {formData.source || 'No especificada'}</p>
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
          </>
        )
      
      default:
        return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    sendGAEvent({
      action: 'submit_publica_form',
      category: 'PublicaForm',
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
      const body = new FormData()
      body.append('email', formData.email)
      body.append('description', formData.description)
      body.append('response', token)
      formData.files.forEach(f => body.append('files', f))

      console.log('Enviando formulario a /api/publica con email:', formData.email);
      const res = await fetch('/api/publica', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error en el envío')

      // Actualizar Google Sheets para indicar que completó todo el proceso
      try {
        console.log('Actualizando datos en Google Sheets:', {
          email: formData.email,
          source: formData.source,
          etapa: 'formulario_completo'
        });
        
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
            fechaEnvio: new Date().toISOString()
          }),
        });
        
        if (!sheetsResponse.ok) {
          const sheetsError = await sheetsResponse.text();
          console.error('Error en respuesta de Google Sheets:', sheetsError);
        } else {
          console.log('Actualización de Google Sheets exitosa');
        }
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
      setStatus({ success: false, message: (err as Error).message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Efecto para re-inicializar cuando cambia la ruta
  useEffect(() => {
    // Solo cuando estamos en /publica y en el estado de formulario
    if (pathname === '/publica' && estado === 'formulario') {
      console.log('Cambio de ruta detectado, re-inicializando Turnstile');
      
      // Si hay un widget anterior, lo eliminamos
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      
      // Programamos una inicialización con un pequeño retraso
      const timer = setTimeout(() => {
        initTurnstile();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div className="py-4">
      <SectionContainer>
        {/* Cargar script de Turnstile siempre */}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
        {renderContenido()}
      </SectionContainer>
    </div>
  )
}
