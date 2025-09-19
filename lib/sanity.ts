import { createClient } from 'next-sanity'
import { cleanEmoji } from './cleanEmoji'
import { toVersal } from './utils'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

// Definición de tipos
interface Autor {
  name: string
  avatar: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
  bluesky?: string
  bio?: string
  defaultTab?: string
  instagram?: string
  sitios?: string
  slug: {
    current: string
  }
}

interface Relato {
  title: string
  slug: {
    current: string
  }
  summary?: string
  image?: string
  author: Autor
  date: string
  category?: any
  tags?: any[]
  body?: any
  status?: string
  readingTime?: {
    text: string
    minutes: number
    time: number
    words: number
  }
  bgColor?: string
  publishedAt?: string
  site?: {
    title: string
    slug: {
      current: string
    }
    description: string
  }
  showDropCap?: boolean
}

interface Portada {
  pageTitle: string
  relatos: Relato[]
}

interface ProyectoFormateado {
  title: string
  description: string
  imgSrc: string
  href: string
  authorImgSrc: string
  authorName: string
  authorHref: string
  bgColor: string
  tags: string[]
  publishedAt: string
}

// Interfaz para Artículo
interface Articulo {
  title: string
  slug: {
    current: string
  }
  summary?: string
  image?: string
  author: Autor
  date: string
  body?: any
  status?: string
  isExternal?: boolean
  externalUrl?: string
  source?: string
  readingTime?: {
    text: string
    minutes: number
    time: number
    words: number
  }
}

// Interfaz para Microcuento
interface Microcuento {
  title: string
  slug: {
    current: string
  }
  author: string
  description: string
  summary: string
  publishedAt: string
  image?: string
  bgColor: string
  body: any
  tags?: any[]
}

interface MicrocuentoFormateado {
  title: string
  author: string
  description: string
  summary: string
  imgSrc: string
  href: string
  bgColor: string
  tags: string[]
  publishedAt: string
}

// Interfaz para el desafío
interface Desafio {
  titulo: string
  descripcion: string
  relatos: {
    relato: Relato
    orden: number
  }[]
  preguntas: {
    relatoId: string
    pregunta: string
    opciones: {
      texto: string
      esCorrecta: boolean
    }[]
  }[]
  activo: boolean
  mensajeExito: string
  mensajeError: string
}

// Interfaz para Site
interface Site {
  title: string
  description: string
  slug: {
    current: string
  }
}

// Función para obtener los relatos de la portada
export async function getPortadaRelatos(): Promise<Portada | null> {
  try {
    const result = await client.fetch(`
      *[_type == "portada" && (!defined(site) || site->slug.current != "transtextos")][0] {
        pageTitle,
        "relatos": relatos[] -> {
          title,
          slug,
          summary,
          image,
          bgColor,
          publishedAt,
          date,
          "tags": tags[]->title,
          "author": author-> {
            name,
            avatar,
            slug
          }
        }
      }
    `)
    return result
  } catch (error) {
    console.error('Error al consultar Sanity:', error)
    return null
  }
}

// Función para obtener el relato destacado y los no destacados
export async function getFeaturedAndNonFeaturedRelatos(): Promise<{
  featured: ProyectoFormateado | null
  nonFeatured: ProyectoFormateado[]
}> {
  const portada = await getPortadaRelatos()

  if (!portada || !portada.relatos || portada.relatos.length === 0) {
    return { featured: null, nonFeatured: [] }
  }

  // El primer relato en el arreglo es el destacado
  const featured = portada.relatos[0]
  const nonFeatured = portada.relatos.slice(1)

  return {
    featured: mapRelatoToProject(featured),
    nonFeatured: nonFeatured.map(mapRelatoToProject),
  }
}

// ---- FUNCIONES PARA AUTORES ----

