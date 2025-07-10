'use client'

import SectionContainer from '@/components/SectionContainer'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const zodiacSigns = [
  {
    name: 'Aries',
    date: 'MAR 21-ABR 19',
    slug: 'aries',
    symbol: '♈',
    image: '/static/images/horoscope/aries.png' // placeholder para cuando tengas las imágenes
  },
  {
    name: 'Tauro',
    date: 'ABR 20-MAY 20',
    slug: 'tauro',
    symbol: '♉',
    image: '/static/images/horoscope/tauro.png'
  },
  {
    name: 'Géminis',
    date: 'MAY 21-JUN 20',
    slug: 'geminis',
    symbol: '♊',
    image: '/static/images/horoscope/geminis.png'
  },
  {
    name: 'Cáncer',
    date: 'JUN 21-JUL 22',
    slug: 'cancer',
    symbol: '♋',
    image: '/static/images/horoscope/cancer.png'
  },
  {
    name: 'Leo',
    date: 'JUL 23-AGO 22',
    slug: 'leo',
    symbol: '♌',
    image: '/static/images/horoscope/leo.png'
  },
  {
    name: 'Virgo',
    date: 'AGO 23-SEP 22',
    slug: 'virgo',
    symbol: '♍',
    image: '/static/images/horoscope/virgo.png'
  },
  {
    name: 'Libra',
    date: 'SEP 23-OCT 22',
    slug: 'libra',
    symbol: '♎',
    image: '/static/images/horoscope/libra.png'
  },
  {
    name: 'Escorpio',
    date: 'OCT 23-NOV 21',
    slug: 'escorpio',
    symbol: '♏',
    image: '/static/images/horoscope/escorpio.png'
  },
  {
    name: 'Sagitario',
    date: 'NOV 22-DIC 21',
    slug: 'sagitario',
    symbol: '♐',
    image: '/static/images/horoscope/sagitario.png'
  },
  {
    name: 'Capricornio',
    date: 'DIC 22-ENE 19',
    slug: 'capricornio',
    symbol: '♑',
    image: '/static/images/horoscope/capricornio.png'
  },
  {
    name: 'Acuario',
    date: 'ENE 20-FEB 18',
    slug: 'acuario',
    symbol: '♒',
    image: '/static/images/horoscope/acuario.png'
  },
  {
    name: 'Piscis',
    date: 'FEB 19-MAR 20',
    slug: 'piscis',
    symbol: '♓',
    image: '/static/images/horoscope/piscis.png'
  }
]

