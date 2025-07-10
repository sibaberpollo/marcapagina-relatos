import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import { genPageMetadata } from 'app/seo'
import Image from '@/components/Image'
import Link from '@/components/Link'

export async function generateMetadata() {
  return genPageMetadata({
    title: 'Horóscopo Literario | MarcaPágina',
    description: 'Descubre tu horóscopo literario personalizado. Predicciones astrológicas con un toque narrativo único en MarcaPágina.',
  })
}

const zodiacSigns = [
  {
    name: 'Aries',
    date: 'MAR 21-ABR 19',
    image: '/static/images/horoscope/aries.png',
    slug: 'aries'
  },
  {
    name: 'Tauro',
    date: 'ABR 20-MAY 20',
    image: '/static/images/horoscope/tauro.png',
    slug: 'tauro'
  },
  {
    name: 'Géminis',
    date: 'MAY 21-JUN 20',
    image: '/static/images/horoscope/geminis.png',
    slug: 'geminis'
  },
  {
    name: 'Cáncer',
    date: 'JUN 21-JUL 22',
    image: '/static/images/horoscope/cancer.png',
    slug: 'cancer'
  },
  {
    name: 'Leo',
    date: 'JUL 23-AGO 22',
    image: '/static/images/horoscope/leo.png',
    slug: 'leo'
  },
  {
    name: 'Virgo',
    date: 'AGO 23-SEP 22',
    image: '/static/images/horoscope/virgo.png',
    slug: 'virgo'
  },
  {
    name: 'Libra',
    date: 'SEP 23-OCT 22',
    image: '/static/images/horoscope/libra.png',
    slug: 'libra'
  },
  {
    name: 'Escorpio',
    date: 'OCT 23-NOV 21',
    image: '/static/images/horoscope/escorpio.png',
    slug: 'escorpio'
  },
  {
    name: 'Sagitario',
    date: 'NOV 22-DIC 21',
    image: '/static/images/horoscope/sagitario.png',
    slug: 'sagitario'
  },
  {
    name: 'Capricornio',
    date: 'DIC 22-ENE 19',
    image: '/static/images/horoscope/capricornio.png',
    slug: 'capricornio'
  },
  {
    name: 'Acuario',
    date: 'ENE 20-FEB 18',
    image: '/static/images/horoscope/acuario.png',
    slug: 'acuario'
  },
  {
    name: 'Piscis',
    date: 'FEB 19-MAR 20',
    image: '/static/images/horoscope/piscis.png',
    slug: 'piscis'
  }
]

export default function HoroscopoPage() {
  return (
    <div className="relative">
      {/* Background gradiente que cubre toda la parte superior incluyendo breadcrumbs */}
      <div className="fixed top-0 left-0 right-0 h-screen bg-gradient-to-br from-cyan-50 via-primary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 -z-10 pointer-events-none"></div>
      
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

      {/* Main Content */}
      <SectionContainer>
        <div className="py-12">
          {/* Intro Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Predicciones Horoscópicas
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Lee horóscopos diarios, semanales y mensuales que están siempre disponibles en nuestro sitio. 
              Encontrarás una compilación de todas las predicciones astrológicas actuales con un toque literario.
            </p>
          </div>

          {/* Zodiac Signs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 mb-16">
            {zodiacSigns.map((sign, index) => (
              <div key={sign.slug} className="group">
                <Link 
                  href={`/horoscopo/${sign.slug}`}
                  className="block text-center transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative mb-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto rounded-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                      <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl lg:text-4xl text-white font-bold">
                          {sign.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {sign.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sign.date}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Suscríbete
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Recibe tu horóscopo mensual directamente en tu bandeja de entrada
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
                <input
                  type="text"
                  placeholder="Signo Solar"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Suscribirse
              </button>
            </form>
          </div>

          {/* Planets Section */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((planet) => (
                <div key={planet} className="group">
                  <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-primary-200 to-primary-400 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-500 dark:bg-primary-600 opacity-80"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
} 