// Obtener todos los autores (para generación estática)
export async function getAllAutores(): Promise<Autor[]> {
  try {
    const autores = await client.fetch(`
      *[_type == "autor"] {
        name,
        slug,
        bio,
        avatar,
        occupation,
        company,
        email,
        twitter,
        linkedin,
        github,
        website,
        defaultTab,
        instagram,
        "sitios": sitios[]->title
      }
    `)
    return autores.sort((a: any, b: any) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error al obtener autores desde Sanity:', error)
    return []
  }
}

// Obtener un autor específico por slug
export async function getAutorBySlug(slug: string): Promise<Autor | null> {
  try {
    const autor = await client.fetch(
      `
      *[_type == "autor" && slug.current == $slug][0] {
        name,
        slug,
        bio,
        avatar,
        occupation,
        company,
        email,
        twitter,
        linkedin,
        github,
        website,
        defaultTab,
        instagram,
        "sitios": sitios[]->title
      }
    `,
      { slug }
    )

    return autor
  } catch (error) {
    console.error(`Error al obtener autor "${slug}" desde Sanity:`, error)
    return null
  }
}

// Obtener múltiples autores por un conjunto de slugs (optimización para /mi-area)
export async function getAutoresBySlugs(slugs: string[]): Promise<Autor[]> {
  if (!slugs || slugs.length === 0) return []
  try {
    const autores = await client.fetch(
      `
      *[_type == "autor" && slug.current in $slugs] {
        name,
        slug,
        bio,
        avatar,
        occupation,
        company,
        instagram,
        "sitios": sitios[]->title
      }
      `,
      { slugs }
    )
    return (autores || []).sort((a: any, b: any) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error al obtener autores por slugs desde Sanity:', error)
    return []
  }
}

// Obtener los relatos de un autor (solo publicados)
export async function getRelatosByAutor(autorSlug: string): Promise<Relato[]> {
  try {
    const relatos = await client.fetch(
      `
      *[_type == "relato" && author->slug.current == $autorSlug && status == "published"] | order(date desc) {
        title,
        slug,
        date,
        summary,
        image,
        series,
        seriesOrder,
        status,
        "author": author-> {
          name,
          slug,
          avatar
        },
        "category": category->title,
        "tags": tags[]->title
      }
    `,
      { autorSlug }
    )

    // Limpiar títulos de emojis y convertir a versales
    return relatos.map((relato) => ({
      ...relato,
      title: toVersal(cleanEmoji(relato.title)),
    }))
  } catch (error) {
    console.error(`Error al obtener relatos del autor "${autorSlug}" desde Sanity:`, error)
    return []
  }
}

// Obtener las series de un autor
export async function getSeriesByAutor(autorSlug: string): Promise<any[]> {
  try {
    const series = await client.fetch(
      `
      *[_type == "serie" && $autorSlug in authors[]->slug.current] {
        title,
        slug,
        description,
        "authors": authors[]-> {
          name,
          slug,
          avatar
        },
        "relatos": relatos[]-> {
          title,
          slug,
          date,
          summary,
          status
        }
      }
    `,
      { autorSlug }
    )

    return series
  } catch (error) {
    console.error(`Error al obtener series del autor "${autorSlug}" desde Sanity:`, error)
    return []
  }
}

// Función para mapear un relato de Sanity al formato que espera la UI
function mapRelatoToProject(relato: Relato): ProyectoFormateado {
  // Asegurarnos de que la ruta tenga el formato correcto
  const authorSlug = relato.author?.slug?.current || ''

  return {
    title: toVersal(cleanEmoji(relato.title)),
    description: relato.summary || '',
    imgSrc: relato.image || '',
    href: `/relato/${relato.slug?.current}`,
    authorImgSrc: relato.author?.avatar || '',
    authorName: relato.author?.name || '',
    authorHref: authorSlug ? `/autor/${authorSlug}` : '#',
    bgColor: relato.bgColor || '#efa106',
    tags: relato.tags || [],
    publishedAt: relato.publishedAt || relato.date,
  }
}

// Al final del archivo, agregamos una función consolidada
export async function getAutorData(slug: string) {
  try {
    // Obtenemos todos los datos necesarios en una sola función
    const [author, relatos, series] = await Promise.all([
      getAutorBySlug(slug),
      getRelatosByAutor(slug),
      getSeriesByAutor(slug),
    ])

    // Formateamos los relatos para la UI
    const formattedRelatos = relatos.map((relato) => ({
      slug: relato.slug.current,
      title: relato.title,
      summary: relato.summary || '',
      series: undefined,
      status: relato.status,
    }))

    // Asociamos los relatos con sus series
    series.forEach((serie) => {
      serie.relatos.forEach((relato) => {
        const index = formattedRelatos.findIndex((r) => r.slug === relato.slug.current)
        if (index !== -1) {
          formattedRelatos[index].series = serie.title
        }
      })
    })

    return { author, formattedRelatos, series }
  } catch (error) {
    console.error(`Error al obtener datos del autor "${slug}"`, error)
    return { author: null, formattedRelatos: [], series: [] }
  }
}

// Función auxiliar para calcular el tiempo de lectura
function calcularTiempoLectura(contenido: any = '') {
  // Promedio de palabras por minuto para lectura
  const PALABRAS_POR_MINUTO = 200

  // Extrae solo el texto plano del contenido
  let texto = ''
  if (typeof contenido === 'string') {
    texto = contenido
  } else if (Array.isArray(contenido)) {
    // Si es un array de bloques (como en Portable Text)
    texto = contenido
      .filter((bloque: any) => bloque._type === 'block' && bloque.children)
      .map((bloque: any) =>
        bloque.children
          .filter((child: any) => child._type === 'span')
          .map((span: any) => span.text || '')
          .join(' ')
      )
      .join(' ')
  }

  // Cuenta palabras (dividiendo por espacios)
  const palabras = texto.trim().split(/\s+/).length

  // Calcula minutos
  const minutos = Math.max(1, Math.ceil(palabras / PALABRAS_POR_MINUTO))

  return {
    text: `${minutos} min`,
    minutes: minutos,
    time: minutos * 60 * 1000,
    words: palabras,
  }
}

// Función para obtener un relato por su slug
export async function getRelatoBySlug(slug: string): Promise<Relato | null> {
  try {
    const relato = await client.fetch(
      `
      *[_type == "relato" && slug.current == $slug][0] {
        title,
        slug,
        date,
        publishedAt,
        summary,
        image,
        bgColor,
        body,
        "author": author-> {
          name,
          slug,
          avatar,
          occupation,
          company,
          email,
          twitter,
          linkedin,
          github
        },
        "category": category->title,
        "tags": tags[]->title,
        "seriesObj": series->{name, title},
        series,
        seriesOrder,
        showDropCap,
        "site": site-> {
          title,
          slug,
          description
        }
      }
    `,
      { slug }
    )

    if (relato) {
      // Limpiar título de emojis y convertir a versales
      relato.title = toVersal(cleanEmoji(relato.title))
      // Calcular tiempo de lectura basado en el contenido
      relato.readingTime = calcularTiempoLectura(relato.body)
    }

    return relato
  } catch (error) {
    console.error(`Error al obtener relato "${slug}" desde Sanity:`, error)
    return null
  }
}

// Función para obtener todos los relatos
export async function getAllRelatos(): Promise<Relato[]> {
  try {
    const relatos = await client.fetch(`
      *[_type == "relato"] {
        title,
        slug,
        date,
        summary,
        image,
        "author": author-> {
          name,
          slug
        }
      }
    `)
    return relatos
  } catch (error) {
    console.error('Error al obtener relatos desde Sanity:', error)
    return []
  }
}

// Función para obtener relatos relacionados
export async function getRelatedRelatos(slug: string, limit: number = 3): Promise<Relato[]> {
  try {
    const relatos = await client.fetch(
      `
      *[_type == "relato" && slug.current != $slug][0...${limit}] {
        title,
        slug,
        date,
        summary,
        image,
        series,
        seriesOrder,
        "author": author-> {
          name,
          slug,
          avatar
        }
      }
    `,
      { slug }
    )

    return relatos
  } catch (error) {
    console.error(`Error al obtener relatos relacionados para "${slug}":`, error)
    return []
  }
}

// Función para obtener una serie específica por su slug
export async function getSerieBySlug(serieSlug: string): Promise<{
  serie: any
  relatosDeSerie: Relato[]
}> {
  try {
    const serie = await client.fetch(
      `
      *[_type == "serie" && slug.current == $serieSlug][0] {
        title,
        slug,
        description,
        "authors": authors[]-> {
          name,
          slug,
          avatar,
          occupation,
          company,
          twitter,
          linkedin,
          github
        },
        "relatos": relatos[]-> {
          title,
          slug,
          date,
          summary,
          image,
          readingTime,
          status,
          "author": author-> {
            name,
            slug,
            avatar
          }
        } | order(seriesOrder asc)
      }
    `,
      { serieSlug }
    )

    if (!serie) {
      return { serie: null, relatosDeSerie: [] }
    }

    // Filtrar solo relatos publicados
    const relatosPublicados = serie.relatos.filter((r) => r.status === 'published' || !r.status)

    return {
      serie,
      relatosDeSerie: relatosPublicados.map((r) => ({
        ...r,
        title: toVersal(cleanEmoji(r.title)),
        readingTime: r.readingTime || calcularTiempoLectura(),
      })),
    }
  } catch (error) {
    console.error(`Error al obtener serie "${serieSlug}":`, error)
    return { serie: null, relatosDeSerie: [] }
  }
}

// Función para obtener todas las series (para generateStaticParams)
export async function getAllSeries(): Promise<any[]> {
  try {
    const series = await client.fetch(`
      *[_type == "serie"] {
        slug,
        title,
        description,
        "authors": authors[]-> {
          name,
          slug
        },
        "totalRelatos": count(relatos[])
      }
    `)

    return series
  } catch (error) {
    console.error('Error al obtener todas las series:', error)
    return []
  }
}

// Función para obtener la serie de un relato y todos los relatos de esa serie
export async function getSerieDeRelato(slug: string): Promise<{
  serie: any
  relatosDeSerie: Relato[]
}> {
  try {
    // Primero buscamos la serie que contiene este relato
    const series = await client.fetch(
      `
      *[_type == "serie" && $slug in relatos[]->slug.current] {
        title,
        slug,
        description,
        "authors": authors[]-> {
          name,
          slug,
          avatar
        },
        "relatos": relatos[]-> {
          title,
          slug,
          date,
          summary,
          image,
          "author": author-> {
            name,
            slug,
            avatar
          }
        }
      }
    `,
      { slug }
    )

    if (series.length === 0) {
      return { serie: null, relatosDeSerie: [] }
    }

    // Tomamos la primera serie (normalmente solo habrá una)
    const serie = series[0]

    return {
      serie,
      relatosDeSerie: serie.relatos.map((r) => ({ ...r, title: cleanEmoji(r.title) })),
    }
  } catch (error) {
    console.error(`Error al obtener serie para el relato "${slug}":`, error)
    return { serie: null, relatosDeSerie: [] }
  }
}

// Función para obtener un artículo por su slug
export async function getArticuloBySlug(slug: string): Promise<Articulo | null> {
  try {
    const articulo = await client.fetch(
      `
      *[_type == "articulo" && slug.current == $slug][0] {
        title,
        slug,
        date,
        summary,
        image,
        body,
        "author": author-> {
          name,
          slug,
          avatar,
          occupation,
          company,
          email,
          twitter,
          linkedin,
          github
        }
      }
    `,
      { slug }
    )

    if (articulo) {
      // Limpiar título de emojis y convertir a versales
      articulo.title = toVersal(cleanEmoji(articulo.title))
      // Calcular tiempo de lectura basado en el contenido
      articulo.readingTime = calcularTiempoLectura(articulo.body)
    }

    return articulo
  } catch (error) {
    console.error(`Error al obtener artículo "${slug}" desde Sanity:`, error)
    return null
  }
}

// Función para obtener todos los artículos
export async function getAllArticulos(): Promise<Articulo[]> {
  try {
    const articulos = await client.fetch(`
      *[_type == "articulo"] {
        title,
        slug,
        date,
        summary,
        image,
        "author": author-> {
          name,
          slug
        }
      }
    `)
    return articulos
  } catch (error) {
    console.error('Error al obtener artículos desde Sanity:', error)
    return []
  }
}

// Función para obtener los artículos de un autor
export async function getArticulosByAutor(autorSlug: string): Promise<Articulo[]> {
  try {
    const articulos = await client.fetch(
      `
      *[_type == "articulo" && author->slug.current == $autorSlug] | order(date desc) {
        title,
        slug,
        date,
        summary,
        image,
        status,
        isExternal,
        externalUrl,
        source,
        "author": author-> {
          name,
          slug,
          avatar
        }
      }
    `,
      { autorSlug }
    )

    // Limpiar títulos de emojis y convertir a versales
    return articulos.map((articulo) => ({
      ...articulo,
      title: toVersal(cleanEmoji(articulo.title)),
    }))
  } catch (error) {
    console.error(`Error al obtener artículos del autor "${autorSlug}" desde Sanity:`, error)
    return []
  }
}

// Función para obtener artículos relacionados
export async function getRelatedArticulos(slug: string, limit: number = 3): Promise<Articulo[]> {
  try {
    const articulos = await client.fetch(
      `
      *[_type == "articulo" && slug.current != $slug][0...${limit}] {
        title,
        slug,
        date,
        summary,
        image,
        "author": author-> {
          name,
          slug,
          avatar
        }
      }
    `,
      { slug }
    )

    return articulos
  } catch (error) {
    console.error(`Error al obtener artículos relacionados para "${slug}":`, error)
    return []
  }
}

// Función para obtener el desafío activo
export async function getDesafioActivo(): Promise<Desafio | null> {
  try {
    console.log('Iniciando búsqueda de desafío activo')
    console.log(
      `Sanity config - projectId: ${projectId}, dataset: ${dataset}, apiVersion: ${apiVersion}`
    )

    if (!projectId || !dataset || !apiVersion) {
      console.error('Error: Faltan variables de entorno para Sanity', {
        projectId,
        dataset,
        apiVersion,
      })
      throw new Error('Configuración incompleta de Sanity')
    }

    const desafio = await client.fetch(`
      *[_type == "desafio" && activo == true][0] {
        titulo,
        descripcion,
        "relatos": relatos[] {
          "relato": relato->{
            _id,
            title,
            slug,
            summary,
            image,
            body,
            "author": author->{
              name,
              slug,
              avatar
            }
          },
          orden
        },
        preguntas,
        activo,
        mensajeExito,
        mensajeError
      }
    `)

    if (!desafio) {
      console.error('No se encontró ningún desafío activo en Sanity')
      return null
    }

    // Verificar que el desafío tenga relatos
    if (!desafio.relatos || desafio.relatos.length === 0) {
      console.error('El desafío no tiene relatos asociados')
      return null
    }

    // Ordenar los relatos por el campo orden
    desafio.relatos.sort((a, b) => a.orden - b.orden)

    return desafio
  } catch (error) {
    console.error('Error al obtener desafío activo desde Sanity:', error)
    throw error // Re-lanzar para que el componente pueda manejarlo
  }
}

// Función para obtener un desafío específico por ID
export async function getDesafioById(id: string): Promise<Desafio | null> {
  try {
    console.log(`Iniciando búsqueda de desafío con ID: ${id}`)
    console.log(
      `Sanity config - projectId: ${projectId}, dataset: ${dataset}, apiVersion: ${apiVersion}`
    )

    if (!projectId || !dataset || !apiVersion) {
      console.error('Error: Faltan variables de entorno para Sanity', {
        projectId,
        dataset,
        apiVersion,
      })
      throw new Error('Configuración incompleta de Sanity')
    }

    const desafio = await client.fetch(
      `
      *[_type == "desafio" && _id == $id][0] {
        titulo,
        descripcion,
        "relatos": relatos[] {
          "relato": relato->{
            _id,
            title,
            slug,
            summary,
            image,
            body,
            "author": author->{
              name,
              slug,
              avatar
            }
          },
          orden
        },
        preguntas,
        activo,
        mensajeExito,
        mensajeError
      }
    `,
      { id }
    )

    console.log('Respuesta de Sanity para desafío:', desafio ? 'Datos recibidos' : 'NULL')

    // Si no se encuentra el desafío
    if (!desafio) {
      console.error(`No se encontró el desafío con ID ${id} en Sanity`)
      return null
    }

    // Verificar que el desafío tenga relatos
    if (!desafio.relatos || desafio.relatos.length === 0) {
      console.error('El desafío no tiene relatos asociados')
      return null
    }

    // Ordenar los relatos por el campo orden
    desafio.relatos.sort((a, b) => a.orden - b.orden)

    return desafio
  } catch (error) {
    console.error(`Error al obtener desafío "${id}" desde Sanity:`, error)
    throw error // Re-lanzar para que el componente pueda manejarlo
  }
}

// Función para obtener todos los relatos para la vista cronológica
export async function getAllRelatosForChronological(): Promise<ProyectoFormateado[]> {
  try {
    const relatos = await client.fetch(`
      *[_type == "relato" && status == "published"] | order(coalesce(publishedAt, date + "T00:00:00Z") desc) {
        title,
        slug,
        summary,
        image,
        bgColor,
        publishedAt,
        date,
        "tags": tags[]->title,
        "author": author-> {
          name,
          avatar,
          slug
        }
      }
    `)

    return relatos.map(mapRelatoToProject)
  } catch (error) {
    console.error('Error al obtener todos los relatos:', error)
    return []
  }
}

// Obtener relatos por lista de slugs en formato cronológico (para biblioteca personal)
export async function getRelatosForChronologicalBySlugs(
  slugs: string[]
): Promise<ProyectoFormateado[]> {
  if (!slugs || slugs.length === 0) return []
  try {
    const relatos = await client.fetch(
      `
      *[_type == "relato" && status == "published" && slug.current in $slugs] | order(coalesce(publishedAt, date + "T00:00:00Z") desc) {
        title,
        slug,
        summary,
        image,
        bgColor,
        publishedAt,
        date,
        "tags": tags[]->title,
        "author": author-> { name, avatar, slug }
      }
    `,
      { slugs }
    )
    return relatos.map(mapRelatoToProject)
  } catch (error) {
    console.error('Error al obtener relatos por slugs:', error)
    return []
  }
}

// Función para mapear un microcuento de Sanity al formato que espera la UI
function mapMicrocuentoToFormatted(microcuento: Microcuento): MicrocuentoFormateado {
  return {
    title: cleanEmoji(microcuento.title),
    author: microcuento.author,
    description: microcuento.description,
    summary: microcuento.summary,
    imgSrc: microcuento.image || '',
    href: `/microcuento/${microcuento.slug?.current}`,
    bgColor: microcuento.bgColor || '#efa106',
    tags: microcuento.tags || [],
    publishedAt: microcuento.publishedAt,
  }
}

// Función para obtener todos los microcuentos
export async function getAllMicrocuentos(): Promise<MicrocuentoFormateado[]> {
  try {
    const microcuentos = await client.fetch(`
      *[_type == "microcuento"] | order(publishedAt desc) {
        title,
        slug,
        author,
        description,
        summary,
        publishedAt,
        image,
        bgColor,
        "tags": tags[]->title
      }
    `)

    return microcuentos.map(mapMicrocuentoToFormatted)
  } catch (error) {
    console.error('Error al obtener microcuentos:', error)
    return []
  }
}

// Función para obtener un microcuento por su slug
export async function getMicrocuentoBySlug(slug: string): Promise<Microcuento | null> {
  try {
    const microcuento = await client.fetch(
      `
      *[_type == "microcuento" && slug.current == $slug][0] {
        title,
        slug,
        author,
        description,
        summary,
        publishedAt,
        image,
        bgColor,
        body,
        "tags": tags[]->title
      }
    `,
      { slug }
    )

    if (microcuento) {
      // Limpiar título de emojis
      microcuento.title = cleanEmoji(microcuento.title)
    }

    return microcuento
  } catch (error) {
    console.error(`Error al obtener microcuento "${slug}" desde Sanity:`, error)
    return null
  }
}

// Función para obtener todos los slugs de microcuentos
export async function getAllMicrocuentoSlugs(): Promise<string[]> {
  try {
    const slugs = await client.fetch(`
      *[_type == "microcuento"] {
        "slug": slug.current
      }
    `)
    return slugs.map((item: any) => item.slug)
  } catch (error) {
    console.error('Error al obtener slugs de microcuentos:', error)
    return []
  }
}

// Función para obtener microcuentos relacionados (anterior/siguiente)
export async function getRelatedMicrocuentos(slug: string): Promise<{
  prev: Microcuento | null
  next: Microcuento | null
}> {
  try {
    // Primero obtenemos el microcuento actual para saber su fecha
    const currentMicrocuento = await client.fetch(
      `
      *[_type == "microcuento" && slug.current == $slug][0] {
        publishedAt
      }
    `,
      { slug }
    )

    if (!currentMicrocuento) {
      return { prev: null, next: null }
    }

    // Obtener el anterior (más antiguo)
    const prev = await client.fetch(
      `
      *[_type == "microcuento" && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
        title,
        slug
      }
    `,
      { publishedAt: currentMicrocuento.publishedAt }
    )

    // Obtener el siguiente (más reciente)
    const next = await client.fetch(
      `
      *[_type == "microcuento" && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
        title,
        slug
      }
    `,
      { publishedAt: currentMicrocuento.publishedAt }
    )

    return { prev, next }
  } catch (error) {
    console.error(`Error al obtener microcuentos relacionados para "${slug}":`, error)
    return { prev: null, next: null }
  }
}

// Función para obtener información de un sitio por slug
export async function getSiteBySlug(slug: string): Promise<Site | null> {
  try {
    const site = await client.fetch(
      `
      *[_type == "site" && slug.current == $slug][0] {
        title,
        description,
        slug
      }
    `,
      { slug }
    )

    return site
  } catch (error) {
    console.error(`Error al obtener sitio "${slug}" desde Sanity:`, error)
    return null
  }
}

// Función para obtener todos los relatos filtrados por sitio para la vista cronológica
export async function getAllRelatosForChronologicalBySite(
  siteSlug: string,
  options: { limit?: number } = {}
): Promise<ProyectoFormateado[]> {
  const limit = Number.isFinite(options.limit) ? Math.max(0, Math.trunc(options.limit!)) : null
  const rangeClause = limit === null ? '' : `[0...${limit}]`
  try {
    const relatos = await client.fetch(
      `
      *[_type == "relato" && status == "published" && site->slug.current == $siteSlug] | order(coalesce(publishedAt, date + "T00:00:00Z") desc) ${rangeClause} {
        title,
        slug,
        summary,
        image,
        bgColor,
        publishedAt,
        date,
        "tags": tags[]->title,
        "author": author-> {
          name,
          avatar,
          slug
        }
      }
    `,
      { siteSlug }
    )

    return relatos.map(mapRelatoToProject)
  } catch (error) {
    console.error(`Error al obtener relatos para sitio "${siteSlug}":`, error)
    return []
  }
}

// Función para obtener relatos de la portada filtrados por sitio
export async function getPortadaRelatosBySite(siteSlug: string): Promise<Portada | null> {
  try {
    const result = await client.fetch(
      `
      *[_type == "portada" && site->slug.current == $siteSlug][0] {
        pageTitle,
        "relatos": relatos[] -> {
          title,
          slug,
          summary,
          image,
          bgColor,
          publishedAt,
          date,
          "tags": tags[]->title,
          "author": author-> {
            name,
            avatar,
            slug
          }
        }
      }
    `,
      { siteSlug }
    )
    return result
  } catch (error) {
    console.error(`Error al consultar portada de sitio "${siteSlug}":`, error)
    return null
  }
}

// Función para obtener relatos relacionados filtrados por sitio
export async function getRelatedRelatosBySite(
  slug: string,
  siteSlug: string,
  limit: number = 3
): Promise<Relato[]> {
  try {
    const relatos = await client.fetch(
      `
      *[_type == "relato" && slug.current != $slug && site->slug.current == $siteSlug][0...${limit}] {
        title,
        slug,
        date,
        summary,
        image,
        series,
        seriesOrder,
        "author": author-> {
          name,
          slug,
          avatar
        }
      }
    `,
      { slug, siteSlug }
    )

    return relatos
  } catch (error) {
    console.error(
      `Error al obtener relatos relacionados para "${slug}" en sitio "${siteSlug}":`,
      error
    )
    return []
  }
}

// Función para obtener navegación de relatos (prev/next) solo de publicados
export async function getRelatosNavigation(
  slug: string,
  autorSlug: string
): Promise<{
  prev: { path: string; title: string } | null
  next: { path: string; title: string } | null
}> {
  try {
    // Obtener todos los relatos publicados del autor ordenados por fecha
    const relatos = await client.fetch(
      `
      *[_type == "relato" && author->slug.current == $autorSlug && status == "published"] | order(date desc) {
        title,
        slug,
        date
      }
    `,
      { autorSlug }
    )

    const currentIndex = relatos.findIndex((r: any) => r.slug.current === slug)

    if (currentIndex === -1) {
      return { prev: null, next: null }
    }

    const prev =
      currentIndex > 0
        ? {
            path: `relato/${relatos[currentIndex - 1].slug.current}`,
            title: relatos[currentIndex - 1].title,
          }
        : null

    const next =
      currentIndex < relatos.length - 1
        ? {
            path: `relato/${relatos[currentIndex + 1].slug.current}`,
            title: relatos[currentIndex + 1].title,
          }
        : null

    return { prev, next }
  } catch (error) {
    console.error(`Error al obtener navegación de relatos para "${slug}":`, error)
    return { prev: null, next: null }
  }
}

// Función para obtener navegación de relatos en serie (prev/next) solo de publicados
export async function getRelatosSerieNavigation(
  slug: string,
  serieSlug: string
): Promise<{
  prev: { path: string; title: string } | null
  next: { path: string; title: string } | null
}> {
  try {
    // Obtener todos los relatos publicados de la serie ordenados
    const relatos = await client.fetch(
      `
      *[_type == "serie" && slug.current == $serieSlug][0] {
        "relatos": relatos[]-> {
          title,
          slug,
          date,
          status
        }
      }
    `,
      { serieSlug }
    )

    if (!relatos || !relatos.relatos) {
      return { prev: null, next: null }
    }

    // Filtrar solo los publicados
    const relatosPublicados = relatos.relatos.filter((r: any) => r.status === 'published')

    const currentIndex = relatosPublicados.findIndex((r: any) => r.slug.current === slug)

    if (currentIndex === -1) {
      return { prev: null, next: null }
    }

    const prev =
      currentIndex > 0
        ? {
            path: `relato/${relatosPublicados[currentIndex - 1].slug.current}`,
            title: relatosPublicados[currentIndex - 1].title,
          }
        : null

    const next =
      currentIndex < relatosPublicados.length - 1
        ? {
            path: `relato/${relatosPublicados[currentIndex + 1].slug.current}`,
            title: relatosPublicados[currentIndex + 1].title,
          }
        : null

    return { prev, next }
  } catch (error) {
    console.error(`Error al obtener navegación de serie para "${slug}":`, error)
    return { prev: null, next: null }
  }
}

// Función para obtener múltiples relatos por sus slugs en una sola query (OPTIMIZACIÓN)
export async function getRelatosBySlugsBatch(slugs: string[]): Promise<Record<string, Relato>> {
  if (slugs.length === 0) return {}

  try {
    const relatos = await client.fetch(
      `
      *[_type == "relato" && slug.current in $slugs] {
        title,
        slug,
        date,
        publishedAt,
        summary,
        image,
        bgColor,
        "author": author-> {
          name,
          slug,
          avatar
        },
        "tags": tags[]->title,
        "site": site-> {
          title,
          slug,
          description
        }
      }
    `,
      { slugs }
    )

    // Convertir a un mapa por slug para acceso O(1)
    const relatoMap: Record<string, Relato> = {}
    relatos.forEach((relato: Relato) => {
      if (relato.slug?.current) {
        // Limpiar título de emojis y convertir a versales
        relato.title = toVersal(cleanEmoji(relato.title))
        relatoMap[relato.slug.current] = relato
      }
    })

    return relatoMap
  } catch (error) {
    console.error('Error al obtener relatos por lotes desde Sanity:', error)
    return {}
  }
}

// Función optimizada para obtener solo el count de relatos sin traer todos los datos
export async function getRelatosCount(): Promise<number> {
  try {
    const result = await client.fetch(`count(*[_type == "relato" && status == "published"])`)
    return result || 0
  } catch (error) {
    console.error('Error al obtener count de relatos desde Sanity:', error)
    return 0
  }
}

// ===== FUNCIONES PARA MCP (Model Context Protocol) =====

// Función de búsqueda completa con full-text search y parámetros
export async function searchRelatos(params: {
  query?: string // Búsqueda full-text en título, summary y body
  author?: string // Filtrar por autor (slug)
  tags?: string[] // Filtrar por tags
  site?: string // Filtrar por sitio (slug)
  dateFrom?: string // Fecha desde (YYYY-MM-DD)
  dateTo?: string // Fecha hasta (YYYY-MM-DD)
  limit?: number // Número máximo de resultados
  offset?: number // Para paginación
  includeContent?: boolean // Si incluir el body completo o solo metadatos
}): Promise<{
  results: Relato[]
  total: number
  hasMore: boolean
}> {
  try {
    const {
      query = '',
      author,
      tags,
      site,
      dateFrom,
      dateTo,
      limit = 50,
      offset = 0,
      includeContent = false,
    } = params

    // Construir filtros dinámicamente
    const filters = ['_type == "relato"', 'status == "published"']
    const queryParams: any = {}

    // Full-text search en título, summary y contenido
    if (query.trim()) {
      // Usar GROQ para búsqueda en múltiples campos
      filters.push(
        '(title match $query + "*" || summary match $query + "*" || pt::text(body) match $query + "*")'
      )
      queryParams.query = query.trim()
    }

    // Filtro por autor
    if (author) {
      filters.push('author->slug.current == $author')
      queryParams.author = author
    }

    // Filtro por tags (al menos uno de los tags especificados)
    if (tags && tags.length > 0) {
      filters.push('count((tags[]->title)[@ in $tags]) > 0')
      queryParams.tags = tags
    }

    // Filtro por sitio
    if (site) {
      filters.push('site->slug.current == $site')
      queryParams.site = site
    }

    // Filtro por fecha desde
    if (dateFrom) {
      filters.push('coalesce(publishedAt, date) >= $dateFrom')
      queryParams.dateFrom = dateFrom
    }

    // Filtro por fecha hasta
    if (dateTo) {
      filters.push('coalesce(publishedAt, date) <= $dateTo')
      queryParams.dateTo = dateTo
    }

    const whereClause = filters.join(' && ')

    // Campos a incluir
    const fields = includeContent
      ? `
      title,
      slug,
      date,
      publishedAt,
      summary,
      image,
      bgColor,
      body,
      showDropCap,
      "author": author-> {
        name,
        slug,
        avatar,
        occupation,
        company,
        email,
        twitter,
        linkedin,
        github,
        website,
        bio
      },
      "category": category->title,
      "tags": tags[]->title,
      "site": site-> {
        title,
        slug,
        description
      },
      series,
      seriesOrder
    `
      : `
      title,
      slug,
      date,
      publishedAt,
      summary,
      image,
      bgColor,
      "author": author-> {
        name,
        slug,
        avatar
      },
      "category": category->title,
      "tags": tags[]->title,
      "site": site-> {
        title,
        slug,
        description
      }
    `

    // Query principal para obtener resultados
    const resultsQuery = `
      *[${whereClause}] | order(coalesce(publishedAt, date) desc)[${offset}...${offset + limit}] {
        ${fields}
      }
    `

    // Query para obtener el total
    const countQuery = `count(*[${whereClause}])`

    // Ejecutar ambas queries en paralelo
    const [results, total] = await Promise.all([
      client.fetch(resultsQuery, queryParams),
      client.fetch(countQuery, queryParams),
    ])

    // Procesar resultados
    const processedResults = results.map((relato: Relato) => {
      // Limpiar título de emojis y convertir a versales
      relato.title = toVersal(cleanEmoji(relato.title))

      // Agregar tiempo de lectura si incluye contenido
      if (includeContent && relato.body) {
        relato.readingTime = calcularTiempoLectura(relato.body)
      }

      return relato
    })

    return {
      results: processedResults,
      total,
      hasMore: offset + limit < total,
    }
  } catch (error) {
    console.error('Error en búsqueda de relatos:', error)
    return {
      results: [],
      total: 0,
      hasMore: false,
    }
  }
}

// Función para exportar todos los relatos en formato JSON optimizado para MCP
export async function getAllRelatosForMCP(): Promise<{
  posts: Array<{
    id: string
    title: string
    slug: string
    author: {
      name: string
      slug: string
    }
    summary: string
    tags: string[]
    site: string
    publishedAt: string
    url: string
    wordCount: number
    readingTime: string
  }>
  meta: {
    total: number
    lastUpdated: string
    sites: string[]
    authors: string[]
    allTags: string[]
  }
}> {
  try {
    // Obtener todos los relatos con información completa
    const relatos = await client.fetch(`
      *[_type == "relato" && status == "published"] | order(coalesce(publishedAt, date) desc) {
        _id,
        title,
        slug,
        date,
        publishedAt,
        summary,
        body,
        "author": author-> {
          name,
          slug
        },
        "tags": tags[]->title,
        "site": site-> {
          title,
          slug
        }
      }
    `)

    // Procesar relatos para el formato del MCP
    const processedPosts = relatos.map((relato: any) => {
      const readingTime = calcularTiempoLectura(relato.body)
      const cleanTitle = toVersal(cleanEmoji(relato.title))

      return {
        id: relato._id,
        title: cleanTitle,
        slug: relato.slug.current,
        author: {
          name: relato.author?.name || 'Autor desconocido',
          slug: relato.author?.slug?.current || '',
        },
        summary: relato.summary || '',
        tags: relato.tags || [],
        site: relato.site?.title || 'MarcaPágina',
        publishedAt: relato.publishedAt || relato.date,
        url: `https://marcapagina.com/relato/${relato.slug.current}`,
        wordCount: readingTime.words,
        readingTime: readingTime.text,
      }
    })

    // Generar metadatos
    const sites = [...new Set(processedPosts.map((p) => p.site))].filter((s): s is string =>
      Boolean(s)
    )
    const authors = [...new Set(processedPosts.map((p) => p.author.name))].filter(
      (a): a is string => Boolean(a)
    )
    const allTags = [...new Set(processedPosts.flatMap((p) => p.tags))].filter((t): t is string =>
      Boolean(t)
    )

    return {
      posts: processedPosts,
      meta: {
        total: processedPosts.length,
        lastUpdated: new Date().toISOString(),
        sites,
        authors,
        allTags,
      },
    }
  } catch (error) {
    console.error('Error al exportar relatos para MCP:', error)
    return {
      posts: [],
      meta: {
        total: 0,
        lastUpdated: new Date().toISOString(),
        sites: [],
        authors: [],
        allTags: [],
      },
    }
  }
}
