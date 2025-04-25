import { Authors, allAuthors, allRelatos, allArticulos } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent, sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// Generamos los parámetros estáticos para todos los autores en tiempo de build
export const generateStaticParams = async () => {
  return allAuthors.map((author) => ({
    slug: author.slug,
  }))
}

// Generamos metadata para la página
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const author = allAuthors.find((p) => p.slug === params.slug) as Authors
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

export default function AuthorPage({ params }: { params: { slug: string } }) {
  // Buscamos el autor por su slug
  const author = allAuthors.find((p) => p.slug === params.slug) as Authors
  if (!author) {
    return notFound()
  }
  
  const mainContent = coreContent(author)
  
  // Obtenemos los relatos del autor
  const authorRelatos = allRelatos.filter((relato) => 
    relato.author.includes(params.slug)
  )
  
  // Obtenemos los artículos del autor
  const authorArticulos = allArticulos.filter((articulo) => 
    articulo.author.includes(params.slug)
  )
  
  // Ordenar por fecha más reciente
  const sortedRelatos = sortPosts(authorRelatos)
  const sortedArticulos = sortPosts(authorArticulos)
  
  // Convertir a formato core content para las cards
  const relatosCore = allCoreContent(sortedRelatos)
  const articulosCore = allCoreContent(sortedArticulos)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
        
        {/* Sección de Relatos */}
        {relatosCore.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold mb-6">Relatos</h2>
            <div className="space-y-8">
              {relatosCore.map((relato) => (
                <div key={relato.slug} className="border-b pb-6"> 
                  <h3 className="text-2xl font-semibold mb-2">
                    <Link href={`/${params.slug}/relato/${relato.slug}`} className="no-underline">{relato.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-2">{relato.summary}</p>
                  <Link href={`/${params.slug}/relato/${relato.slug}`} className="text-primary-500 font-medium">Leer más &rarr;</Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Sección de Artículos */}
        {articulosCore.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold mb-6">Artículos</h2>
            <div className="space-y-8">
              {articulosCore.map((articulo) => (
                <div key={articulo.slug} className="border-b pb-6">
                  <h3 className="text-2xl font-semibold mb-2">
                    <Link href={`/${params.slug}/articulo/${articulo.slug}`} className="no-underline">{articulo.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-2">{articulo.summary}</p>
                  <Link href={`/${params.slug}/articulo/${articulo.slug}`} className="text-primary-500 font-medium">Leer más &rarr;</Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </AuthorLayout>
    </>
  )
} 