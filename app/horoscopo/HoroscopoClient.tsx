'use client'

import SectionContainer from '@/components/layout/SectionContainer'
import EngageBar from '@/components/content/reactions/EngageBar'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const zodiacSigns = [
  {
    name: 'Aries',
    date: 'MAR 21-ABR 19',
    slug: 'aries',
    symbol: '♈',
    image: '/static/images/horoscope/aries.png',
  },
  {
    name: 'Tauro',
    date: 'ABR 20-MAY 20',
    slug: 'tauro',
    symbol: '♉',
    image: '/static/images/horoscope/tauro.png',
  },
  {
    name: 'Géminis',
    date: 'MAY 21-JUN 20',
    slug: 'geminis',
    symbol: '♊',
    image: '/static/images/horoscope/geminis.png',
  },
  {
    name: 'Cáncer',
    date: 'JUN 21-JUL 22',
    slug: 'cancer',
    symbol: '♋',
    image: '/static/images/horoscope/cancer.png',
  },
  {
    name: 'Leo',
    date: 'JUL 23-AGO 22',
    slug: 'leo',
    symbol: '♌',
    image: '/static/images/horoscope/leo.png',
  },
  {
    name: 'Virgo',
    date: 'AGO 23-SEP 22',
    slug: 'virgo',
    symbol: '♍',
    image: '/static/images/horoscope/virgo.png',
  },
  {
    name: 'Libra',
    date: 'SEP 23-OCT 22',
    slug: 'libra',
    symbol: '♎',
    image: '/static/images/horoscope/libra.png',
  },
  {
    name: 'Escorpio',
    date: 'OCT 23-NOV 21',
    slug: 'escorpio',
    symbol: '♏',
    image: '/static/images/horoscope/escorpio.png',
  },
  {
    name: 'Sagitario',
    date: 'NOV 22-DIC 21',
    slug: 'sagitario',
    symbol: '♐',
    image: '/static/images/horoscope/sagitario.png',
  },
  {
    name: 'Capricornio',
    date: 'DIC 22-ENE 19',
    slug: 'capricornio',
    symbol: '♑',
    image: '/static/images/horoscope/capricornio.png',
  },
  {
    name: 'Acuario',
    date: 'ENE 20-FEB 18',
    slug: 'acuario',
    symbol: '♒',
    image: '/static/images/horoscope/acuario.png',
  },
  {
    name: 'Piscis',
    date: 'FEB 19-MAR 20',
    slug: 'piscis',
    symbol: '♓',
    image: '/static/images/horoscope/piscis.png',
  },
]

