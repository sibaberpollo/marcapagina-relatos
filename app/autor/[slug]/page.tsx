// app/autor/[slug]/page.tsx

import { getAllAutores, getAutorData, getArticulosByAutor } from '../../../lib/sanity'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import AuthorTabContent from '@/components/AuthorTabContent'
import { Suspense } from 'react'
import { type Authors } from 'contentlayer/generated'
import fs from 'fs'
import path from 'path'

// Interfaz para los artículos externos
interface ExternalArticle {
  id: string;
  title: string;
  url: string;
  image?: string;
  summary: string;
  category: string;
  date: string;
  source: string;
}

// Interfaz para el contenido de tablas
interface TabContent {
  slug: string;
  title: string;
  summary: string;
  date?: string; 
  series?: string;
  isExternal?: boolean;
  externalUrl?: string;
  source?: string;
  image?: string;
}

// Cargar artículos externos desde el JSON
function loadExternalArticles(authorSlug: string): ExternalArticle[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'external-articles.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const articles = JSON.parse(fileContent);
    
    // El archivo ahora es un array directo de artículos
    if (Array.isArray(articles)) {
      return articles;
    }
    
    return [];
  } catch (error) {
    console.error('Error cargando artículos externos:', error);
    return [];
  }
}

// Función para actualizar artículos externos (opcional, se puede llamar desde la interfaz)
async function updateExternalArticles() {
  try {
    // Solo ejecutar en el servidor
    if (typeof window === 'undefined') {
      // Llamar al endpoint de actualización
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/update-external-articles`);
      const data = await response.json();
      return data.success;
    }
    return false;
  } catch (error) {
    console.error('Error actualizando artículos externos:', error);
    return false;
  }
}

// Generar rutas estáticas para todos los autores
export async function generateStaticParams() {
  const autores = await getAllAutores()
  return autores.map((autor) => ({
    slug: autor.slug.current,
  }))
}

// Generar metadata para SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Aseguramos que params es esperado (awaited)
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  
  const { author } = await getAutorData(slug);
  
  if (!author) {
    return {
      title: 'Autor no encontrado',
      description: 'No se encontró el autor',
    }
  }
  
  return genPageMetadata({
    title: author.name,
    description: `Perfil y obras de ${author.name}`,
  })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Aseguramos que params es esperado (awaited)
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  
  // Obtenemos todos los datos del autor en una sola llamada
  const { author, formattedRelatos, series } = await getAutorData(slug);
  
  if (!author) {
    return notFound()
  }
  
  // Determinar si debemos usar artículos externos desde el JSON
  let articulos: TabContent[] = [];
  
  if (slug === 'pino') {
    // Para José Pino, cargar artículos desde el JSON
    const externalArticles = loadExternalArticles('pino');
    articulos = externalArticles.map(article => ({
      slug: article.id, // Usamos el ID como slug
      title: article.title,
      summary: article.summary || '',
      date: article.date,
      image: article.image,
      isExternal: true,
      externalUrl: article.url,
      source: article.source
    }));
    
    // Opcionalmente, actualizar el archivo JSON (comentado por defecto para no hacer muchas peticiones)
    // await updateExternalArticles();
  } else {
    // Para otros autores, seguir usando Sanity
    const articulosData = await getArticulosByAutor(slug);
    
    // Formateamos los artículos para la UI
    articulos = articulosData.map(articulo => {
      // Determinar la fuente basado en la URL
      let source = 'El Estímulo';
      if (articulo.externalUrl && articulo.externalUrl.includes('/ub/')) {
        source = 'Urbe Bikini';
      } else if (articulo.source) {
        source = articulo.source;
      }
      
      return {
        slug: articulo.slug.current,
        title: articulo.title,
        summary: articulo.summary || '',
        date: articulo.date,
        image: articulo.image,
        isExternal: articulo.isExternal,
        externalUrl: articulo.externalUrl,
        source: source
      };
    });
  }
  
  // Determinar el tab por defecto según el autor
  const defaultTab = (author.defaultTab === 'relatos' || author.defaultTab === 'series' || author.defaultTab === 'articulos') 
    ? author.defaultTab 
    : 'relatos'
  
  // Convertir el autor de Sanity al formato esperado por AuthorLayout
  const authorContent: Omit<Authors, '_id' | '_raw' | 'body'> = {
    name: author.name,
    avatar: author.avatar || '',
    occupation: author.occupation || '',
    company: author.company || '',
    email: author.email || '',
    twitter: author.twitter || '',
    bluesky: author.bluesky || '',
    linkedin: author.linkedin || '',
    github: author.github || '',
    website: author.website || '',
    instagram: author.instagram || '',
    sitios: author.sitios || [],
    // Propiedades adicionales requeridas por el tipo Authors
    type: 'Authors',
    defaultTab: author.defaultTab || 'relatos',
    slug: slug,
    path: `/autor/${slug}`,
    filePath: '',
    toc: [],
    // Estos valores no se usan en el componente, pero son requeridos por el tipo
    readingTime: { text: '', minutes: 0, time: 0, words: 0 }
  } as Omit<Authors, '_id' | '_raw' | 'body'>

  return (
    <AuthorLayout content={authorContent}>
      {/* Mostrar la biografía del autor */}
      {author.bio && (
        <div className="mb-8">
          <p className="text-gray-700 dark:text-gray-300">{author.bio}</p>
        </div>
      )}
      
      {/* Componente de tabs para filtrar contenido */}
      <Suspense fallback={<div className="p-4 text-center">Cargando contenido...</div>}>
        <AuthorTabContent 
          relatos={formattedRelatos} 
          articulos={articulos}
          authorSlug={slug}
          defaultTab={defaultTab}
        />
      </Suspense>
    </AuthorLayout>
  )
}
 