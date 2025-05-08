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