// Predicciones mock - luego puedes reemplazar con API
const horoscopePredictions = {
  aries: {
    title: 'Mes de Renovación Creativa',
    prediction:
      'Este mes, Aries, las palabras fluirán como ríos de inspiración. Tu energía se canalizará hacia proyectos creativos que has postergado. Los planetas te invitan a tomar la pluma y escribir esa historia que llevas en el corazón. El amor llegará a través de letras compartidas.',
    lucky: 'Número de la suerte: 7 • Color: Rojo pasión • Día favorable: Martes',
  },
  tauro: {
    title: 'Estabilidad en las Letras',
    prediction:
      'Tauro, tu naturaleza perseverante encontrará eco en la lectura pausada y reflexiva. Este mes es ideal para sumergirte en clásicos de la literatura. Tu paciencia será recompensada con descubrimientos profundos. Una amistad literaria marcará tu destino.',
    lucky: 'Número de la suerte: 4 • Color: Verde tierra • Día favorable: Viernes',
  },
  geminis: {
    title: 'Comunicación Estelar',
    prediction:
      'Géminis, tu mente ágil brillará este mes. Conversaciones profundas sobre libros y narrativas abrirán nuevas perspectivas. Es momento de compartir tus ideas a través de la escritura. Un encuentro casual en una librería cambiará tu rumbo creativo.',
    lucky: 'Número de la suerte: 3 • Color: Amarillo luminoso • Día favorable: Miércoles',
  },
  cancer: {
    title: 'Emociones en Verso',
    prediction:
      'Cáncer, tu sensibilidad estará a flor de piel este mes. La poesía será tu refugio y tu fortaleza. Las historias familiares cobrarán nuevo significado en tu vida. Es tiempo de escribir desde el alma y sanar a través de las palabras.',
    lucky: 'Número de la suerte: 2 • Color: Plata lunar • Día favorable: Lunes',
  },
  leo: {
    title: 'Protagonista de tu Historia',
    prediction:
      'Leo, este mes serás el héroe de tu propia narrativa. Tu creatividad brillará con intensidad solar, atrayendo reconocimiento por tus escritos. El drama y la pasión marcarán tus lecturas favoritas. Una historia de amor épica está por comenzar.',
    lucky: 'Número de la suerte: 1 • Color: Dorado real • Día favorable: Domingo',
  },
  virgo: {
    title: 'Perfección Narrativa',
    prediction:
      'Virgo, tu ojo crítico te llevará a descubrir obras maestras ocultas. Este mes perfeccionarás tu técnica de escritura con dedicación meticulosa. Los detalles que otros pasan por alto serán tu fortaleza creativa. La organización será clave en tu éxito.',
    lucky: 'Número de la suerte: 6 • Color: Azul marino • Día favorable: Miércoles',
  },
  libra: {
    title: 'Armonía en las Palabras',
    prediction:
      'Libra, buscarás el equilibrio perfecto entre forma y contenido en tus lecturas. Las colaboraciones literarias florecerán bajo tu influencia diplomática. Este mes, la belleza de las palabras te inspirará a crear algo sublime. El amor y la literatura se entrelazarán.',
    lucky: 'Número de la suerte: 6 • Color: Rosa pastel • Día favorable: Viernes',
  },
  escorpio: {
    title: 'Misterios Revelados',
    prediction:
      'Escorpio, tu intensidad te llevará a las profundidades de los misterios literarios. Este mes descubrirás verdades ocultas en textos ancestrales. Tu escritura adquirirá un poder transformador. Los secretos del pasado iluminarán tu futuro creativo.',
    lucky: 'Número de la suerte: 8 • Color: Borgoña intenso • Día favorable: Martes',
  },
  sagitario: {
    title: 'Aventuras Narrativas',
    prediction:
      'Sagitario, tu espíritu aventurero te llevará a explorar literaturas de culturas lejanas. Los viajes, reales o imaginarios, enriquecerán tu perspectiva creativa. Este mes, tus historias cobrarán una dimensión filosófica profunda que inspirará a muchos.',
    lucky: 'Número de la suerte: 9 • Color: Púrpura real • Día favorable: Jueves',
  },
  capricornio: {
    title: 'Construcción Literaria',
    prediction:
      'Capricornio, tu disciplina construirá cimientos sólidos para proyectos literarios de largo aliento. Este mes verás frutos de tu constancia creativa. Las tradiciones narrativas te guiarán hacia el reconocimiento. La paciencia será tu mejor aliada.',
    lucky: 'Número de la suerte: 10 • Color: Negro elegante • Día favorable: Sábado',
  },
  acuario: {
    title: 'Innovación Creativa',
    prediction:
      'Acuario, tu visión futurista revolucionará los formatos narrativos tradicionales. Este mes experimentarás con nuevas formas de contar historias. Tu originalidad atraerá a mentes afines que compartirán tu visión transformadora del arte literario.',
    lucky: 'Número de la suerte: 11 • Color: Turquesa eléctrico • Día favorable: Sábado',
  },
  piscis: {
    title: 'Sueños Literarios',
    prediction:
      'Piscis, tu intuición te conectará con dimensiones oníricas de la creatividad. Este mes, los sueños inspirarán tus mejores escritos. La fantasía y la realidad se fusionarán en tu obra. Un encuentro místico a través de las letras marcará tu destino.',
    lucky: 'Número de la suerte: 12 • Color: Azul océano • Día favorable: Jueves',
  },
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
    text: 'Semana tipo Rayuela, pero sin saber en qué capítulo estás ni quién te observa desde la otra acera. Cuidado con los ascensores emocionales: pueden devolverte al inicio.',
  },
  tauro: {
    text: 'Tu terquedad alcanza niveles quijotescos. Solo que esta vez los molinos tienen WiFi y Sancho está viendo series. Replantéate ese mensaje antes de enviarlo.',
  },
  geminis: {
    text: 'Demasiadas versiones de ti. Esta semana, elige un solo narrador y dale voz. Tus amigos ya creen que estás atrapado en un taller eterno con Ricardo Piglia.',
  },
  cancer: {
    text: 'Tu nostalgia podría protagonizar un cuento de Benedetti, pero con delivery en vez de cartas. Llama a alguien, aunque solo sea para hablar del clima (o del fin del mundo).',
  },
  leo: {
    text: 'Te sientes como el protagonista de una distopía: todo gira en torno a ti, pero nadie te escucha. Tal vez sea hora de cerrar el diario íntimo y abrir una ventana. Literalmente.',
  },
  virgo: {
    text: 'Tu obsesión por el detalle cruzó la línea: estás editando mentalmente las conversaciones ajenas. Un Cortázar interior quiere corregir la realidad. Déjalo, pero solo hasta el martes.',
  },
  libra: {
    text: 'Vas a encontrar belleza en algo completamente asimétrico, como un verso cojo o un perro callejero. Esta semana no es para balancearse, sino para desbalancearse con estilo.',
  },
  escorpio: {
    text: 'Tu intensidad podría arruinar hasta una viñeta de Mafalda. Aprende a leer entre líneas... y a no subrayarlas todas. No todo lo que duele es tragedia.',
  },
  sagitario: {
    text: 'Estás tentado a empezar una novela sin tener final. Hazlo. Solo recuerda que hasta Bolaño borraba. El fuego creativo no justifica que le escribas a tu ex "por inspiración".',
  },
  capricornio: {
    text: 'Vas camino a convertirte en personaje de tu propia tesis. Trabajas, planificas, documentas... pero alguien te soñó y ya estás despertando en otra novela. No temas al borrador.',
  },
  acuario: {
    text: 'Esta semana tu rebeldía tendrá ecos de Arlt, pero en clave de grupo de WhatsApp. Un pequeño acto anárquico puede redimir tu rutina. Eso sí: no pongas todo en mayúsculas.',
  },
  piscis: {
    text: 'Te va a caer una revelación como en los cuentos de Clarice Lispector: suave, extraña, inevitable. No intentes explicarla. Solo toma nota. Y si puedes, escribe con la luz apagada.',
  },
}

