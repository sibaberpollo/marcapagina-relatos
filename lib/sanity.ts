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
    href: authorSlug ? `/${authorSlug}/relato/${relato.slug?.current}` : `/relato/${relato.slug?.current}`,
    authorImgSrc: relato.author?.avatar || '',
    authorName: relato.author?.name || '',
    authorHref: authorSlug ? `/autor/${authorSlug}` : '#',
  };
} 