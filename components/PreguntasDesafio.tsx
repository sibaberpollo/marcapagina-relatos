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
  minimoRespuestasCorrectas = 4 
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
      setPreguntaActual(respuestas.findIndex(r => r === -1))
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
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Desafío de comprensión</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-1">
          Responde correctamente al menos {minimoRespuestasCorrectas} de {preguntas.length} preguntas para continuar.
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2">
          <div 
            className="bg-black dark:bg-[#faff00] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((preguntaActual + 1) / preguntas.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Pregunta {preguntaActual + 1} de {preguntas.length}
        </h3>
        <p className="text-lg mb-4">{preguntaActualObj.pregunta}</p>
        
        <div className="space-y-3">
          {preguntaActualObj.opciones.map((opcion, index) => (
            <div 
              key={index}
              onClick={() => seleccionarRespuesta(index)}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-colors flex items-center ${
                respuestas[preguntaActual] === index 
                  ? 'border-black bg-gray-100 dark:bg-gray-700' 
                  : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
              } ${
                mostrarResultados 
                  ? opcion.esCorrecta 
                    ? 'bg-green-100 dark:bg-green-800 border-green-500'
                    : respuestas[preguntaActual] === index 
                      ? 'bg-red-100 dark:bg-red-800 border-red-500' 
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
      
      <div className="flex justify-between mt-8">
        <button
          onClick={retrocederPregunta}
          disabled={preguntaActual === 0 || mostrarResultados}
          className={`px-4 py-2 rounded-lg ${
            preguntaActual === 0 || mostrarResultados
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Anterior
        </button>
        
        {preguntaActual < preguntas.length - 1 ? (
          <button
            onClick={avanzarPregunta}
            disabled={respuestas[preguntaActual] === -1 || mostrarResultados}
            className={`px-4 py-2 rounded-lg ${
              respuestas[preguntaActual] === -1 || mostrarResultados
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-black text-[#faff00] hover:bg-gray-900'
            }`}
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={verificarRespuestas}
            disabled={respuestas[preguntaActual] === -1 || mostrarResultados}
            className={`px-4 py-2 rounded-lg ${
              respuestas[preguntaActual] === -1 || mostrarResultados
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-black text-[#faff00] hover:bg-gray-900'
            }`}
          >
            Verificar Respuestas
          </button>
        )}
      </div>
      
      {mostrarResultados && (
        <div className={`mt-6 p-4 rounded-lg ${
          resultados.filter(Boolean).length >= minimoRespuestasCorrectas
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
        }`}>
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