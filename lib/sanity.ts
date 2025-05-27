import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
});

// Definición de tipos
interface Autor {
  name: string;
  avatar: string;
  occupation?: string;
  company?: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  bluesky?: string;
  bio?: string;
  defaultTab?: string;
  slug: {
    current: string;
  };
}

interface Relato {
  title: string;
  slug: {
    current: string;
  };
  summary?: string;
  image?: string;
  author: Autor;
  date: string;
  category?: any;
  tags?: any[];
  body?: any;
  status?: string;
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  bgColor?: string;
  publishedAt?: string;
}

interface Portada {
  pageTitle: string;
  relatos: Relato[];
}

interface ProyectoFormateado {
  title: string;
  description: string;
  imgSrc: string;
  href: string;
  authorImgSrc: string;
  authorName: string;
  authorHref: string;
  bgColor: string;
  tags: string[];
  publishedAt: string;
}

// Interfaz para Artículo
interface Articulo {
  title: string;
  slug: {
    current: string;
  };
  summary?: string;
  image?: string;
  author: Autor;
  date: string;
  body?: any;
  status?: string;
  isExternal?: boolean;
  externalUrl?: string;
  source?: string;
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

// Interfaz para el desafío
interface Desafio {
  titulo: string;
  descripcion: string;
  relatos: {
    relato: Relato;
    orden: number;
  }[];
  preguntas: {
    relatoId: string;
    pregunta: string;
    opciones: {
      texto: string;
      esCorrecta: boolean;
    }[];
  }[];
  activo: boolean;
  mensajeExito: string;
  mensajeError: string;
}

// Función para obtener los relatos de la portada
export async function getPortadaRelatos(): Promise<Portada | null> {
  try {
    const result = await client.fetch(`
      *[_type == "portada"][0] {
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
    `);
    return result;
  } catch (error) {
    console.error('Error al consultar Sanity:', error);
    return null;
  }
}

// Función para obtener el relato destacado y los no destacados
export async function getFeaturedAndNonFeaturedRelatos(): Promise<{
  featured: ProyectoFormateado | null;
  nonFeatured: ProyectoFormateado[];
}> {
  const portada = await getPortadaRelatos();
  
  if (!portada || !portada.relatos || portada.relatos.length === 0) {
    return { featured: null, nonFeatured: [] };
  }
  
  // El primer relato en el arreglo es el destacado
  const featured = portada.relatos[0];
  const nonFeatured = portada.relatos.slice(1);
  
  return {
    featured: mapRelatoToProject(featured),
    nonFeatured: nonFeatured.map(mapRelatoToProject)
  };
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
        defaultTab
      }
    `);
    return autores;
  } catch (error) {
    console.error('Error al obtener autores desde Sanity:', error);
    return [];
  }
}

// Obtener un autor específico por slug
export async function getAutorBySlug(slug: string): Promise<Autor | null> {
  try {
    const autor = await client.fetch(`
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
        defaultTab
      }
    `, { slug });
    
    return autor;
  } catch (error) {
    console.error(`Error al obtener autor "${slug}" desde Sanity:`, error);
    return null;
  }
}

// Obtener los relatos de un autor
export async function getRelatosByAutor(autorSlug: string): Promise<Relato[]> {
  try {
    const relatos = await client.fetch(`
      *[_type == "relato" && author->slug.current == $autorSlug] | order(date desc) {
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
    `, { autorSlug });
    
    return relatos;
  } catch (error) {
    console.error(`Error al obtener relatos del autor "${autorSlug}" desde Sanity:`, error);
    return [];
  }
}

// Obtener las series de un autor
export async function getSeriesByAutor(autorSlug: string): Promise<any[]> {
  try {
    const series = await client.fetch(`
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
    `, { autorSlug });
    
    return series;
  } catch (error) {
    console.error(`Error al obtener series del autor "${autorSlug}" desde Sanity:`, error);
    return [];
  }
}

// Función para mapear un relato de Sanity al formato que espera la UI
function mapRelatoToProject(relato: Relato): ProyectoFormateado {
  // Asegurarnos de que la ruta tenga el formato correcto
  const authorSlug = relato.author?.slug?.current || '';
  
  return {
    title: relato.title,
    description: relato.summary || '',
    imgSrc: relato.image || '',
    href: `/relato/${relato.slug?.current}`,
    authorImgSrc: relato.author?.avatar || '',
    authorName: relato.author?.name || '',
    authorHref: authorSlug ? `/autor/${authorSlug}` : '#',
    bgColor: relato.bgColor || '#efa106',
    tags: relato.tags || [],
    publishedAt: relato.publishedAt || relato.date
  };
}

// Al final del archivo, agregamos una función consolidada
export async function getAutorData(slug: string) {
  try {
    // Obtenemos todos los datos necesarios en una sola función
    const [author, relatos, series] = await Promise.all([
      getAutorBySlug(slug),
      getRelatosByAutor(slug),
      getSeriesByAutor(slug)
    ]);
    
    // Formateamos los relatos para la UI
    const formattedRelatos = relatos.map(relato => ({
      slug: relato.slug.current,
      title: relato.title,
      summary: relato.summary || '',
      series: undefined,
      status: relato.status
    }));
    
    // Asociamos los relatos con sus series
    series.forEach(serie => {
      serie.relatos.forEach(relato => {
        const index = formattedRelatos.findIndex(r => r.slug === relato.slug.current);
        if (index !== -1) {
          formattedRelatos[index].series = serie.title;
        }
      });
    });
    
    return { author, formattedRelatos, series };
  } catch (error) {
    console.error(`Error al obtener datos del autor "${slug}"`, error);
    return { author: null, formattedRelatos: [], series: [] };
  }
}

// Función auxiliar para calcular el tiempo de lectura
function calcularTiempoLectura(contenido: any = '') {
  // Promedio de palabras por minuto para lectura
  const PALABRAS_POR_MINUTO = 200;
  
  // Extrae solo el texto plano del contenido
  let texto = '';
  if (typeof contenido === 'string') {
    texto = contenido;
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
      .join(' ');
  }
  
  // Cuenta palabras (dividiendo por espacios)
  const palabras = texto.trim().split(/\s+/).length;
  
  // Calcula minutos
  const minutos = Math.max(1, Math.ceil(palabras / PALABRAS_POR_MINUTO));
  
  return {
    text: `${minutos} min`,
    minutes: minutos,
    time: minutos * 60 * 1000,
    words: palabras
  };
}

// Función para obtener un relato por su slug
export async function getRelatoBySlug(slug: string): Promise<Relato | null> {
  try {
    const relato = await client.fetch(`
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
        seriesOrder
      }
    `, { slug });
    
    if (relato) {
      // Calcular tiempo de lectura basado en el contenido
      relato.readingTime = calcularTiempoLectura(relato.body);
    }
    
    return relato;
  } catch (error) {
    console.error(`Error al obtener relato "${slug}" desde Sanity:`, error);
    return null;
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
    `);
    return relatos;
  } catch (error) {
    console.error('Error al obtener relatos desde Sanity:', error);
    return [];
  }
}

