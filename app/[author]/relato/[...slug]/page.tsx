import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allRelatos, allAuthors } from 'contentlayer/generated'
import type { Authors, Relato } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ author: string; slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const author = params.author
  const slug = decodeURI(params.slug.join('/'))
  const post = allRelatos.find((p) => p.slug === slug && p.author[0] === author)
  if (!post) return

  const authorList = post.author || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResult = allAuthors.find((a) => a.slug === author)!
    return coreContent(authorResult as Authors)
  })

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date((post as any).lastmod || post.date).toISOString()
  const authors = authorDetails.map((a) => a.name)
  const imageList = (post as any).images
    ? Array.isArray((post as any).images)
      ? (post as any).images
      : [(post as any).images]
    : [siteMetadata.socialBanner]
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img,
  }))

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'es_ES',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: siteMetadata.siteUrl + `/${author}/relato/${slug}`,
      images: ogImages,
      authors: authors.length ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allRelatos.map((p) => ({
    author: p.author[0],
    slug: p.slug.split('/').map((s) => decodeURI(s)),
  }))
}

export default async function Page(props: { params: Promise<{ author: string; slug: string[] }> }) {
  const params = await props.params
  const author = params.author
  const slug = decodeURI(params.slug.join('/'))

  const authorRelatos = allRelatos.filter((p) => p.author[0] === author)
  const post = authorRelatos.find((p) => p.slug === slug)! as Relato

  if (!post) return notFound()

  let prev: { path: string; title: string } | null = null
  let next: { path: string; title: string } | null = null
  let seriesRelatos: Relato[] = []

  if (post.series) {
    seriesRelatos = authorRelatos
      .filter((p) => p.series === post.series)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))

    const currentIndex = seriesRelatos.findIndex((p) => p.slug === slug)
    if (currentIndex > 0) {
      prev = {
        path: `${author}/relato/${seriesRelatos[currentIndex - 1].slug}`,
        title: seriesRelatos[currentIndex - 1].title,
      }
    }
    if (currentIndex < seriesRelatos.length - 1) {
      next = {
        path: `${author}/relato/${seriesRelatos[currentIndex + 1].slug}`,
        title: seriesRelatos[currentIndex + 1].title,
      }
    }
  } else {
    const posts = allCoreContent(sortPosts(authorRelatos))
    const idx = posts.findIndex((p) => p.slug === slug)
    if (idx > 0) {
      prev = {
        path: `${author}/relato/${posts[idx - 1].slug}`,
        title: posts[idx - 1].title,
      }
    }
    if (idx < posts.length - 1) {
      next = {
        path: `${author}/relato/${posts[idx + 1].slug}`,
        title: posts[idx + 1].title,
      }
    }
  }

  const authorDetails = (post.author || ['default']).map((author) => {
    const authorResult = allAuthors.find((a) => a.slug === author)!
    return coreContent(authorResult as Authors)
  })

  const mainContent = coreContent(post)
  const jsonLd = {
    ...(post as any).structuredData,
    author: authorDetails.map((a) => ({
      '@type': 'Person',
      name: a.name,
    })),
  }
  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout 
        content={mainContent} 
        authorDetails={authorDetails} 
        next={next} 
        prev={prev}
        series={post.series ? {
          name: post.series,
          relatos: seriesRelatos.map(relato => ({
            ...coreContent(relato),
            path: `${author}/relato/${relato.slug}`
          })),
          currentOrder: post.seriesOrder || 0
        } : null}
      >
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        {post.series && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Serie: {post.series}</h2>
            <div className="space-y-4">
              {seriesRelatos.map((relato) => (
                <div
                  key={relato.slug}
                  className={`p-4 rounded-lg ${
                    relato.slug === slug
                      ? 'bg-primary-100 dark:bg-primary-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Link
                    href={`/${author}/relato/${relato.slug}`}
                    className="block hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {relato.seriesOrder}. {relato.title}
                      </span>
                      {relato.slug === slug && (
                        <span className="text-sm text-primary-500">(Leyendo)</span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </Layout>
    </>
  )
} 