// Textos literarios para Leo (actuales)
const literaryHoroscopesLeo = {
  aries: {
    text: 'Hay algo en el aire que te empuja a hacer declaraciones grandilocuentes tipo prólogo de novela rusa. Pero cuidado: no todas las tragedias merecen 800 páginas.',
  },
  tauro: {
    text: 'Tu fidelidad está a prueba. No con personas, sino con playlists. El algoritmo te traicionará. Serás tentado por una novela de V.C. Andrews. Entrégate.',
  },
  geminis: {
    text: 'Estás a punto de iniciar tres proyectos nuevos. Todos contradictorios. Ninguno urgente. Uno terminará siendo un poema. O una deuda. O ambos.',
  },
  cancer: {
    text: 'Tus emociones te piden subtítulos. Esta semana alguien se los pondrá. ¿El problema? Estarán mal traducidos. No corrijas. Observa.',
  },
  leo: {
    text: 'Tu drama personal cobra dimensiones épicas, tipo tragedia griega pero con ChatGpt. Vas a querer gritar: "¡Yo nací para esto!". Y sí. Pero bájale dos tonos.',
  },
  virgo: {
    text: 'Vas a hacer una lista de listas. Y otra para revisar las anteriores. Si eso no te da paz, prueba con leer en voz alta a alguien que no te interrumpa.',
  },
  libra: {
    text: 'Estás en una fase estética intensa. Cualquier cosa fuera de simetría te altera el chi. Respira. Hasta el mejor verso cojea a veces.',
  },
  escorpio: {
    text: 'Una carta no enviada, una foto no borrada, un mensaje no leído. Todo eso eres tú esta semana. Intenso, como siempre. Pero con estilo noir.',
  },
  sagitario: {
    text: 'Esta semana vas a querer contarle a todos tu próxima idea brillante. No lo hagas. Déjala fermentar. No todo vino se bebe joven.',
  },
  capricornio: {
    text: 'Descubrirás que alguien escribió antes lo que estás pensando. ¿Plagio cósmico? No. Es el inconsciente colectivo pidiéndote una cita en letra chica.',
  },
  acuario: {
    text: 'Te va a tocar ser el raro en una sala de gente rara. Brilla. Nadie como tú para organizar el caos sin que parezca que estás mandando.',
  },
  piscis: {
    text: 'Un sueño extraño va a darte el título de algo importante. No sabrás si es cuento, diario, despedida o mantra.',
  },
}

// Textos literarios para Virgo (nuevos)
const literaryHoroscopesVirgo = {
  aries: {
    text: 'Tus impulsos parecen escritos por Bukowski con resaca: intensos, desprolijos, pero honestos. Esta semana, un sí rápido te salvará de un no eterno.',
  },
  tauro: {
    text: 'Tu paciencia se agrieta como un tomo viejo de Quevedo. No intentes encuadernar lo que ya no pega: cambia de biblioteca antes de que el polvo te adopte.',
  },
  geminis: {
    text: 'Tienes tantas voces dentro que podrías fundar una revista literaria. Solo cuida que no termine siendo suplemento dominical de tu ego.',
  },
  cancer: {
    text: 'El pasado te busca como spam poético. Esta vez no lo abras: escribe tu propio correo fantasma y mándatelo a ti mismo.',
  },
  leo: {
    text: 'Quieres ser protagonista hasta en el pie de página. Tranquilo: incluso en las notas al margen hay gloria, si sabes usar cursivas.',
  },
  virgo: {
    text: 'Esta semana serás como un personaje de Borges: buscando un orden imposible en medio de una biblioteca infinita. El truco está en aceptar que a veces el mejor hallazgo es perderse entre estantes.',
  },
  libra: {
    text: 'Vas a descubrir que lo imperfecto seduce más que lo exacto, como un haiku torcido que se niega al equilibrio. Déjate llevar por esa grieta.',
  },
  escorpio: {
    text: 'Tu intensidad es tan aguda que harías llorar a Nietzsche en una fonda. No todo requiere martillazos: a veces basta un pie de foto.',
  },
  sagitario: {
    text: 'Se abre ante ti un mapa como novela de aventuras. Pero cuidado: no todos los cofres guardan tesoros; algunos solo polvo y cartas de amor mal escritas.',
  },
  capricornio: {
    text: 'Estás tan ocupado construyendo escaleras que olvidaste mirar si llevan a alguna parte. A veces el verdadero logro es tirarse en la primera grada.',
  },
  acuario: {
    text: 'Tu rareza será aplaudida como performance. Solo recuerda que hasta los dadaístas sabían cuándo cerrar la función.',
  },
  piscis: {
    text: 'El sueño te dictará un párrafo perfecto y al despertar lo habrás olvidado. No importa: lo bello de Piscis es creer que aún lo recuerdas.',
  },
}

// Textos literarios para Libra (nuevos)
const literaryHoroscopesLibra = {
  aries: {
    text: 'Irrumpes en la sobremesa como si fueras un mosquetero de Dumas, pero la reunión era un club de lectura de Marguerite Yourcenar. Brinda igual: tu espada es una cuchara de postre.',
  },
  tauro: {
    text: 'Intentas etiquetar cada emoción con la minucia de un bibliotecario de Umberto Eco. La vida responde con una edición pirata. Acepta que ciertas pasiones vienen sin índice.',
  },
  geminis: {
    text: 'Organizas debate interno como si Italo Calvino te hubiera multiplicado en capítulos alternos. Antes de votar, pregúntale a cuál versión le toca lavar los platos.',
  },
  cancer: {
    text: 'Tu nostalgia arma escenas como una novela de Yasunari Kawabata: delicada, lenta y nevada aun en primavera. Autorízate un escándalo mínimo, quizá un sticker en mayúsculas.',
  },
  leo: {
    text: 'Buscas brillar con la solemnidad de una epopeya de Sor Juana, pero el público quiere un remate a lo Dorothy Parker. Ensaya tu rugido en tres sílabas y con abanico prestado.',
  },
  virgo: {
    text: 'Detectas errores en el universo con la obsesión de una correctora de Tolstói. Antes de demandar a la Vía Láctea, recuerda que los mejores manuscritos incluyen una mancha de té.',
  },
  libra: {
    text: 'Moderás un salón donde Jane Austen compara notas con Molière y todos esperan tu veredicto. Dicta sentencia: que la ironía lleve guantes blancos, pero que se escuche la carcajada.',
  },
  escorpio: {
    text: 'Tu sospecha olfatea secretos como inspector salido de Dostoievski, aunque el caso sea un mensaje sin responder. Usa la intensidad para escribir la confesión, no para revisar celulares.',
  },
  sagitario: {
    text: 'Planeas escapar en globo rumbo a la biblioteca de Julio Verne, pero terminas programando un tour virtual guiado por Cervantes. Igual aventura, menos maletas.',
  },
  capricornio: {
    text: 'Construyes objetivos con la disciplina de George Eliot supervisando una hacienda victoriana. Añade un intermedio picaresco: ni el progreso resiste tanta agenda sin merienda.',
  },
  acuario: {
    text: 'Fundas una comuna futurista digna de Ursula K. Le Guin y le pones horario de lectura obligatoria. Invita a alguien del realismo mágico antes de que te declaren profe sin recreo.',
  },
  piscis: {
    text: 'Sueñas un epílogo marino dictado por Kobo Abe y despiertas con arena en el teclado. Anótalo antes de que Homero reclame derechos de autor.',
  },
}

