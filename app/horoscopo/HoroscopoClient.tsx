'use client'

import SectionContainer from '@/components/layout/SectionContainer'

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
    text: 'Moderarás un salón donde Jane Austen compara notas con Molière y todos esperan tu veredicto. Dicta sentencia: que la ironía lleve guantes blancos, pero que se escuche la carcajada.',
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

// Textos literarios para Escorpio (nuevos)
const literaryHoroscopesEscorpio = {
  aries: {
    text: 'Tu ímpetu de Hemingway choca con el noir de Highsmith. Quieres la acción pura; Escorpio prefiere el crimen perfecto sin testigos. Esta semana, antes de lanzarte al precipicio, lee una página de "El talento de Mr. Ripley". Aprenderás que hay formas más oscuras de ganar.',
  },
  tauro: {
    text: 'Buscas raíces eternas como en García Márquez; Escorpio te murmura: "Las raíces más profundas se pudren en la oscuridad". Tu solidez encuentra grietas. Esta semana, acepta que algunos cimientos están diseñados para colapsar. A veces lo podrido es lo más honesto.',
  },
  geminis: {
    text: 'Eres Italo Calvino multiplicado en capítulos. Hablas en juicios paralelos, en historias que se ramifican. Escorpio, como Dostoievski, toma cada palabra tuya y la convierte en confesión. Cuidado: alguien está escribiendo tu monólogo interior en sangre.',
  },
  cancer: {
    text: 'Tu nostalgia tipo Kawabata encuentra a Escorpio buceando en los abismos de Clarice Lispector. Ambos son agua, pero tú miras hacia el pasado y Escorpio hacia las capas donde nada respira. Esta semana, sumérgete sin mapa. Lo profundo necesita dos pares de ojos.',
  },
  leo: {
    text: 'Tu brillo épico estilo Byron asusta a Escorpio. No es envidia; es que ves demasiado como quien lee bajo un foco en una novela negra. Leo quiere ser la estrella del drama; Escorpio quiere saber qué secreto acecha tras tu corona. Déjate editar por la sombra.',
  },
  virgo: {
    text: 'Ambos son obsesivos, pero tú como Borges en su biblioteca infinita, y Escorpio como Patricia Highsmith corrigiendo crímenes. Tú buscas el detalle perfecto; Escorpio, la mentira perfecta. Esta semana, descubre que la corrección verdadera vive en lo que duele.',
  },
  libra: {
    text: 'Tu balance wildeano choca con la amargura de Escorpio. Tú dices: "La belleza es lo único que vale". Escorpio responde: "La belleza es la mejor mentira". Uno quiere un epigrama; el otro, una confesión. Elige: la gracia o la verdad. No puedes tener ambas.',
  },
  escorpio: {
    text: 'Esta semana serás el personaje de Highsmith observando tu propio crimen. Lo incómodo es que ya lo escribiste todo en un diario que nadie encontrará. El revelador es que ese diario eres tú. Cada secreto que guardas es la página que no te atreves a releer.',
  },
  sagitario: {
    text: 'Quieres escribir La Odisea de Julio Verne; Escorpio sugiere quedarse en la oscuridad sin mapa. Viajar lejos es cobardia; viajar profundo es suicidio intelectual. Esta semana, descubre que el mejor laberinto no es geográfico: está escrito en Camus y Sartre.',
  },
  capricornio: {
    text: 'Eres el arquitecto de George Eliot construyendo imperios victorianos. Escorpio es el arqueólogo que sabe que los mejores palacios están enterrados. Tu disciplina es admirable; esta semana, planta una novela negra en el sótano. Florecerá en tinta invisible.',
  },
  acuario: {
    text: 'Tu utopía de Le Guin choca con el cinismo de Bukowski. Tú crees en reformas; Escorpio en la corrupción como verdad universal. El futuro que imaginas ya está podrido en la ficción. Esta semana, lee un cuento de Poe. Es más honesto que tu revolución.',
  },
  piscis: {
    text: 'Sueñas con Murakami en espacios paralelos; Escorpio habita en los de Maupassant donde los espectros no responden. Ambos saben leer lo invisible, pero tú lo poetizas y Escorpio lo disecciona. Esta semana, comparte tu pesadilla más visceral. Escorpio comprenderá porque ya la escribió.',
  },
}