// Predicciones mock - luego puedes reemplazar con API
const horoscopePredictions = {
  aries: {
    title: "Mes de Renovación Creativa",
    prediction: "Este mes, Aries, las palabras fluirán como ríos de inspiración. Tu energía se canalizará hacia proyectos creativos que has postergado. Los planetas te invitan a tomar la pluma y escribir esa historia que llevas en el corazón. El amor llegará a través de letras compartidas.",
    lucky: "Número de la suerte: 7 • Color: Rojo pasión • Día favorable: Martes"
  },
  tauro: {
    title: "Estabilidad en las Letras",
    prediction: "Tauro, tu naturaleza perseverante encontrará eco en la lectura pausada y reflexiva. Este mes es ideal para sumergirte en clásicos de la literatura. Tu paciencia será recompensada con descubrimientos profundos. Una amistad literaria marcará tu destino.",
    lucky: "Número de la suerte: 4 • Color: Verde tierra • Día favorable: Viernes"
  },
  geminis: {
    title: "Comunicación Estelar",
    prediction: "Géminis, tu mente ágil brillará este mes. Conversaciones profundas sobre libros y narrativas abrirán nuevas perspectivas. Es momento de compartir tus ideas a través de la escritura. Un encuentro casual en una librería cambiará tu rumbo creativo.",
    lucky: "Número de la suerte: 3 • Color: Amarillo luminoso • Día favorable: Miércoles"
  },
  cancer: {
    title: "Emociones en Verso",
    prediction: "Cáncer, tu sensibilidad estará a flor de piel este mes. La poesía será tu refugio y tu fortaleza. Las historias familiares cobrarán nuevo significado en tu vida. Es tiempo de escribir desde el alma y sanar a través de las palabras.",
    lucky: "Número de la suerte: 2 • Color: Plata lunar • Día favorable: Lunes"
  },
  leo: {
    title: "Protagonista de tu Historia",
    prediction: "Leo, este mes serás el héroe de tu propia narrativa. Tu creatividad brillará con intensidad solar, atrayendo reconocimiento por tus escritos. El drama y la pasión marcarán tus lecturas favoritas. Una historia de amor épica está por comenzar.",
    lucky: "Número de la suerte: 1 • Color: Dorado real • Día favorable: Domingo"
  },
  virgo: {
    title: "Perfección Narrativa",
    prediction: "Virgo, tu ojo crítico te llevará a descubrir obras maestras ocultas. Este mes perfeccionarás tu técnica de escritura con dedicación meticulosa. Los detalles que otros pasan por alto serán tu fortaleza creativa. La organización será clave en tu éxito.",
    lucky: "Número de la suerte: 6 • Color: Azul marino • Día favorable: Miércoles"
  },
  libra: {
    title: "Armonía en las Palabras",
    prediction: "Libra, buscarás el equilibrio perfecto entre forma y contenido en tus lecturas. Las colaboraciones literarias florecerán bajo tu influencia diplomática. Este mes, la belleza de las palabras te inspirará a crear algo sublime. El amor y la literatura se entrelazarán.",
    lucky: "Número de la suerte: 6 • Color: Rosa pastel • Día favorable: Viernes"
  },
  escorpio: {
    title: "Misterios Revelados",
    prediction: "Escorpio, tu intensidad te llevará a las profundidades de los misterios literarios. Este mes descubrirás verdades ocultas en textos ancestrales. Tu escritura adquirirá un poder transformador. Los secretos del pasado iluminarán tu futuro creativo.",
    lucky: "Número de la suerte: 8 • Color: Borgoña intenso • Día favorable: Martes"
  },
  sagitario: {
    title: "Aventuras Narrativas",
    prediction: "Sagitario, tu espíritu aventurero te llevará a explorar literaturas de culturas lejanas. Los viajes, reales o imaginarios, enriquecerán tu perspectiva creativa. Este mes, tus historias cobrarán una dimensión filosófica profunda que inspirará a muchos.",
    lucky: "Número de la suerte: 9 • Color: Púrpura real • Día favorable: Jueves"
  },
  capricornio: {
    title: "Construcción Literaria",
    prediction: "Capricornio, tu disciplina construirá cimientos sólidos para proyectos literarios de largo aliento. Este mes verás frutos de tu constancia creativa. Las tradiciones narrativas te guiarán hacia el reconocimiento. La paciencia será tu mejor aliada.",
    lucky: "Número de la suerte: 10 • Color: Negro elegante • Día favorable: Sábado"
  },
  acuario: {
    title: "Innovación Creativa",
    prediction: "Acuario, tu visión futurista revolucionará los formatos narrativos tradicionales. Este mes experimentarás con nuevas formas de contar historias. Tu originalidad atraerá a mentes afines que compartirán tu visión transformadora del arte literario.",
    lucky: "Número de la suerte: 11 • Color: Turquesa eléctrico • Día favorable: Sábado"
  },
  piscis: {
    title: "Sueños Literarios",
    prediction: "Piscis, tu intuición te conectará con dimensiones oníricas de la creatividad. Este mes, los sueños inspirarán tus mejores escritos. La fantasía y la realidad se fusionarán en tu obra. Un encuentro místico a través de las letras marcará tu destino.",
    lucky: "Número de la suerte: 12 • Color: Azul océano • Día favorable: Jueves"
  }
}

// Función para determinar el signo actual
function getCurrentZodiacSign() {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'tauro'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'geminis'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'escorpio'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagitario'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricornio'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'acuario'
  return 'piscis'
}