// Función para obtener relatos relacionados
export async function getRelatedRelatos(slug: string, limit: number = 3): Promise<Relato[]> {
  try {
    const relatos = await client.fetch(`
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
    `, { slug });
    
    return relatos;
  } catch (error) {
    console.error(`Error al obtener relatos relacionados para "${slug}":`, error);
    return [];
  }
}

// Función para obtener la serie de un relato y todos los relatos de esa serie
export async function getSerieDeRelato(slug: string): Promise<{
  serie: any;
  relatosDeSerie: Relato[];
}> {
  try {
    // Primero buscamos la serie que contiene este relato
    const series = await client.fetch(`
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
    `, { slug });
    
    if (series.length === 0) {
      return { serie: null, relatosDeSerie: [] };
    }
    
    // Tomamos la primera serie (normalmente solo habrá una)
    const serie = series[0];
    
    return {
      serie,
      relatosDeSerie: serie.relatos
    };
  } catch (error) {
    console.error(`Error al obtener serie para el relato "${slug}":`, error);
    return { serie: null, relatosDeSerie: [] };
  }
}

// Función para obtener un artículo por su slug
export async function getArticuloBySlug(slug: string): Promise<Articulo | null> {
  try {
    const articulo = await client.fetch(`
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
    `, { slug });
    
    if (articulo) {
      // Calcular tiempo de lectura basado en el contenido
      articulo.readingTime = calcularTiempoLectura(articulo.body);
    }
    
    return articulo;
  } catch (error) {
    console.error(`Error al obtener artículo "${slug}" desde Sanity:`, error);
    return null;
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
    `);
    return articulos;
  } catch (error) {
    console.error('Error al obtener artículos desde Sanity:', error);
    return [];
  }
}

// Función para obtener los artículos de un autor
export async function getArticulosByAutor(autorSlug: string): Promise<Articulo[]> {
  try {
    const articulos = await client.fetch(`
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
    `, { autorSlug });
    
    return articulos;
  } catch (error) {
    console.error(`Error al obtener artículos del autor "${autorSlug}" desde Sanity:`, error);
    return [];
  }
}

// Función para obtener artículos relacionados
export async function getRelatedArticulos(slug: string, limit: number = 3): Promise<Articulo[]> {
  try {
    const articulos = await client.fetch(`
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
    `, { slug });
    
    return articulos;
  } catch (error) {
    console.error(`Error al obtener artículos relacionados para "${slug}":`, error);
    return [];
  }
}

// Función para obtener el desafío activo
export async function getDesafioActivo(): Promise<Desafio | null> {
  try {
    console.log('Iniciando búsqueda de desafío activo');
    console.log(`Sanity config - projectId: ${projectId}, dataset: ${dataset}, apiVersion: ${apiVersion}`);
    
    if (!projectId || !dataset || !apiVersion) {
      console.error('Error: Faltan variables de entorno para Sanity', { projectId, dataset, apiVersion });
      throw new Error('Configuración incompleta de Sanity');
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
    `);
    
    if (!desafio) {
      console.error('No se encontró ningún desafío activo en Sanity');
      return null;
    }
    
    // Verificar que el desafío tenga relatos
    if (!desafio.relatos || desafio.relatos.length === 0) {
      console.error('El desafío no tiene relatos asociados');
      return null;
    }
    
    // Ordenar los relatos por el campo orden
    desafio.relatos.sort((a, b) => a.orden - b.orden);
    
    return desafio;
  } catch (error) {
    console.error('Error al obtener desafío activo desde Sanity:', error);
    throw error; // Re-lanzar para que el componente pueda manejarlo
  }
}