// Datos específicos para cada horóscopo
const horoscopoData = {
  cancer: {
    author: 'Franz Kafka',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1752236442/Kafka_cancer_qeyz7p.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description:
      'Frágil, nocturno, con traumas heredados y la pulsión inagotable de escribir sin que nadie lo lea. El cáncer arquetípico: todo le duele, pero lo convierte en literatura. "Soy literatura o nada", dijo. Murió pidiendo que quemaran todo lo que había escrito. Nadie le hizo caso.',
    efemerides: [
      {
        date: '3 de julio de 1883',
        title: 'Nace Franz Kafka',
        description: 'Lo celebra escribiendo cartas imposibles a su padre.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '10 de julio de 1871',
        title: 'Nace Marcel Proust',
        description: 'Aún no encuentra la magdalena perfecta.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '18 de julio de 1817',
        title: 'Muere Jane Austen',
        description: 'La ironía sobrevivió. Su virginidad, también.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
    ],
    tarot: {
      image:
        'https://res.cloudinary.com/dx98vnos1/image/upload/v1752495990/tarot-julio-500_eexugw.png',
      author: 'Alice Munro',
      subtitle: 'Las tres lunas de Júpiter',
      card: 'El Ahorcado',
      phrase: 'La felicidad constante es la curiosidad',
      description:
        'Las tres lunas interiores de Júpiter —Ío, Europa y Ganímedes— mantienen una resonancia orbital: tocan la misma nota, pero en octavas diferentes. Las transformaciones que atraviesan los personajes en los libros de Alice Munro resuenan en nuestras vidas, invitándonos a observar con compasión infinita nuestro viaje y el de quienes nos rodean. Permite que el silencio sideral acentúe la sensibilidad y la tenacidad de Cáncer, uniendo corazón y mente para perseverar.',
      meaningTitle: undefined,
      meaningDescription: undefined,
      illustrator: undefined,
    },
    writers: undefined,
  },
  leo: {
    author: 'H.P. Lovecraft',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1753183953/Leo_Lovecraft_tahvd6.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description:
      'H.P. Lovecraft es nuestro icónico Leo, un signo que brilla como nadie, sufre como todos y crea mundos con una metáfora. Nuestro legendario escritor describió en sus historias desde antiguos tratados, como el innombrable Necronomicón, del árabe Abdul Alhazred -un libro nunca visto, pero del que se murmuran cosas monstruosas, de saberes arcanos y magia ritual, registro de fórmulas olvidadas que permiten contactar con unas entidades sobrenaturales de un inmenso poder-, hasta personajes como el alquimista Charles Le Socier, pasando por un universo de mundos y bestias maravillosas que no dejan de cautivar.',
    efemerides: [
      {
        date: '23 de julio de 1888',
        title: 'Nace Raymond Chandler',
        description: 'Ya escribía frases secas desde el útero.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '28 de julio de 1866',
        title: 'Nace Beatrix Potter',
        description: 'Crea animales que hablan mejor que muchos políticos.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '30 de julio de 1818',
        title: 'Nace Emily Brontë',
        description: 'Cumbres borrascosas y ningún pendiente más.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        date: '31 de julio de 1965',
        title: 'Nace J.K. Rowling',
        description: 'Leo con horóscopo ascendente en retweet.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        date: '5 de agosto de 1850',
        title: 'Nace Guy de Maupassant',
        description: 'El primero en describir fantasmas que también eran deudas.',
        color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
        borderColor: 'border-teal-100 dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-teal-400',
      },
      {
        date: '9 de agosto de 1896',
        title: 'Muere Hermann Melville',
        description: 'Su editor aún esperaba la segunda parte de Moby-Dick.',
        color: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
        borderColor: 'border-indigo-100 dark:border-indigo-800/30',
        textColor: 'text-indigo-600 dark:text-indigo-400',
      },
      {
        date: '15 de agosto de 1769',
        title: 'Nace Napoleón',
        description: 'No escribió novelas, pero inspiró miles.',
        color: 'from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20',
        borderColor: 'border-rose-100 dark:border-rose-800/30',
        textColor: 'text-rose-600 dark:text-rose-400',
      },
    ],
    tarot: {
      image: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1753183953/tarot-leo_onlpy8.png',
      author: 'Charles Le Sorcier',
      subtitle: 'El Hechicero Inmortal',
      card: 'La Fuerza',
      phrase: 'El conocimiento arcano sobrevive al tiempo',
      description:
        'En el tarot, La Fuerza, la octava carta de los Arcanos Mayores, domina a los hijos de Leo, y corresponde al tránsito del Sol en este signo. Los nacidos en Leo, no dudan de las cosas que tienen que hacer, son buenos para todo, inteligentes, e idealistas. Magnéticos y honestos, les encanta estar en el punto de mira. El león representa su naturaleza apasionada y su fuerza, el coraje, el deseo y la necesidad de conexión humana. Pero, cuidado, cuando estas necesidades no se satisfacen, se vuelven abrumadores y la naturaleza destructiva del león se manifiesta.',
      meaningTitle: 'Significado de la tirada',
      meaningDescription:
        'El consultante está enfrentando una situación marcada por una obsesión no resuelta. Hay una energía persistente que ha sobrevivido al tiempo, y ahora exige atención o resolución. Presencia de sabiduría arcana o conocimientos prohibidos. Advertencia: el consultante puede estar atrapado en su pasado. Esta carta representa la eternidad del conocimiento y la conexión con el creador. El relato y su personificación. Le Sorcier no sólo es un personaje: es la encarnación de todos los que buscan dominar la realidad a través del saber. Lovecraft, en las sombras, recuerda que incluso los horrores más grandes existen porque alguien los soñó.',
      illustrator: {
        name: '@rebecafg68',
        url: 'https://instagram.com/rebecafg68',
      },
    },
    writers: [
      'Henrik Pontoppidan (Premio Nobel 1917)',
      'Alexandre Dumas',
      'Elias Canetti (Premio Nobel 1981)',
      'Aldous Huxley',
      'George Bernard Shaw (Premio Nobel 1925)',
      'Giosuè Carducci (Premio Nobel 1906)',
      'Malcolm Lowry',
      'Eyvind Johnson (Premio Nobel 1974)',
      'Emily Brontë',
      'Cees Nooteboom',
      'Herman Melville',
      'Isabel Allende',
      'Rómulo Gallegos',
      'Knut Hamsun (Premio Nobel 1920)',
      'Virgilio Piñera',
      'Guy de Maupassant',
      'Jostein Gaarder',
      'Alfred Döblin',
      'Jorge Amado',
      'Jacinto Benavente (Premio Nobel 1922)',
      'John Galsworthy (Premio Nobel 1932)',
      'Stieg Larsson',
      'Charles Bukowski',
      'V.S. Naipual (Premio Nobel 2001)',
      'Herta Müller (Premio Nobel 2009)',
      'Jonathan Franzen',
      'H.P. Lovecraft',
      'Salvatore Quasimodo (Premio Nobel 1959)',
      'Emilio Salgari',
      'Ray Bradbury',
    ],
  },
  virgo: {
    author: 'Agatha Christie',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1755780888/Agatha-Christie_lzxfnz.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description:
      '“El detalle mata, pero también salva.” La reina indiscutida del crimen elegante. Virgo de manual: precisión quirúrgica, memoria enciclopédica de venenos y la capacidad de convertir una taza de té en arma homicida. Su obsesión por el orden narrativo dio vida a Poirot y Miss Marple, detectives que resolvían casos con más paciencia que Scotland Yard. Publicó más de 60 novelas, fue la autora más vendida de la historia y aún así desapareció once días, como si la vida misma le pidiera una trama. “Escribo asesinatos porque lavar platos me resulta más monótono”, podría haber dicho (y probablemente lo pensó).',
    efemerides: [
      {
        date: '26 de agosto de 1914',
        title: 'Nace Julio Cortázar.',
        description: 'Rayuela, cronopios y un París que nunca existió del todo.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '29 de agosto de 1952',
        title: 'Muere Margaret Wise Brown.',
        description: 'Inventó conejitos que se duermen más fácil que algunos lectores.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '4 de septiembre de 1984',
        title: 'Muere Truman Capote.',
        description: 'La alta sociedad aún cree que va a volver a la fiesta.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        date: '9 de septiembre de 1828',
        title: 'Nace León Tolstói.',
        description: 'Demostró que incluso la guerra necesita notas al pie.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        date: '14 de septiembre de 1769',
        title: 'Nace Alexander von Humboldt.',
        description: 'Escribió de ciencia como si fueran novelas de aventuras.',
        color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
        borderColor: 'border-teal-100 dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-teal-400',
      },
      {
        date: '21 de septiembre de 1866',
        title: 'Nace H.G. Wells.',
        description: 'El hombre que puso a la ciencia a viajar en tranvía temporal.',
        color: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
        borderColor: 'border-indigo-100 dark:border-indigo-800/30',
        textColor: 'text-indigo-600 dark:text-indigo-400',
      },
      {
        date: '21 de septiembre de 1947',
        title: 'Nace Stephen King.',
        description: 'La pesadilla más prolífica de Maine.',
        color: 'from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20',
        borderColor: 'border-rose-100 dark:border-rose-800/30',
        textColor: 'text-rose-600 dark:text-rose-400',
      },
    ],
    tarot: {
      image: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1755780988/tarot_virgo_jjmode.png',
      author: 'Mary Shelley',
      subtitle: 'La pluma como linterna',
      card: 'El Ermitaño',
      phrase: 'La luz nace del examen interior',
      description:
        'Virgo, signo mutable de tierra, perfeccionista, lógico y metódico, con espíritu crítico, precisión y paciencia. Odia la improvisación y necesita seguridad. Su carta es El Ermitaño: introspección, sabiduría por reflexión y búsqueda de la verdad interior. En nuestro Tarot literario, Mary Shelley es la ermitaña: no alza una linterna, sino una pluma que ilumina páginas abiertas, símbolo de la creación intelectual y del poder transformador de la imaginación. A lo lejos, Frankenstein aparece en penumbra: eco de la otra cara del conocimiento, la soledad del buscador y el peso de la responsabilidad por lo creado.',
      meaningTitle: 'Interpretación',
      meaningDescription:
        'El Ermitaño no es aislamiento vacío, sino introspección fértil. Representa la figura que se retira para explorar los abismos del alma y la mente humana, y que vuelve con un descubrimiento luminoso, aunque inquietante: el poder y el peligro de la creación. Invita a encontrar respuestas dentro de uno mismo, evitando, sin embargo, sobre pensar las cosas. Enfocar tus pensamientos y forma de actuar, evitar los impulsos. Para esto será necesario, más que nunca, el saber encontrar equilibrio entre descanso y actividad. Familia y trabajo. Placer y sacrificio.',
      illustrator: undefined,
    },
    writers: [
      'Jorge Luis Borges',
      'Álvaro Mutis',
      'Johann Wolfgang von Goethe',
      'Nicanor Parra',
      'Cesare Pavese',
      'Francisco de Quevedo',
      'Adolfo Bioy Casares',
      'Javier Marías',
      'Stephen King',
      'Mary Shelley',
    ],
  },
  libra: {
    author: 'Oscar Wilde',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1758729122/Oscar_Wilde_Libra_s9czcr.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'agarcia',
    description:
      'El dandy irlandés que convertía cada paradoja en epigrama y cada tragedia en arte. Libra puro: obsesionado con la belleza, adicto a la controversia elegante y capaz de encontrar simetría hasta en la cárcel. "Puedo resistir todo, excepto la tentación", dijo, y fue su guía de vida. Escribió sobre el amor como quien diseña jardines: con artificio perfecto y pasión genuina. Su genio radicaba en hacer que lo frívolo pareciera profundo y lo profundo, frívolo.',
    efemerides: [
      {
        date: '16 de octubre de 1854',
        title: 'Nace Oscar Wilde',
        description: 'Dublin prepara su primer escándalo literario.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '4 de octubre de 1535',
        title: 'Se publica la primera Biblia completa en inglés',
        description: 'El equilibrio entre fe y literatura encuentra su traducción.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '7 de octubre de 1849',
        title: 'Muere Edgar Allan Poe',
        description: 'El misterio de su muerte aún alimenta teorías como cuentos.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        date: '14 de octubre de 1644',
        title: 'Nace William Penn',
        description: 'Fundador de Pensilvania, donde la utopía tuvo código postal.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        date: '21 de octubre de 1772',
        title: 'Nace Samuel Taylor Coleridge',
        description: 'Sus sueños con opio crearon los mejores versos de la historia.',
        color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
        borderColor: 'border-teal-100 dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-teal-400',
      },
    ],
    tarot: {
      image: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1758729122/tarot_libra_pc62ow.png',
      author: 'Miguel de Cervantes • Italo Calvino • William Faulkner',
      subtitle: 'VIII – Arcano Mayor Original',
      card: 'El Árbitro del Otoño',
      phrase: 'La balanza escucha antes de dictar sentencia',
      description:
        'Libra se reconoce en La Justicia y en la Reina de Espadas: equilibrio, armonía y decisiones conscientes. El Árbitro del Otoño viste hojas secas y sostiene una balanza de frutos, recordando que cada elección deja huella y que la belleza nace del contraste que no niega la verdad.',
      meaningTitle: 'Lectura general',
      meaningDescription: `El Árbitro del Otoño enseña que la justicia no siempre dicta, a veces escucha. Representa el equilibrio entre razón y emoción, entre lo vivido y lo soñado. Su justicia no impone, sino que busca sentido en la maraña de lo humano. Nos recuerda que la belleza surge de lo gastado, lo imperfecto y lo temporal.

Consejo:
• Escucha antes de decidir.
• No confundas armonía con perfección.
• Reconoce la sabiduría de lo vivido y el valor de lo efímero.

Atención / Sombras:
• Riesgo de superficialidad estética sin ética.
• Juicios apresurados que no dejan espacio a los matices.
• Dureza sin compasión.
• Desconexión con la raíz interior y con el tiempo profundo.

Palabras clave: Justicia poética, equilibrio estacional, sabiduría narrativa, belleza melancólica, memoria profunda, legado cultural, escucha atenta, realismo mágico, claridad sin rigidez.`,
      illustrator: undefined,
    },
    writers: [
      'Oscar Wilde',
      'Miguel de Cervantes',
      'Italo Calvino',
      'William Faulkner',
      'F. Scott Fitzgerald',
      'Truman Capote',
      'Graham Greene',
      'Gore Vidal',
      'Donna Leon',
      'Doris Lessing (Premio Nobel 2007)',
      'Mario Puzo',
      'Arthur Miller',
      'John le Carré',
      'Harold Pinter (Premio Nobel 2005)',
      'Ursula K. Le Guin',
      'Anne Rice',
      'Elfriede Jelinek (Premio Nobel 2004)',
    ],
  },
}

interface HoroscopoClientProps {
  signo?: 'cancer' | 'leo' | 'virgo' | 'libra'
}

export default function HoroscopoClient({ signo = 'libra' }: HoroscopoClientProps) {
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
  const currentSign = signo

  // Obtener información del signo actual
  const currentSignInfo = zodiacSigns.find((sign) => sign.slug === currentSign)
  const displaySignName =
    signo === 'cancer' ? 'Cáncer' : signo === 'leo' ? 'Leo' : signo === 'virgo' ? 'Virgo' : 'Libra'

  // Seleccionar el objeto de textos correcto según el signo
  const literaryTexts =
    signo === 'cancer'
      ? literaryHoroscopesCancer
      : signo === 'leo'
        ? literaryHoroscopesLeo
        : signo === 'virgo'
          ? literaryHoroscopesVirgo
          : literaryHoroscopesLibra
  const currentSignText = literaryTexts[currentSign]?.text || ''

  // Obtener datos del horóscopo según el signo
  const data = horoscopoData[signo]

  // Función para obtener el link del signo
  const getSignLink = (signSlug: string) => {
    if (signSlug === 'libra') return '/horoscopo' // Signo actual
    if (signSlug === 'virgo') return '/horoscopo/virgo' // Archivo disponible
    if (signSlug === 'leo') return '/horoscopo/leo' // Archivo disponible
    if (signSlug === 'cancer') return '/horoscopo/cancer' // Archivo disponible
    return '#' // Signos futuros (sin link)
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Fondo geométrico idéntico al bloque de Tarot */}
        <div className="pointer-events-none absolute inset-0">
          {/* Textura de papel/brush sutil */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 40% 70%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 10% 90%, rgba(0, 0, 0, 0.02) 0%, transparent 40%)
            `,
            }}
          ></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
              linear-gradient(45deg, rgba(0, 0, 0, 0.01) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(0, 0, 0, 0.01) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.01) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.01) 75%)
            `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
            }}
          ></div>
          {/* Formas geométricas sutiles */}
          <div className="absolute top-20 left-[10%] h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 opacity-30 dark:from-cyan-700 dark:to-cyan-800"></div>
          <div className="absolute top-40 right-[15%] h-24 w-24 rotate-45 transform bg-gradient-to-br from-blue-200 to-blue-300 opacity-25 dark:from-blue-600 dark:to-blue-700"></div>
          <div className="absolute top-60 left-[20%] h-20 w-20 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-20 dark:from-purple-700 dark:to-purple-800"></div>
          <div className="absolute top-10 right-[30%] h-16 w-16 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-15 dark:from-pink-700 dark:to-pink-800"></div>
          <div className="absolute top-80 right-[8%] h-28 w-28 rotate-12 transform bg-gradient-to-br from-green-200 to-green-300 opacity-20 dark:from-green-700 dark:to-green-800"></div>

          {/* Partículas pequeñas flotantes */}
          <div className="absolute top-16 left-[65%] h-2 w-2 animate-pulse rounded-full bg-gray-400 opacity-30 dark:bg-gray-500"></div>
          <div
            className="absolute top-52 right-[25%] h-2 w-2 animate-pulse rounded-full bg-gray-400 opacity-35 dark:bg-gray-500"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-72 left-[15%] h-2 w-2 animate-pulse rounded-full bg-gray-400 opacity-25 dark:bg-gray-500"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute top-28 right-[40%] h-2 w-2 animate-pulse rounded-full bg-gray-400 opacity-20 dark:bg-gray-500"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>
        <SectionContainer>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Texto literario de Cáncer */}
            <div className="relative order-2 flex flex-col justify-center lg:order-1">
              <div className="mb-4 text-sm font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Signo: {displaySignName}
              </div>
              <h1 className="font-titles mb-4 text-4xl font-bold text-gray-900 lg:text-6xl dark:text-gray-100">
                {data.author}
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {data.description}
              </p>
              {/* Autoría de Adriana */}
              <div className="mt-6 mb-2 flex items-center gap-4">
                <img
                  src="https://res.cloudinary.com/dx98vnos1/image/upload/v1749824794/Adriana_Garcia_Sojo_dgbs6y.png"
                  alt="Adriana García S."
                  className="h-14 w-14 rounded-full border-2 border-gray-200 object-cover shadow-sm dark:border-gray-700"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Por:</span>
                  <a
                    href={`/autor/${data.authorSlug}`}
                    className="text-base font-semibold text-gray-900 hover:underline dark:text-gray-100"
                  >
                    {data.authorCredit}
                  </a>
                </div>
              </div>
            </div>
            {/* Right Column - Imagen de Kafka sobre las formas geométricas */}
            <div className="relative order-1 flex items-center justify-center lg:order-2">
              <img
                src={data.authorImage}
                alt={data.author}
                className="z-10 h-auto max-h-72 w-64 object-contain"
                style={{ background: 'none', boxShadow: 'none', border: 'none' }}
                loading="lazy"
              />
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Compartir (sin reacciones) después del hero */}
      <div className="mx-auto mb-8 max-w-md">
        {/* No incluimos reacciones para tipos no 'relato' */}
      </div>

      {/* Main Content sobre fondo blanco normal */}
      <SectionContainer>
        <div className="py-2">
          {/* Efemérides Literarias Section */}
          <div className="mb-6">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Efemérides
              </h3>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </div>

            {/* Scroll horizontal para todas las pantallas */}
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex gap-4 overflow-x-auto pb-4">
              {data.efemerides.map((efemeride, index) => (
                <div key={index} className="w-80 flex-shrink-0">
                  <div
                    className={`bg-gradient-to-br ${efemeride.color} rounded-xl border p-6 ${efemeride.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div className={`text-sm font-semibold ${efemeride.textColor} mb-2`}>
                      {efemeride.date}
                    </div>
                    <div className="mb-2 font-bold text-gray-900 dark:text-gray-100">
                      {efemeride.title}
                    </div>
                    <p className="text-sm text-gray-600 italic dark:text-gray-400">
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
              const currentSignData = zodiacSigns.find((sign) => sign.slug === currentSign)
              const currentSignText = literaryTexts[currentSign]?.text || ''
              return (
                <div className="w-full rounded-xl border-2 border-orange-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-8 shadow-lg dark:border-orange-800 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <div className="flex flex-col items-center gap-6 md:flex-row">
                    <div className="flex-shrink-0">
                      {currentSignData?.image ? (
                        <div
                          className="flex h-24 w-24 items-center justify-center rounded-full"
                          style={{ backgroundColor: '#e7e2d6' }}
                        >
                          <img
                            src={currentSignData.image}
                            alt={`Símbolo de ${currentSignData.name}`}
                            className="h-20 w-20 object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="text-6xl">{currentSignData?.symbol}</div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {currentSignData?.name}
                      </div>
                      <div className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                        {currentSignData?.date}
                      </div>
                      <div className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                        {currentSignText}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Grid de los demás signos */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {zodiacSigns
                .filter((sign) => sign.slug !== currentSign)
                .map((sign) => {
                  const literaryText = literaryTexts[sign.slug]?.text || ''
                  const signLink = getSignLink(sign.slug)
                  const isClickable = signLink !== '#'

                  const cardClasses = `relative bg-white/80 dark:bg-gray-900/70 rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 transition-all duration-200 ${
                    isClickable
                      ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-purple-200 dark:hover:border-purple-800'
                      : ''
                  }`

                  const cardContent = (
                    <div className={cardClasses}>
                      <div className="mb-2">
                        {sign.image ? (
                          <div
                            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                            style={{ backgroundColor: '#e7e2d6' }}
                          >
                            <img
                              src={sign.image}
                              alt={`Símbolo de ${sign.name}`}
                              className="h-12 w-12 object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="text-5xl">{sign.symbol}</div>
                        )}
                      </div>
                      <div className="mb-1 text-lg font-bold">{sign.name}</div>
                      <div className="mb-3 text-sm text-gray-500">{sign.date}</div>
                      <div className="mb-2 text-base text-gray-700 dark:text-gray-300">
                        {literaryText}
                      </div>
                      {isClickable && (
                        <div className="mt-auto pt-2">
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                            {['cancer', 'leo', 'virgo'].includes(sign.slug)
                              ? 'Ver archivo'
                              : 'Ver horóscopo'}{' '}
                            →
                          </span>
                        </div>
                      )}
                    </div>
                  )

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
                  )
                })}
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Bloque de la carta del tarot con fondo geométrico al final */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Fondo geométrico idéntico al hero */}
        <div className="pointer-events-none absolute inset-0">
          {/* Textura de papel/brush sutil */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 40% 70%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 40%),
              radial-gradient(circle at 10% 90%, rgba(0, 0, 0, 0.02) 0%, transparent 40%)
            `,
            }}
          ></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
              linear-gradient(45deg, rgba(0, 0, 0, 0.01) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(0, 0, 0, 0.01) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.01) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.01) 75%)
            `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
            }}
          ></div>
          {/* Formas geométricas sutiles */}
          <div className="absolute top-20 left-[10%] h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 opacity-30 dark:from-cyan-700 dark:to-cyan-800"></div>
          <div className="absolute top-40 right-[15%] h-24 w-24 rotate-45 transform bg-gradient-to-br from-blue-200 to-blue-300 opacity-25 dark:from-blue-600 dark:to-blue-700"></div>
          <div className="absolute top-60 left-[20%] h-20 w-20 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-20 dark:from-purple-700 dark:to-purple-800"></div>
          <div className="absolute top-10 right-[30%] h-16 w-16 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-15 dark:from-pink-700 dark:to-pink-800"></div>
          <div className="absolute top-80 right-[8%] h-28 w-28 rotate-12 transform bg-gradient-to-br from-green-200 to-green-300 opacity-20 dark:from-green-700 dark:to-green-800"></div>

          {/* Partículas pequeñas flotantes */}
          <div className="absolute top-16 left-[65%] h-2 w-2 animate-pulse rounded-full bg-gray-400 opacity-30 dark:bg-gray-500"></div>
          <div
            className="absolute top-52 right-[25%] h-2 w-2 animate-pulse rounded-full bg-gray-400 opacity-35 dark:bg-gray-500"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-72 left-[15%] h-2 w-2 animate-pulse rounded-full bg-gray-400 opacity-25 dark:bg-gray-500"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute top-28 right-[40%] h-2 w-2 animate-pulse rounded-full bg-gray-400 opacity-20 dark:bg-gray-500"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>
        <SectionContainer>
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-center text-2xl font-bold tracking-wide text-gray-900 dark:text-gray-100">
              Lectura del Tarot
            </h2>
            <div className="flex flex-col items-center gap-8 rounded-xl p-8 md:flex-row">
              {/* Imagen de la carta */}
              <div className="mb-6 flex-shrink-0 md:mb-0">
                <img
                  src={data.tarot.image}
                  alt={`Carta del tarot: ${data.tarot.subtitle}`}
                  className="mb-2 h-auto w-40 rounded-lg"
                  loading="lazy"
                />
                {/* Crédito del ilustrador si existe */}
                {data.tarot.illustrator && (
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Carta ilustrada por:{' '}
                    <a
                      href={data.tarot.illustrator.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline dark:text-purple-400"
                    >
                      {data.tarot.illustrator.name}
                    </a>
                  </p>
                )}
              </div>
              {/* Texto de la carta */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                  {data.tarot.author}
                </div>
                <div className="mb-3 text-base text-gray-500 italic dark:text-gray-400">
                  {data.tarot.subtitle}
                </div>
                <div className="mb-1 text-lg font-semibold text-purple-700 dark:text-purple-300">
                  {data.tarot.card}
                </div>
                <div className="mb-4 text-gray-700 italic dark:text-gray-300">
                  {data.tarot.phrase}
                </div>
                <div className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {data.tarot.description}
                </div>

                {/* Significado de la tirada para Leo */}
                {data.tarot.meaningTitle && data.tarot.meaningDescription && (
                  <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                    <h4 className="mb-3 text-lg font-semibold text-purple-700 dark:text-purple-300">
                      {data.tarot.meaningTitle}
                    </h4>
                    <div className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {data.tarot.meaningDescription}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Sin barra de reacciones/compartir dentro del horóscopo en este release */}

            {/* Lista de escritores del signo */}
            {data.writers && (
              <div className="mt-16">
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Escritores {displaySignName}
                  </h3>
                  <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"></div>
                </div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.writers.map((writer, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-amber-800/30 dark:from-amber-900/20 dark:to-orange-900/20"
                    >
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
