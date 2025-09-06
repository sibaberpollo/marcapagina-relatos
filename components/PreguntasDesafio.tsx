import React, { useState, useEffect } from 'react'

type PreguntaOpcion = {
  texto: string
  esCorrecta: boolean
}

type Pregunta = {
  relatoId: string
  pregunta: string
  opciones: PreguntaOpcion[]
}

type PreguntasDesafioProps = {
  preguntas: Pregunta[]
  onComplete: (respuestasCorrectas: number, aprobado: boolean) => void
  minimoRespuestasCorrectas?: number
}

export default function PreguntasDesafio({
  preguntas,
  onComplete,
  minimoRespuestasCorrectas = 4,
}: PreguntasDesafioProps) {
  const [respuestas, setRespuestas] = useState<number[]>(Array(preguntas.length).fill(-1))
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [resultados, setResultados] = useState<boolean[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)

  // Efecto para hacer scroll al inicio cuando se monta el componente
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Efecto para hacer scroll al inicio cuando cambia la pregunta
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [preguntaActual])

  const seleccionarRespuesta = (opcionIndex: number) => {
    // Solo permitir cambios si no se muestran resultados
    if (mostrarResultados) return

    const nuevasRespuestas = [...respuestas]
    nuevasRespuestas[preguntaActual] = opcionIndex
    setRespuestas(nuevasRespuestas)
  }

  const avanzarPregunta = () => {
    // No avanzar si no hay respuesta seleccionada
    if (respuestas[preguntaActual] === -1) return

    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1)
    }
  }

  const retrocederPregunta = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1)
    }
  }

  const verificarRespuestas = () => {
    // Verificar que todas las preguntas tengan respuesta
    if (respuestas.includes(-1)) {
      alert('Por favor responde todas las preguntas')
      // Ir a la primera pregunta sin respuesta
      setPreguntaActual(respuestas.findIndex((r) => r === -1))
      return
    }

    // Calcular resultados
    const resultadosVerificados = preguntas.map((pregunta, index) => {
      const respuestaSeleccionada = respuestas[index]
      return pregunta.opciones[respuestaSeleccionada]?.esCorrecta || false
    })

    setResultados(resultadosVerificados)
    setMostrarResultados(true)

    // Calcular respuestas correctas
    const correctas = resultadosVerificados.filter(Boolean).length
    const aprobado = correctas >= minimoRespuestasCorrectas

    // Notificar al padre
    onComplete(correctas, aprobado)
  }

  const preguntaActualObj = preguntas[preguntaActual]

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold">Desafío de comprensión</h2>
        <p className="mb-1 text-gray-600 dark:text-gray-300">
          Responde correctamente al menos {minimoRespuestasCorrectas} de {preguntas.length}{' '}
          preguntas para continuar.
        </p>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-black transition-all duration-300 dark:bg-[#faff00]"
            style={{ width: `${((preguntaActual + 1) / preguntas.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 text-xl font-semibold">
          Pregunta {preguntaActual + 1} de {preguntas.length}
        </h3>
        <p className="mb-4 text-lg">{preguntaActualObj.pregunta}</p>

        <div className="space-y-3">
          {preguntaActualObj.opciones.map((opcion, index) => (
            <div
              key={index}
              onClick={() => seleccionarRespuesta(index)}
              className={`flex cursor-pointer items-center rounded-lg border-2 p-3 transition-colors ${
                respuestas[preguntaActual] === index
                  ? 'border-black bg-gray-100 dark:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
              } ${
                mostrarResultados
                  ? opcion.esCorrecta
                    ? 'border-green-500 bg-green-100 dark:bg-green-800'
                    : respuestas[preguntaActual] === index
                      ? 'border-red-500 bg-red-100 dark:bg-red-800'
                      : ''
                  : ''
              }`}
            >
              <input
                type="radio"
                checked={respuestas[preguntaActual] === index}
                onChange={() => seleccionarRespuesta(index)}
                className="mr-3 h-4 w-4 border-2 border-black text-black focus:ring-black"
              />
              <span className="flex-grow">{opcion.texto}</span>
              {mostrarResultados && (
                <span className="ml-2">
                  {opcion.esCorrecta ? '✓' : respuestas[preguntaActual] === index ? '✗' : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={retrocederPregunta}
          disabled={preguntaActual === 0 || mostrarResultados}
          className={`rounded-lg px-4 py-2 ${
            preguntaActual === 0 || mostrarResultados
              ? 'cursor-not-allowed bg-gray-300 text-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Anterior
        </button>

        {preguntaActual < preguntas.length - 1 ? (
          <button
            onClick={avanzarPregunta}
            disabled={respuestas[preguntaActual] === -1 || mostrarResultados}
            className={`rounded-lg px-4 py-2 ${
              respuestas[preguntaActual] === -1 || mostrarResultados
                ? 'cursor-not-allowed bg-gray-300 text-gray-600'
                : 'bg-black text-[#faff00] hover:bg-gray-900'
            }`}
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={verificarRespuestas}
            disabled={respuestas[preguntaActual] === -1 || mostrarResultados}
            className={`rounded-lg px-4 py-2 ${
              respuestas[preguntaActual] === -1 || mostrarResultados
                ? 'cursor-not-allowed bg-gray-300 text-gray-600'
                : 'bg-black text-[#faff00] hover:bg-gray-900'
            }`}
          >
            Verificar Respuestas
          </button>
        )}
      </div>

      {mostrarResultados && (
        <div
          className={`mt-6 rounded-lg p-4 ${
            resultados.filter(Boolean).length >= minimoRespuestasCorrectas
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}
        >
          <p className="font-medium">
            {resultados.filter(Boolean).length >= minimoRespuestasCorrectas
              ? '¡Felicidades! Has superado el desafío.'
              : 'No has superado el desafío. Puedes intentarlo de nuevo.'}
          </p>
          <p>
            Respuestas correctas: {resultados.filter(Boolean).length} de {preguntas.length}
          </p>
        </div>
      )}
    </div>
  )
}
