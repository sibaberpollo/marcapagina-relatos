import { useState, useEffect } from 'react'
import { FormData } from './useFormState'
import * as sanityClient from '../../lib/sanity'
import siteMetadata from '@/data/siteMetadata'

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

// Estados posibles del flujo del desafío
export type Estado = 'pre_formulario' | 'leyendo' | 'preguntas' | 'formulario' | 'resultado'

// Desafío de respaldo en caso de fallar la conexión con Sanity
const DESAFIO_RESPALDO = {
  titulo: 'Bienvenido a MarcaPágina',
  descripcion:
    'Comparte tu relato con nuestra comunidad de lectores. En MarcaPágina publicamos textos que abrazan la creatividad y la imaginación.',
  activo: true,
  mensajeExito: '¡Felicidades! Has completado el desafío. Ahora puedes enviar tu relato.',
  mensajeError:
    'No has superado el desafío. Inténtalo de nuevo o continúa directamente al formulario.',
  preguntas: [],
  relatos: [],
}

const DESAFIO_ID = '328105b0-f2c4-4c54-97ad-4b5e2d5720a8' // ID del desafío creado

export interface ResultadoDesafio {
  respuestasCorrectas: number
  aprobado: boolean
}

export function useDesafio(formData: FormData, setFormData: (data: FormData) => void) {
  const [estado, setEstado] = useState<Estado>('pre_formulario')
  const [relatoActual, setRelatoActual] = useState(0)
  const [desafio, setDesafio] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [desafioCompletado, setDesafioCompletado] = useState(false)
  const [resultadoDesafio, setResultadoDesafio] = useState<ResultadoDesafio>({
    respuestasCorrectas: 0,
    aprobado: false,
  })
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [preFormularioCompletado, setPreFormularioCompletado] = useState(false)

  // Verificar si el usuario ya completó el desafío y cargar desafío
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
        source: sourceGuardado,
      })

      // Actualizar formData con los valores guardados
      setFormData({
        ...formData,
        email: emailGuardado || formData.email,
        source: sourceGuardado || formData.source,
      })
    }

    cargarDesafio()
  }, [])

  // Función para cargar el desafío desde Sanity
  const cargarDesafio = async () => {
    setCargando(true)
    setErrorCarga(null)
    try {
      console.log('Intentando cargar el desafío con ID:', DESAFIO_ID)

      // Intentar primero con el ID específico
      let data = await sanityClient.getDesafioById(DESAFIO_ID)

      // Si falla, intentar con el desafío activo
      if (!data) {
        console.log('Intentando cargar el desafío activo...')
        data = await sanityClient.getDesafioActivo()
      }

      console.log('Respuesta del desafío:', data)
      // Depurar la estructura del desafío
      if (data) {
        console.log('Estructura del desafío:', {
          titulo: data.titulo,
          tienePreguntas: !!data.preguntas,
          numPreguntas: data.preguntas?.length || 0,
          numRelatos: data.relatos?.length || 0,
        })
      }

      if (data) {
        setDesafio(data)

        // Seleccionar un relato aleatorio si hay más de uno disponible
        if (data.relatos && data.relatos.length > 0) {
          // Seleccionar un relato aleatorio
          const randomIndex = Math.floor(Math.random() * data.relatos.length)
          setRelatoActual(randomIndex)
          console.log(
            `Seleccionado relato aleatorio en posición ${randomIndex} de ${data.relatos.length}`
          )

          // Depurar información sobre el relato seleccionado
          if (data.relatos[randomIndex]) {
            console.log('Relato seleccionado:', {
              titulo: data.relatos[randomIndex].relato?.title,
              autor: data.relatos[randomIndex].relato?.author?.name || 'Desconocido',
            })
          }
        }
      } else {
        console.error('El desafío retornó null o undefined')
        setErrorCarga('No se pudo encontrar un desafío activo')
      }
    } catch (error) {
      console.error('Error al cargar el desafío:', error)
      setErrorCarga('Error de conexión a Sanity. Por favor inténtalo más tarde.')
    } finally {
      setCargando(false)
    }
  }

  // Procesar el pre-formulario y avanzar al desafío
  const handlePreFormularioSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que el email esté completo
    if (!formData.email || !formData.source) {
      alert('Por favor completa todos los campos obligatorios.')
      return
    }

    // Registrar en Analytics
    sendGAEvent({
      action: 'submit_pre_form',
      category: 'PreFormulario',
      label: formData.email,
      value: 1,
    })

    // Marcar como completado
    setPreFormularioCompletado(true)

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
          fechaRegistro: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        console.error('Error al enviar datos del pre-formulario')
      }
    } catch (error) {
      console.error('Error al enviar datos a la API:', error)
    }

    // Avanzar al desafío
    iniciarDesafio()
  }

  // Iniciar el desafío con el relato aleatorio
  const iniciarDesafio = () => {
    sendGAEvent({
      action: 'iniciar_desafio',
      category: 'Desafio',
      label: 'Inicio del desafío',
    })

    setEstado('leyendo')

    // Registrar pageview del relato seleccionado al azar
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
  }

  // Completar la lectura y avanzar a preguntas
  const completarLectura = () => {
    sendGAEvent({
      action: 'completar_lectura',
      category: 'Desafio',
      label: `Relato ${relatoActual + 1} completado`,
    })

    // Avanzar a las preguntas
    setEstado('preguntas')
  }

  // Manejar la finalización del desafío
  const handleCompletarDesafio = (respuestasCorrectas: number, aprobado: boolean) => {
    setResultadoDesafio({
      respuestasCorrectas,
      aprobado,
    })

    sendGAEvent({
      action: 'completar_desafio',
      category: 'Desafio',
      label: aprobado ? 'Desafío superado' : 'Desafío fallido',
      value: respuestasCorrectas,
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
        setFormData({
          ...formData,
          email: formData.email,
        })
      }

      // Guardar también la fuente (source) en localStorage
      if (formData.source) {
        localStorage.setItem('desafioSource', formData.source)
      }
    } else {
      setEstado('resultado')
    }
  }

  // Reiniciar el desafío
  const reiniciarDesafio = () => {
    // Seleccionar un nuevo relato aleatorio
    if (desafio?.relatos && desafio.relatos.length > 0) {
      const randomIndex = Math.floor(Math.random() * desafio.relatos.length)
      setRelatoActual(randomIndex)
    } else {
      setRelatoActual(0)
    }

    setEstado('leyendo')

    sendGAEvent({
      action: 'reiniciar_desafio',
      category: 'Desafio',
      label: 'Desafío reiniciado',
    })
  }

  // Ir directamente al formulario
  const irAlFormulario = () => {
    console.log('Yendo directamente al formulario')
    setDesafioCompletado(true)
    localStorage.setItem('desafioCompletado', 'true')

    // Guardar datos en localStorage
    if (formData.email) {
      localStorage.setItem('desafioEmail', formData.email)
    }

    if (formData.source) {
      localStorage.setItem('desafioSource', formData.source)
    }

    // Si no hay email o source actual, intentar recuperarlos del localStorage
    const formDataActualizado = { ...formData }
    let datosRecuperados = false

    const emailGuardado = localStorage.getItem('desafioEmail')
    if (!formDataActualizado.email && emailGuardado) {
      formDataActualizado.email = emailGuardado
      datosRecuperados = true
    }

    const sourceGuardado = localStorage.getItem('desafioSource')
    if (!formDataActualizado.source && sourceGuardado) {
      formDataActualizado.source = sourceGuardado
      datosRecuperados = true
    }

    // Actualizar el formData si recuperamos algún dato
    if (datosRecuperados) {
      setFormData(formDataActualizado)
    }

    setEstado('formulario')
  }

  return {
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
  }
}