// Textos literarios para Sagitario (nuevos)
const literaryHoroscopesSagitario = {
  aries: {
    text: 'Tu ímpetu se cruza con la flecha de Sagitario. Ambos quieren la verdad ahora, sin rodeos ni protocolo. Pero cuidado: tú golpeas puertas; Sagitario las salta. Esta semana, aprende que hay batallas que se ganan a caballo, no a pie.',
  },
  tauro: {
    text: 'Sagitario te invita a un viaje filosófico. Tú llevas maleta de ocho ruedas; Sagitario solo un cuaderno y una pregunta sin respuesta. Verás que la aventura verdadera no es cambiar de lugar, sino cambiar de idea.',
  },
  geminis: {
    text: 'Hablan el mismo idioma: curiosidad sin tregua, conversaciones que derivan en otros temas. Pero Sagitario busca síntesis donde tú amas el detalle. Esta semana, alguien te pedirá que elijas un solo final. Respira hondo y elige.',
  },
  cancer: {
    text: 'Sagitario te saca de la cueva emocional con una antorcha y una carcajada. Te dice: "El mundo está afuera". Tú respondes: "Y adentro también". Ambos tienen razón, pero esta semana, atrévete a salir sin mapa de regreso.',
  },
  leo: {
    text: 'Tu drama encuentra en Sagitario un coro que aplaude... pero luego cambia de tema. No es desprecio: es que Sagitario no cree en escenas largas. Esta semana, serás protagonista y filósofo. Elige cuándo rugir y cuándo reír.',
  },
  virgo: {
    text: 'Sagitario desordena tu lista de pendientes con una pregunta: "¿Y si nada de eso importa?". Te ofende y te libera al mismo tiempo. Esta semana, permítete un error hermoso. Los mejores libros tienen erratas sublimes.',
  },
  libra: {
    text: 'Buscas el equilibrio; Sagitario lo rompe con una risa y una teoría nueva. Te dice: "La verdad pesa más que la armonía". Tú respondes: "¿Y si la armonía es la verdad?". Esta semana, debatan hasta el amanecer. Nadie ganará, pero ambos crecerán.',
  },
  escorpio: {
    text: 'Sagitario es luz donde tú eres profundidad. Te molesta su optimismo; le inquieta tu intensidad. Pero ambos buscan la verdad. Tú excavas; Sagitario dispara al cielo. Esta semana, reconoce que hay más de un camino hacia lo real.',
  },
  sagitario: {
    text: 'Esta semana serás Jane Austen observando una velada social: irónico, filósofo, divertido, pero con la flecha ya lista. Sabes exactamente qué decir y cuándo callarte. El problema es que también sabes que nadie más lo sabe. Disfruta tu lucidez con humor.',
  },
  capricornio: {
    text: 'Eres el arquitecto; Sagitario el nómade. Tú construyes para quedarte; Sagitario construye para irse. Esta semana, descubre que las mejores estructuras son las que pueden desmontarse y armarse en otro lugar. La sabiduría también viaja.',
  },
  acuario: {
    text: 'Ustedes comparten visión de futuro, pero tú reformas sistemas y Sagitario cuestiona sus bases. Ambos son rebeldes con biblioteca. Esta semana, un libro prestado entre ustedes cambiará una conversación. Léanlo juntos. Discutan sin tregua.',
  },
  piscis: {
    text: 'Sagitario te dice: "Deja de soñar y camina". Tú respondes: "Camino mientras sueño". Ambos tienen razón. Esta semana, el viaje será tan real como imaginario. Lleva un cuaderno. Anota lo que ves y lo que inventas. No marques la diferencia.',
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
  escorpio: {
    author: 'Patricia Highsmith',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1761664881/Patricia_Highsmith_c0spde.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'phighsmith',
    description:
      'Escorpio encarnado: oscuro, moralmente ambiguo, obsesionado con los abismos de la naturaleza humana. Patricia Highsmith escribía crimen como quien respira. Su Tom Ripley no es un villano; es la verdad incómoda de lo que somos cuando nadie nos mira. Creó historias donde el culpable y la víctima intercambian máscaras. Vivió en retiro, desconfiando del mundo, escribiendo las verdades más oscuras con la precisión de un cirujano. "He trabajado duro durante años para ser excepcional. Ahora que lo soy, no me sorprende", dijo sin arrogancia: era observación.',
    efemerides: [
      {
        date: '8 de noviembre de 1949',
        title: 'Publica "El talento de Mr. Ripley"',
        description: 'Nace el socio perfecto: amable, culto, asesino.',
        color: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
        borderColor: 'border-red-100 dark:border-red-800/30',
        textColor: 'text-red-600 dark:text-red-400',
      },
      {
        date: '10 de noviembre de 1883',
        title: 'Nace Djuna Barnes',
        description: 'Escritora de la noche: París en tinta negra y verdades prohibidas.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '13 de noviembre de 1850',
        title: 'Nace Robert Louis Stevenson',
        description: 'El Jekyll y Hyde fue primero biografía personal, luego ficción.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '19 de noviembre de 1918',
        title: 'Nace Ivo Andrić',
        description: 'El puente de Visegrad: historias donde el pasado es maldición y luz.',
        color: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        borderColor: 'border-amber-100 dark:border-amber-800/30',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
    ],
    writers: [
      'Patricia Highsmith',
      'Diane Arbus',
      'Bette Davis',
      'Pablo Neruda',
      'James Baldwin',
      'Sylvia Plath',
      'Charles Bukowski',
      'Truman Capote',
      'Tennessee Williams',
      'David Lynch',
      'Isabel Allende',
      'Clarice Lispector',
    ],
  },
  sagitario: {
    author: 'Jane Austen',
    authorImage:
      'https://res.cloudinary.com/dx98vnos1/image/upload/v1764592800/jane_austen_sagitario_q5ssic.png',
    authorCredit: 'Adriana García S.',
    authorSlug: 'jausten',
    description:
      'Sagitario en estado puro: aventurera intelectual disfrazada de señorita inglesa. Jane Austen disparaba verdades filosóficas con ironía quirúrgica desde la sala de té. Observaba el mundo como antropóloga y lo narraba como comediante. Sus novelas son flechas certeras hacia la hipocresía social, envueltas en bailes de salón. "Declaro, después de todo, que no hay placer como la lectura", escribió, y lo decía en serio aunque sus personajes no siempre. Murió joven pero dejó un legado que sigue provocando conversaciones, risas y tesis doctorales. Sagitario no conquista territorios: conquista mentes.',
    efemerides: [
      {
        date: '1 de diciembre de 1948',
        title: 'Muere Alejandra Kollontai',
        description: 'Revolucionaria, diplomática, novelista. La libertad también se escribe.',
        color: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
        borderColor: 'border-red-100 dark:border-red-800/30',
        textColor: 'text-red-600 dark:text-red-400',
      },
      {
        date: '3 de diciembre de 1857',
        title: 'Nace Joseph Conrad',
        description: 'Del mar a la selva: el viaje como metáfora del alma.',
        color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'border-blue-100 dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        date: '16 de diciembre de 1775',
        title: 'Nace Jane Austen',
        description: 'La ironía británica encuentra su templo portátil.',
        color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'border-purple-100 dark:border-purple-800/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        date: '16 de diciembre de 1917',
        title: 'Nace Arthur C. Clarke',
        description: 'Filósofo del espacio: la ciencia ficción como profecía.',
        color: 'from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20',
        borderColor: 'border-cyan-100 dark:border-cyan-800/30',
        textColor: 'text-cyan-600 dark:text-cyan-400',
      },
      {
        date: '18 de diciembre de 1856',
        title: 'Nace J.J. Thomson',
        description: 'Descubre el electrón y lo escribe como quien narra una aventura.',
        color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-100 dark:border-green-800/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
    ],
    writers: [
      'Jane Austen',
      'Gustave Flaubert',
      'Joseph Conrad',
      'Willa Cather',
      'Noel Coward',
      'Arthur C. Clarke',
      'Philip K. Dick',
      'William Blake',
      'Emily Dickinson',
      'Louisa May Alcott',
      'C.S. Lewis',
      'Noam Chomsky',
      'Jorge Semprún',
      'José Ortega y Gasset',
      'Edmond Rostand',
    ],
  },
}

interface HoroscopoClientProps {
  signo?: 'cancer' | 'leo' | 'virgo' | 'libra' | 'escorpio' | 'sagitario'
}

export default function HoroscopoClient({ signo = 'sagitario' }: HoroscopoClientProps) {
  // Detectar el signo actual o usar el especificado
  const currentSign = signo

  // Obtener información del signo actual
  const currentSignInfo = zodiacSigns.find((sign) => sign.slug === currentSign)
  const displaySignName =
    signo === 'cancer' ? 'Cáncer' : signo === 'leo' ? 'Leo' : signo === 'virgo' ? 'Virgo' : signo === 'libra' ? 'Libra' : signo === 'escorpio' ? 'Escorpio' : 'Sagitario'

  // Seleccionar el objeto de textos correcto según el signo
  const literaryTexts =
    signo === 'cancer'
      ? literaryHoroscopesCancer
      : signo === 'leo'
        ? literaryHoroscopesLeo
        : signo === 'virgo'
          ? literaryHoroscopesVirgo
          : signo === 'libra'
            ? literaryHoroscopesLibra
            : signo === 'escorpio'
              ? literaryHoroscopesEscorpio
              : literaryHoroscopesSagitario
  const currentSignText = literaryTexts[currentSign]?.text || ''

  // Obtener datos del horóscopo según el signo
  const data = horoscopoData[signo]

  // Función para obtener el link del signo
  const getSignLink = (signSlug: string) => {
    if (signSlug === 'sagitario') return '/horoscopo' // Signo actual (Diciembre 2025)
    if (signSlug === 'escorpio') return '/horoscopo/escorpio' // Archivo disponible (Noviembre 2025)
    if (signSlug === 'libra') return '/horoscopo/libra' // Archivo disponible (Octubre 2025)
    if (signSlug === 'virgo') return '/horoscopo/virgo' // Archivo disponible (Septiembre 2025)
    if (signSlug === 'leo') return '/horoscopo/leo' // Archivo disponible (Agosto 2025)
    if (signSlug === 'cancer') return '/horoscopo/cancer' // Archivo disponible (Julio 2025)
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
                <div className="w-full rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-8 shadow-lg dark:border-red-800 dark:from-red-900/20 dark:to-rose-900/20">
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
                      <div
                        className="text-xl leading-relaxed text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: currentSignText }}
                      />
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
                      <div
                        className="mb-2 text-base text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: literaryText }}
                      />
                      {isClickable && (
                        <div className="mt-auto pt-2">
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                            {['cancer', 'leo', 'virgo', 'libra', 'escorpio'].includes(sign.slug)
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

      {/* Lista de escritores del signo */}
      {data.writers && (
        <SectionContainer>
          <div className="py-16">
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
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{writer}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      )}
    </div>
  )
}
