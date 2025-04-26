// app/autor/[slug]/page.tsx

import { Authors, allAuthors, allRelatos, allArticulos } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent, sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const generateStaticParams = async () => {
  return allAuthors.map((author) => ({
    slug: author.slug,
  }))
}

export async function generateMetadata({ params }) {
  const author = allAuthors.find((p) => p.slug === params.slug)
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

export default async function Page({ params }) {
  const author = allAuthors.find((p) => p.slug === params.slug)
  if (!author) {
    return notFound()
  }

  const mainContent = coreContent(author)
  const authorRelatos = allRelatos.filter((r) => r.author.includes(params.slug))
  const authorArticulos = allArticulos.filter((a) => a.author.includes(params.slug))
  const relatosCore = allCoreContent(sortPosts(authorRelatos))
  const articulosCore = allCoreContent(sortPosts(authorArticulos))

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />

      {/* Sección de Relatos */}
      {relatosCore.length > 0 && (
        <section className="mt-2">
          <h2 className="text-3xl font-bold mt-0 pt-0">Relatos</h2>
          <div className="space-y-8">
            {relatosCore.map((relato) => (
              <div key={relato.slug} className="border-b pb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  <Link
                    href={`/${params.slug}/relato/${relato.slug}`}
                    className="no-underline hover:underline"
                  >
                    {relato.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-2">{relato.summary}</p>
                <Link
                  href={`/${params.slug}/relato/${relato.slug}`}
                  className="text-primary-500 font-medium"
                >
                  Leer más &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sección de Artículos */}
      {articulosCore.length > 0 && (
        <section className="mt-10">
          <h2 className="text-3xl font-bold mb-6">Artículos</h2>
          <div className="space-y-8">
            {articulosCore.map((articulo) => (
              <div key={articulo.slug} className="border-b pb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  <Link
                    href={`/${params.slug}/articulo/${articulo.slug}`}
                    className="no-underline hover:underline"
                  >
                    {articulo.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-2">{articulo.summary}</p>
                <Link
                  href={`/${params.slug}/articulo/${articulo.slug}`}
                  className="text-primary-500 font-medium"
                >
                  Leer más &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </AuthorLayout>
  )
}