export default function HoroscopoClient() {
  const [activeSign, setActiveSign] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const zodiacSectionRef = useRef<HTMLDivElement>(null)

  // Establecer signo activo al cargar la página
  useEffect(() => {
    // Primero verificar si hay un signo en la URL
    const signFromUrl = searchParams.get('sign')
    
    if (signFromUrl && zodiacSigns.some(sign => sign.slug === signFromUrl)) {
      // Si hay un signo válido en la URL, usarlo
      setActiveSign(signFromUrl)
      
      // Hacer scroll automático a la sección de signos al cargar
      setTimeout(() => {
        zodiacSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 300)
    } else {
      // Si no, detectar automáticamente el signo actual
      const currentSign = getCurrentZodiacSign()
      setActiveSign(currentSign)
    }
  }, [searchParams])

  const handleSignChange = (signSlug) => {
    setActiveSign(signSlug)
    // Navegar a la nueva URL con parámetros
    router.push(`/horoscopo?sign=${signSlug}`, { scroll: false })
    
    // Hacer scroll suave a la sección del menú zodiacal
    setTimeout(() => {
      zodiacSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const activePrediction = horoscopePredictions[activeSign] || horoscopePredictions.aries

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <SectionContainer>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="relative order-2 lg:order-1">
              <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-4">
                HORÓSCOPO LITERARIO
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-titles">
                Marcapágina Astral
              </h1>
              
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                He comenzado mi carrera astrológica a temprana edad y desde entonces he escrito horóscopos para ediciones internacionales de revistas famosas. Mis horóscopos en línea gratuitos son leídos por más de 5.000 personas con un enfoque narrativo único.
              </p>
              
              <button className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100 hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200">
                VER MÁS
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Right Column - Artistic Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Background geometric shapes */}
                <div className="absolute inset-0">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-200 to-cyan-300 dark:from-cyan-800 dark:to-cyan-900 rounded-full opacity-60"></div>
                  <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-primary-200 to-primary-300 dark:from-primary-800 dark:to-primary-900 opacity-70 transform rotate-45"></div>
                  <div className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-900 rounded-full opacity-50"></div>
                </div>

                {/* Central silhouette area */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-80 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300 rounded-full opacity-20">
                    {/* Constellation dots and lines */}
                    <div className="absolute inset-0">
                      <div className="absolute top-8 left-12 w-2 h-2 bg-white dark:bg-gray-800 rounded-full"></div>
                      <div className="absolute top-16 right-16 w-1.5 h-1.5 bg-white dark:bg-gray-800 rounded-full"></div>
                      <div className="absolute bottom-24 left-8 w-2 h-2 bg-white dark:bg-gray-800 rounded-full"></div>
                      <div className="absolute bottom-32 right-12 w-1.5 h-1.5 bg-white dark:bg-gray-800 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-400 rounded-full"></div>
                      
                      {/* Connecting lines */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 320">
                        <path d="M48 32 L240 64 L32 256 L224 288" stroke="currentColor" strokeWidth="1" fill="none" className="text-gray-400 dark:text-gray-600" opacity="0.5"/>
                        <path d="M128 160 L200 100 L180 240" stroke="currentColor" strokeWidth="1" fill="none" className="text-gray-400 dark:text-gray-600" opacity="0.5"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-12 left-8 w-1 h-1 bg-primary-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-32 right-8 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-16 left-16 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <div className="absolute bottom-40 right-24 w-1 h-1 bg-primary-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Main Content sobre fondo blanco normal */}
      <SectionContainer>
        <div className="py-12" ref={zodiacSectionRef}>
          {/* Intro Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Tu Horóscopo Literario
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Selecciona tu signo zodiacal para descubrir las predicciones astrológicas con un toque narrativo único.
            </p>
          </div>

          {/* Zodiac Signs Tabs - Estilo Avatar */}
          <div className="mb-8">
            <div className="relative">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pb-4">
                <div className="flex gap-4 min-w-max px-2">
                  {zodiacSigns.map((sign) => (
                    <button
                      key={sign.slug}
                      onClick={() => handleSignChange(sign.slug)}
                      className="flex-shrink-0 flex flex-col items-center group"
                    >
                      <div className="relative mb-3">
                        <div className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                          activeSign === sign.slug
                            ? 'bg-primary-500 transform scale-105'
                            : 'bg-black hover:bg-gray-800'
                        }`}>
                          {/* Placeholder para imagen - por ahora usamos la primera letra */}
                          <span className={`text-xl md:text-2xl lg:text-3xl font-bold ${
                            activeSign === sign.slug ? 'text-black' : 'text-white'
                          }`}>
                            {sign.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className={`text-sm font-semibold transition-colors ${
                          activeSign === sign.slug
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {sign.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {sign.date.split('-')[0]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Predicción Activa - Sobre fondo principal */}
          {activeSign && (
            <div className="p-8 lg:p-12 mb-16">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <span className="text-4xl">
                      {zodiacSigns.find(sign => sign.slug === activeSign)?.symbol}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {zodiacSigns.find(sign => sign.slug === activeSign)?.name}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {zodiacSigns.find(sign => sign.slug === activeSign)?.date}
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-center">
                  <h4 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-6">
                    {activePrediction.title}
                  </h4>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
                    {activePrediction.prediction}
                  </p>
                  <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {activePrediction.lucky}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Suscríbete al Horóscopo Literario
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Recibe predicciones personalizadas y recomendaciones de lectura basadas en tu signo zodiacal
            </p>
            
            <form className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <select className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Tu signo</option>
                  {zodiacSigns.map((sign) => (
                    <option key={sign.slug} value={sign.slug}>
                      {sign.symbol} {sign.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="mt-4 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
} 