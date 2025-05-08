import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1e5yjq4n';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';

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
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
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
}

// Función para obtener los relatos de la portada
export async function getPortadaRelatos(): Promise<Portada | null> {
  console.log('Ejecutando consulta GROQ a Sanity - getPortadaRelatos');
  try {
    const result = await client.fetch(`
      *[_type == "portada"][0] {
        pageTitle,
        "relatos": relatos[] -> {
          title,
          slug,
          summary,
          image,
          "author": author-> {
            name,
            avatar,
            slug
          }
        }
      }
    `);
    console.log('Resultado de Sanity:', { 
      pageTitle: result?.pageTitle,
      relatosCount: result?.relatos?.length || 0 
    });
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
  console.log('Obteniendo todos los autores desde Sanity');
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
    console.log(`Se encontraron ${autores.length} autores en Sanity`);
    return autores;
  } catch (error) {
    console.error('Error al obtener autores desde Sanity:', error);
    return [];
  }
}

// Obtener un autor específico por slug
export async function getAutorBySlug(slug: string): Promise<Autor | null> {
  console.log(`Obteniendo autor "${slug}" desde Sanity`);
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
    
    if (autor) {
      console.log(`Autor "${autor.name}" encontrado`);
    } else {
      console.log(`Autor con slug "${slug}" no encontrado`);
    }
    
    return autor;
  } catch (error) {
    console.error(`Error al obtener autor "${slug}" desde Sanity:`, error);
    return null;
  }
}

// Obtener los relatos de un autor
export async function getRelatosByAutor(autorSlug: string): Promise<Relato[]> {
  console.log(`Obteniendo relatos del autor "${autorSlug}" desde Sanity`);
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
        "author": author-> {
          name,
          slug,
          avatar
        },
        "category": category->title,
        "tags": tags[]->title
      }
    `, { autorSlug });
    
    console.log(`Se encontraron ${relatos.length} relatos del autor "${autorSlug}"`);
    return relatos;
  } catch (error) {
    console.error(`Error al obtener relatos del autor "${autorSlug}" desde Sanity:`, error);
    return [];
  }
}

// Obtener las series de un autor
export async function getSeriesByAutor(autorSlug: string): Promise<any[]> {
  console.log(`Obteniendo series del autor "${autorSlug}" desde Sanity`);
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
          summary
        }
      }
    `, { autorSlug });
    
    console.log(`Se encontraron ${series.length} series del autor "${autorSlug}"`);
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
  };
}

// Al final del archivo, agregamos una función consolidada
export async function getAutorData(slug: string) {
  console.log(`Obteniendo datos completos del autor "${slug}"`);
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
      series: undefined
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
  console.log(`Obteniendo relato "${slug}" desde Sanity`);
  try {
    const relato = await client.fetch(`
      *[_type == "relato" && slug.current == $slug][0] {
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
        },
        "category": category->title,
        "tags": tags[]->title,
        "seriesObj": series->{name, title},
        series,
        seriesOrder
      }
    `, { slug });
    
    if (relato) {
      console.log(`Relato "${relato.title}" encontrado`);
      console.log('Datos de series en relato:', {
        seriesObj: relato.seriesObj,
        series: relato.series,
        seriesOrder: relato.seriesOrder
      });
      
      // Calcular tiempo de lectura basado en el contenido
      relato.readingTime = calcularTiempoLectura(relato.body);
      console.log(`Tiempo de lectura calculado: ${relato.readingTime.text} (${relato.readingTime.words} palabras)`);
    } else {
      console.log(`Relato con slug "${slug}" no encontrado`);
    }
    
    return relato;
  } catch (error) {
    console.error(`Error al obtener relato "${slug}" desde Sanity:`, error);
    return null;
  }
}

// Función para obtener todos los relatos
export async function getAllRelatos(): Promise<Relato[]> {
  console.log('Obteniendo todos los relatos desde Sanity');
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
    console.log(`Se encontraron ${relatos.length} relatos en Sanity`);
    return relatos;
  } catch (error) {
    console.error('Error al obtener relatos desde Sanity:', error);
    return [];
  }
}

// Función para obtener relatos relacionados
export async function getRelatedRelatos(slug: string, limit: number = 3): Promise<Relato[]> {
  console.log(`Obteniendo relatos relacionados para "${slug}"`);
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
    
    console.log(`Se encontraron ${relatos.length} relatos relacionados`);
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
  console.log(`Obteniendo serie que contiene al relato "${slug}"`);
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
      console.log(`No se encontró serie para el relato "${slug}"`);
      return { serie: null, relatosDeSerie: [] };
    }
    
    // Tomamos la primera serie (normalmente solo habrá una)
    const serie = series[0];
    console.log(`Serie encontrada: "${serie.title}" con ${serie.relatos.length} relatos`);
    
    return {
      serie,
      relatosDeSerie: serie.relatos
    };
  } catch (error) {
    console.error(`Error al obtener serie para el relato "${slug}":`, error);
    return { serie: null, relatosDeSerie: [] };
  }
} 