// Función para obtener un desafío específico por ID
export async function getDesafioById(id: string): Promise<Desafio | null> {
  try {
    console.log(`Iniciando búsqueda de desafío con ID: ${id}`);
    console.log(`Sanity config - projectId: ${projectId}, dataset: ${dataset}, apiVersion: ${apiVersion}`);
    
    if (!projectId || !dataset || !apiVersion) {
      console.error('Error: Faltan variables de entorno para Sanity', { projectId, dataset, apiVersion });
      throw new Error('Configuración incompleta de Sanity');
    }
    
    const desafio = await client.fetch(`
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
    `, { id });
    
    console.log('Respuesta de Sanity para desafío:', desafio ? 'Datos recibidos' : 'NULL');
    
    // Si no se encuentra el desafío
    if (!desafio) {
      console.error(`No se encontró el desafío con ID ${id} en Sanity`);
      return null;
    }
    
    // Verificar que el desafío tenga relatos
    if (!desafio.relatos || desafio.relatos.length === 0) {
      console.error('El desafío no tiene relatos asociados');
      return null;
    }
    
    // Ordenar los relatos por el campo orden
    desafio.relatos.sort((a, b) => a.orden - b.orden);
    
    return desafio;
  } catch (error) {
    console.error(`Error al obtener desafío "${id}" desde Sanity:`, error);
    throw error; // Re-lanzar para que el componente pueda manejarlo
  }
}

// Función para obtener todos los relatos para la vista cronológica
export async function getAllRelatosForChronological(): Promise<ProyectoFormateado[]> {
  try {
    const relatos = await client.fetch(`
      *[_type == "relato"] | order(publishedAt desc, date desc) {
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
    `);
    
    return relatos.map(mapRelatoToProject);
  } catch (error) {
    console.error('Error al obtener todos los relatos:', error);
    return [];
  }
} 