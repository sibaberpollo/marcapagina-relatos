'use client'

import SectionContainer from '@/components/SectionContainer'
import ShareIcons from '@/components/ShareIcons'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const zodiacSigns = [
  {
    name: 'Aries',
    date: 'MAR 21-ABR 19',
    slug: 'aries',
    symbol: '♈',
    image: '/static/images/horoscope/aries.png'
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

// 1. Definir los textos literarios para cada época
const literaryHoroscopesCancer = {
  aries: {
    text: 'Semana tipo Rayuela, pero sin saber en qué capítulo estás ni quién te observa desde la otra acera. Cuidado con los ascensores emocionales: pueden devolverte al inicio.'
  },
  tauro: {
    text: 'Tu terquedad alcanza niveles quijotescos. Solo que esta vez los molinos tienen WiFi y Sancho está viendo series. Replantéate ese mensaje antes de enviarlo.'
  },
  geminis: {
    text: 'Demasiadas versiones de ti. Esta semana, elige un solo narrador y dale voz. Tus amigos ya creen que estás atrapado en un taller eterno con Ricardo Piglia.'
  },
  cancer: {
    text: 'Tu nostalgia podría protagonizar un cuento de Benedetti, pero con delivery en vez de cartas. Llama a alguien, aunque solo sea para hablar del clima (o del fin del mundo).'
  },
  leo: {
    text: 'Te sientes como el protagonista de una distopía: todo gira en torno a ti, pero nadie te escucha. Tal vez sea hora de cerrar el diario íntimo y abrir una ventana. Literalmente.'
  },
  virgo: {
    text: 'Tu obsesión por el detalle cruzó la línea: estás editando mentalmente las conversaciones ajenas. Un Cortázar interior quiere corregir la realidad. Déjalo, pero solo hasta el martes.'
  },
  libra: {
    text: 'Vas a encontrar belleza en algo completamente asimétrico, como un verso cojo o un perro callejero. Esta semana no es para balancearse, sino para desbalancearse con estilo.'
  },
  escorpio: {
    text: 'Tu intensidad podría arruinar hasta una viñeta de Mafalda. Aprende a leer entre líneas... y a no subrayarlas todas. No todo lo que duele es tragedia.'
  },
  sagitario: {
    text: 'Estás tentado a empezar una novela sin tener final. Hazlo. Solo recuerda que hasta Bolaño borraba. El fuego creativo no justifica que le escribas a tu ex "por inspiración".'
  },
  capricornio: {
    text: 'Vas camino a convertirte en personaje de tu propia tesis. Trabajas, planificas, documentas... pero alguien te soñó y ya estás despertando en otra novela. No temas al borrador.'
  },
  acuario: {
    text: 'Esta semana tu rebeldía tendrá ecos de Arlt, pero en clave de grupo de WhatsApp. Un pequeño acto anárquico puede redimir tu rutina. Eso sí: no pongas todo en mayúsculas.'
  },
  piscis: {
    text: 'Te va a caer una revelación como en los cuentos de Clarice Lispector: suave, extraña, inevitable. No intentes explicarla. Solo toma nota. Y si puedes, escribe con la luz apagada.'
  }
}

// Textos literarios para Leo (actuales)
const literaryHoroscopesLeo = {
  aries: {
    text: 'Hay algo en el aire que te empuja a hacer declaraciones grandilocuentes tipo prólogo de novela rusa. Pero cuidado: no todas las tragedias merecen 800 páginas.'
  },
  tauro: {
    text: 'Tu fidelidad está a prueba. No con personas, sino con playlists. El algoritmo te traicionará. Serás tentado por una cumbia cósmica. Entrégate.'
  },
  geminis: {
    text: 'Estás a punto de iniciar tres proyectos nuevos. Todos contradictorios. Ninguno urgente. Uno terminará siendo un poema. O una deuda. O ambos.'
  },
  cancer: {
    text: 'Tus emociones te piden subtítulos. Esta semana alguien se los pondrá. ¿El problema? Estarán mal traducidos. No corrijas. Observa.'
  },
  leo: {
    text: 'Tu drama personal cobra dimensiones épicas, tipo tragedia griega pero con ChatGpt. Vas a querer gritar: "¡Yo nací para esto!". Y sí. Pero bájale dos tonos.'
  },
  virgo: {
    text: 'Vas a hacer una lista de listas. Y otra para revisar las anteriores. Si eso no te da paz, prueba con leer en voz alta a alguien que no te interrumpa.'
  },
  libra: {
    text: 'Estás en una fase estética intensa. Cualquier cosa fuera de simetría te altera el chi. Respira. Hasta el mejor verso cojea a veces.'
  },
  escorpio: {
    text: 'Una carta no enviada, una foto no borrada, un mensaje no leído. Todo eso eres tú esta semana. Intenso, como siempre. Pero con estilo noir.'
  },
  sagitario: {
    text: 'Esta semana vas a querer contarle a todos tu próxima idea brillante. No lo hagas. Déjala fermentar. No todo vino se bebe joven.'
  },
  capricornio: {
    text: 'Descubrirás que alguien escribió antes lo que estás pensando. ¿Plagio cósmico? No. Es el inconsciente colectivo pidiéndote una cita en letra chica.'
  },
  acuario: {
    text: 'Te va a tocar ser el raro en una sala de gente rara. Brilla. Nadie como tú para organizar el caos sin que parezca que estás mandando.'
  },
  piscis: {
    text: 'Un sueño extraño va a darte el título de algo importante. No sabrás si es cuento, diario, despedida o mantra.'
  }
}

// Datos específicos para cada horóscopo
const horoscopoData = {
  cancer: {
    author: 'Franz Kafka',
    authorImage: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1752236442/Kafka_cancer_qeyz7p.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description: 'Frágil, nocturno, con traumas heredados y la pulsión inagotable de escribir sin que nadie lo lea. El cáncer arquetípico: todo le duele, pero lo convierte en literatura. "Soy literatura o nada", dijo. Murió pidiendo que quemaran todo lo que había escrito. Nadie le hizo caso.',
    efemerides: [
      {
        date: '3 de julio de 1883',
        title: 'Nace Franz Kafka',
        description: 'Lo celebra escribiendo cartas imposibles a su padre.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400'
      },
      {
        date: '10 de julio de 1871',
        title: 'Nace Marcel Proust',
        description: 'Aún no encuentra la magdalena perfecta.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        date: '18 de julio de 1817',
        title: 'Muere Jane Austen',
        description: 'La ironía sobrevivió. Su virginidad, también.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400'
      }
    ],
         tarot: {
       image: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1752495990/tarot-julio-500_eexugw.png',
       author: 'Alice Munro',
       subtitle: 'Las tres lunas de Júpiter',
       card: 'El Ahorcado',
       phrase: 'La felicidad constante es la curiosidad',
       description: 'Las tres lunas interiores de Júpiter —Ío, Europa y Ganímedes— mantienen una resonancia orbital: tocan la misma nota, pero en octavas diferentes. Las transformaciones que atraviesan los personajes en los libros de Alice Munro resuenan en nuestras vidas, invitándonos a observar con compasión infinita nuestro viaje y el de quienes nos rodean. Permite que el silencio sideral acentúe la sensibilidad y la tenacidad de Cáncer, uniendo corazón y mente para perseverar.',
       meaningTitle: undefined,
       meaningDescription: undefined
     },
     writers: undefined
  },
  leo: {
    author: 'H.P. Lovecraft',
    authorImage: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1753183953/Leo_Lovecraft_tahvd6.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description: 'H.P. Lovecraft es nuestro icónico Leo, un signo que brilla como nadie, sufre como todos y crea mundos con una metáfora. Nuestro legendario escritor describió en sus historias desde antiguos tratados, como el innombrable Necronomicón, del árabe Abdul Alhazred -un libro nunca visto, pero del que se murmuran cosas monstruosas, de saberes arcanos y magia ritual, registro de fórmulas olvidadas que permiten contactar con unas entidades sobrenaturales de un inmenso poder-, hasta personajes como el alquimista Charles Le Socier, pasando por un universo de mundos y bestias maravillosas que no dejan de cautivar.',
    efemerides: [
      {
        date: '23 de julio de 1888',
        title: 'Nace Raymond Chandler',
        description: 'Ya escribía frases secas desde el útero.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400'
      },
      {
        date: '28 de julio de 1866',
        title: 'Nace Beatrix Potter',
        description: 'Crea animales que hablan mejor que muchos políticos.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        date: '30 de julio de 1818',
        title: 'Nace Emily Brontë',
        description: 'Cumbres borrascosas y ningún pendiente más.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400'
      },
      {
        date: '31 de julio de 1965',
        title: 'Nace J.K. Rowling',
        description: 'Leo con horóscopo ascendente en retweet.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400'
      },
      {
        date: '5 de agosto de 1850',
        title: 'Nace Guy de Maupassant',
        description: 'El primero en describir fantasmas que también eran deudas.',
        color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
        borderColor: 'border-teal-100 dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-teal-400'
      },
      {
        date: '9 de agosto de 1896',
        title: 'Muere Hermann Melville',
        description: 'Su editor aún esperaba la segunda parte de Moby-Dick.',
        color: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
        borderColor: 'border-indigo-100 dark:border-indigo-800/30',
        textColor: 'text-indigo-600 dark:text-indigo-400'
      },
      {
        date: '15 de agosto de 1769',
        title: 'Nace Napoleón',
        description: 'No escribió novelas, pero inspiró miles.',
        color: 'from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20',
        borderColor: 'border-rose-100 dark:border-rose-800/30',
        textColor: 'text-rose-600 dark:text-rose-400'
      }
    ],
         tarot: {
       image: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1753183953/tarot-leo_onlpy8.png',
       author: 'Charles Le Sorcier',
       subtitle: 'El Hechicero Inmortal',
       card: 'La Fuerza',
       phrase: 'El conocimiento arcano sobrevive al tiempo',
       description: 'En el tarot, La Fuerza, la octava carta de los Arcanos Mayores, domina a los hijos de Leo, y corresponde al tránsito del Sol en este signo. Los nacidos en Leo, no dudan de las cosas que tienen que hacer, son buenos para todo, inteligentes, e idealistas. Magnéticos y honestos, les encanta estar en el punto de mira. El león representa su naturaleza apasionada y su fuerza, el coraje, el deseo y la necesidad de conexión humana. Pero, cuidado, cuando estas necesidades no se satisfacen, se vuelven abrumadores y la naturaleza destructiva del león se manifiesta.',
       meaningTitle: 'Significado de la tirada',
       meaningDescription: 'El consultante está enfrentando una situación marcada por una obsesión no resuelta. Hay una energía persistente que ha sobrevivido al tiempo, y ahora exige atención o resolución. Presencia de sabiduría arcana o conocimientos prohibidos. Advertencia: el consultante puede estar atrapado en su pasado. Esta carta representa la eternidad del conocimiento y la conexión con el creador. El relato y su personificación. Le Sorcier no sólo es un personaje: es la encarnación de todos los que buscan dominar la realidad a través del saber. Lovecraft, en las sombras, recuerda que incluso los horrores más grandes existen porque alguien los soñó.'
     },
    writers: [
      'Henrik Pontoppidan (Premio Nobel 1917)', 'Alexandre Dumas', 'Elias Canetti (Premio Nobel 1981)', 
      'Aldous Huxley', 'George Bernard Shaw (Premio Nobel 1925)', 'Giosuè Carducci (Premio Nobel 1906)', 
      'Malcolm Lowry', 'Eyvind Johnson (Premio Nobel 1974)', 'Emily Brontë', 'Cees Nooteboom', 
      'Herman Melville', 'Isabel Allende', 'Rómulo Gallegos', 'Knut Hamsun (Premio Nobel 1920)', 
      'Virgilio Piñera', 'Guy de Maupassant', 'Jostein Gaarder', 'Alfred Döblin', 'Jorge Amado', 
      'Jacinto Benavente (Premio Nobel 1922)', 'John Galsworthy (Premio Nobel 1932)', 'Stieg Larsson', 
      'Charles Bukowski', 'V.S. Naipual (Premio Nobel 2001)', 'Herta Müller (Premio Nobel 2009)', 
      'Jonathan Franzen', 'H.P. Lovecraft', 'Salvatore Quasimodo (Premio Nobel 1959)', 'Emilio Salgari', 
      'Ray Bradbury'
    ]
  }
}

interface HoroscopoClientProps {
  signo?: 'cancer' | 'leo'
}

export default function HoroscopoClient({ signo = 'leo' }: HoroscopoClientProps) {
  const [activeSign, setActiveSign] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const zodiacSectionRef = useRef<HTMLDivElement>(null)
  const zodiacScrollRef = useRef<HTMLDivElement>(null)

  // Eliminar toda la lógica de selección de signo, scroll, y el grid horizontal de tabs
  // En su lugar, mostrar todos los signos en una grilla

  // Eliminar la función scrollToActiveSign
  // const scrollToActiveSign = (signSlug: string) => {
  //   if (!zodiacScrollRef.current) return
    
  //   const signIndex = zodiacSigns.findIndex(sign => sign.slug === signSlug)
  //   if (signIndex === -1) return
    
  //   const scrollContainer = zodiacScrollRef.current
  //   const containerWidth = scrollContainer.offsetWidth
    
  //   // Calcular el ancho aproximado de cada elemento (incluyendo gap)
  //   // w-16 md:w-20 lg:w-24 + gap-4 + padding + texto
  //   const itemWidth = window.innerWidth >= 1024 ? 120 : window.innerWidth >= 768 ? 100 : 80
    
  //   // Calcular la posición del signo activo
  //   const signPosition = signIndex * itemWidth
    
  //   // Calcular el scroll para centrar el signo
  //   const scrollLeft = signPosition - (containerWidth / 2) + (itemWidth / 2)
    
  //   // Hacer scroll suave
  //   scrollContainer.scrollTo({
  //     left: Math.max(0, scrollLeft),
  //     behavior: 'smooth'
  //   })
  // }

  // Eliminar el useEffect para establecer el signo activo al cargar la página
  // useEffect(() => {
  //   // Primero verificar si hay un signo en la URL
  //   const signFromUrl = searchParams.get('sign')
    
  //   if (signFromUrl && zodiacSigns.some(sign => sign.slug === signFromUrl)) {
  //     // Si hay un signo válido en la URL, usarlo
  //     setActiveSign(signFromUrl)
      
  //     // Hacer scroll automático a la sección de signos al cargar y centrar el signo
  //     setTimeout(() => {
  //       zodiacSectionRef.current?.scrollIntoView({ 
  //         behavior: 'smooth',
  //         block: 'start'
  //       })
  //       // Centrar el signo en el scroll horizontal
  //       setTimeout(() => scrollToActiveSign(signFromUrl), 100)
  //     }, 300)
  //   } else {
  //     // Si no, detectar automáticamente el signo actual
  //     const currentSign = getCurrentZodiacSign()
  //     setActiveSign(currentSign)
      
  //     // Centrar el signo detectado automáticamente
  //     setTimeout(() => scrollToActiveSign(currentSign), 500)
  //   }
  // }, [searchParams])

  // Eliminar el Efecto adicional para centrar el signo cuando cambie activeSign
  // useEffect(() => {
  //   if (activeSign) {
  //     // Pequeño delay para asegurar que el DOM esté listo
  //     setTimeout(() => scrollToActiveSign(activeSign), 200)
  //   }
  // }, [activeSign])

  // Eliminar la función handleSignChange
  // const handleSignChange = (signSlug) => {
  //   setActiveSign(signSlug)
  //   // Navegar a la nueva URL con parámetros
  //   router.push(`/horoscopo?sign=${signSlug}`, { scroll: false })
    
  //   // Centrar el signo seleccionado en el scroll horizontal
  //   setTimeout(() => scrollToActiveSign(signSlug), 100)
    
  //   // Hacer scroll suave a la sección del menú zodiacal
  //   setTimeout(() => {
  //     zodiacSectionRef.current?.scrollIntoView({ 
  //       behavior: 'smooth',
  //       block: 'start'
  //     })
  //   }, 100)
  // }

  // Eliminar la variable activePrediction
  // const activePrediction = horoscopePredictions[activeSign] || horoscopePredictions.aries

  // Detectar el signo actual o usar el especificado
  const currentSign = signo === 'cancer' ? 'cancer' : 'leo'; // Leo es el signo actual por defecto
  
  // Obtener información del signo actual
  const currentSignInfo = zodiacSigns.find(sign => sign.slug === currentSign);
  
  // Seleccionar el objeto de textos correcto según el signo
  const literaryTexts = signo === 'cancer' ? literaryHoroscopesCancer : literaryHoroscopesLeo;
  const currentSignText = literaryTexts[currentSign]?.text || '';
  
  // Obtener datos del horóscopo según el signo
  const data = horoscopoData[signo];

  // Función para obtener el link del signo
  const getSignLink = (signSlug: string) => {
    if (signSlug === 'leo') return '/horoscopo' // Signo actual
    if (signSlug === 'cancer') return '/horoscopo/cancer' // Archivo disponible
    return '#' // Signos futuros (sin link)
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Fondo geométrico ya existente */}
        <SectionContainer>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Texto literario de Cáncer */}
            <div className="relative order-2 lg:order-1 flex flex-col justify-center">
              <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-4">
                Signo: {signo === 'cancer' ? 'Cáncer' : 'Leo'}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-titles">
{data.author}
              </h1>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
                {data.description}
              </p>
              {/* Autoría de Adriana */}
              <div className="flex items-center gap-4 mt-6 mb-2">
                <img
                  src="https://res.cloudinary.com/dx98vnos1/image/upload/v1749824794/Adriana_Garcia_Sojo_dgbs6y.png"
                  alt="Adriana García S."
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Por:</span>
                  <a
href={`/autor/${data.authorSlug}`}
                    className="text-base font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                  >
{data.authorCredit}
                  </a>
                </div>
              </div>
            </div>
            {/* Right Column - Imagen de Kafka sobre las formas geométricas */}
            <div className="relative order-1 lg:order-2 flex justify-center items-center">
              <img
src={data.authorImage}
                alt={data.author}
                className="w-64 h-auto max-h-72 object-contain z-10"
                style={{ background: 'none', boxShadow: 'none', border: 'none' }}
                loading="lazy"
              />
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Botones de compartir después del hero */}
      <div className="mb-8">
        <ShareIcons 
          title="Horóscopo Literario - Franz Kafka y predicciones astrológicas" 
          slug="horoscopo-literario" 
          className="max-w-md mx-auto"
        />
      </div>

      {/* Main Content sobre fondo blanco normal */}
      <SectionContainer>
          <div className="py-2">
            {/* Efemérides Literarias Section */}
            <div className="mb-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Efemérides
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
              </div>
              
              {/* Scroll horizontal para todas las pantallas */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {data.efemerides.map((efemeride, index) => (
                  <div key={index} className="flex-shrink-0 w-80">
                    <div className={`bg-gradient-to-br ${efemeride.color} p-6 rounded-xl border ${efemeride.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                      <div className={`text-sm font-semibold ${efemeride.textColor} mb-2`}>
                        {efemeride.date}
                      </div>
                      <div className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {efemeride.title}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                        {efemeride.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grilla de signos literarios */}
            <div className="space-y-8 pt-8">
              {/* Card horizontal del signo del mes */}
              {(() => {
                const currentSignData = zodiacSigns.find(sign => sign.slug === currentSign);
                const currentSignText = literaryTexts[currentSign]?.text || '';
                return (
                  <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg border-2 border-orange-200 dark:border-orange-800 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-shrink-0">
                        {currentSignData?.image ? (
                          <div 
                            className="w-24 h-24 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#e7e2d6' }}
                          >
                            <img 
                              src={currentSignData.image} 
                              alt={`Símbolo de ${currentSignData.name}`}
                              className="w-20 h-20 object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="text-6xl">{currentSignData?.symbol}</div>
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <div className="font-bold text-3xl mb-2 text-gray-900 dark:text-gray-100">
                          {currentSignData?.name}
                        </div>
                        <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                          {currentSignData?.date}
                        </div>
                        <div className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                          {currentSignText}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Grid de los demás signos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {zodiacSigns.filter(sign => sign.slug !== currentSign).map((sign) => {
                  const literaryText = literaryTexts[sign.slug]?.text || '';
                  const signLink = getSignLink(sign.slug);
                  const isClickable = signLink !== '#';
                  
                  const cardClasses = `relative bg-white/80 dark:bg-gray-900/70 rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 transition-all duration-200 ${
                    isClickable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-purple-200 dark:hover:border-purple-800' : ''
                  }`;
                  
                  const cardContent = (
                    <div className={cardClasses}>
                      <div className="mb-2">
                        {sign.image ? (
                          <div 
                            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                            style={{ backgroundColor: '#e7e2d6' }}
                          >
                            <img 
                              src={sign.image} 
                              alt={`Símbolo de ${sign.name}`}
                              className="w-12 h-12 object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="text-5xl">{sign.symbol}</div>
                        )}
                      </div>
                      <div className="font-bold text-lg mb-1">{sign.name}</div>
                      <div className="text-sm text-gray-500 mb-3">{sign.date}</div>
                      <div className="text-base text-gray-700 dark:text-gray-300 mb-2">{literaryText}</div>
                      {isClickable && (
                        <div className="mt-auto pt-2">
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            {sign.slug === 'cancer' ? 'Ver archivo' : 'Ver horóscopo'} →
                          </span>
                        </div>
                      )}
                    </div>
                  );
                  
                  return (
                    <div key={sign.name}>
                      {isClickable ? (
                        <a href={signLink} className="block">
                          {cardContent}
                        </a>
                      ) : (
                        cardContent
                      )}
                    </div>
                  );
                })}
              </div>


          </div>
        </div>
      </SectionContainer>

      {/* Bloque de la carta del tarot con fondo geométrico al final */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Fondo geométrico idéntico al hero */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Textura de papel/brush sutil */}
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 40% 70%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 10% 90%, rgba(0, 0, 0, 0.02) 0%, transparent 40%)
            `
          }}></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(0, 0, 0, 0.01) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(0, 0, 0, 0.01) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.01) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.01) 75%)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
          }}></div>
          {/* Formas geométricas sutiles */}
          <div className="absolute top-20 left-[10%] w-32 h-32 bg-gradient-to-br from-cyan-200 to-cyan-300 dark:from-cyan-700 dark:to-cyan-800 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-[15%] w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-700 opacity-25 transform rotate-45"></div>
          <div className="absolute top-60 left-[20%] w-20 h-20 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-full opacity-20"></div>
          <div className="absolute top-10 right-[30%] w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full opacity-15"></div>
          <div className="absolute top-80 right-[8%] w-28 h-28 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800 opacity-20 transform rotate-12"></div>
          
          {/* Partículas pequeñas flotantes */}
          <div className="absolute top-16 left-[65%] w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-52 right-[25%] w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse opacity-35" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-72 left-[15%] w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse opacity-25" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-28 right-[40%] w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse opacity-20" style={{animationDelay: '0.5s'}}></div>
        </div>
        <SectionContainer>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center tracking-wide">
              Lectura del Tarot
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8 rounded-xl p-8">
              {/* Imagen de la carta */}
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <img
                  src={data.tarot.image}
                  alt={`Carta del tarot: ${data.tarot.subtitle}`}
                  className="w-40 h-auto rounded-lg"
                  loading="lazy"
                />
              </div>
              {/* Texto de la carta */}
              <div className="flex-1 text-center md:text-left">
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {data.tarot.author}
                </div>
                <div className="text-base italic text-gray-500 dark:text-gray-400 mb-3">
                  {data.tarot.subtitle}
                </div>
                <div className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-1">
                  {data.tarot.card}
                </div>
                <div className="italic text-gray-700 dark:text-gray-300 mb-4">
                  {data.tarot.phrase}
                </div>
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {data.tarot.description}
                </div>
                
                {/* Significado de la tirada para Leo */}
                {data.tarot.meaningTitle && data.tarot.meaningDescription && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">
                      {data.tarot.meaningTitle}
                    </h4>
                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {data.tarot.meaningDescription}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Botones de compartir debajo de la carta de tarot */}
            <div className="flex justify-center mt-8 mb-4">
              <ShareIcons 
                title="Horóscopo Literario - Franz Kafka y predicciones astrológicas" 
                slug="horoscopo-literario" 
                className="max-w-md"
              />
            </div>

            {/* Lista de escritores Leo */}
            {signo === 'leo' && data.writers && (
              <div className="mt-16">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Escritores Leo
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                  {data.writers.map((writer, index) => (
                    <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {writer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionContainer>
      </section>
    </div>
  )
} 