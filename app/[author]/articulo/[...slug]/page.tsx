// app/[author]/articulo/[...slug]/page.tsx
import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allAuthors, allArticulos } from 'contentlayer/generated'
import type { Authors, Articulo } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import ClientFixedNavWrapper from '@/components/ClientFixedNavWrapper'

const defaultLayout = 'PostLayout'
const layouts = { PostSimple, PostLayout, PostBanner }

export async function generateMetadata(props: {
  params: Promise<{ author: string; slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const author = params.author
  const slug = decodeURI(params.slug.join('/'))

  const post = allArticulos.find(
    (p) => p.slug === slug && p.author[0] === author
  )
  if (!post) return

  const authorList = post.author || ['default']
  const authorDetails = authorList.map((a) => {
    const ar = allAuthors.find((x) => x.slug === a)!
    return coreContent(ar as Authors)
  })

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(
    (post as any).lastmod || post.date
  ).toISOString()
  const authors = authorDetails.map((a) => a.name)
  const rawImages = (post as any).image ?? (post as any).images
  const imageList = rawImages
    ? Array.isArray(rawImages)
      ? rawImages
      : [rawImages]
    : [siteMetadata.socialBanner]
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img
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
      url: siteMetadata.siteUrl + `/${author}/articulo/${slug}`,
      images: ogImages,
      authors: authors.length ? authors : [siteMetadata.author]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: ogImages.map(({ url }) => url)
    }
  }
}

export const generateStaticParams = async () => {
  return allArticulos.map((p) => ({
    author: p.author[0],
    slug: p.slug.split('/').map((s) => decodeURI(s))
  }))
}

export default async function Page(props: {
  params: Promise<{ author: string; slug: string[] }>
}) {
  const params = await props.params
  const author = params.author
  const slug = decodeURI(params.slug.join('/'))

  const authorArticulos = allArticulos.filter(
    (p) => p.author[0] === author
  )
  const post = authorArticulos.find((p) => p.slug === slug)! as Articulo
  if (!post) return notFound()

  let prev: { path: string; title: string } | null = null
  let next: { path: string; title: string } | null = null
  let seriesArticulos: Articulo[] = []

  if (post.series) {
    seriesArticulos = authorArticulos
      .filter((p) => p.series === post.series)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))

    const idx = seriesArticulos.findIndex((p) => p.slug === slug)
    if (idx > 0) {
      prev = {
        path: `${author}/articulo/${seriesArticulos[idx - 1].slug}`,
        title: seriesArticulos[idx - 1].title
      }
    }
    if (idx < seriesArticulos.length - 1) {
      next = {
        path: `${author}/articulo/${seriesArticulos[idx + 1].slug}`,
        title: seriesArticulos[idx + 1].title
      }
    }
  } else {
    const posts = allCoreContent(sortPosts(authorArticulos))
    const idx = posts.findIndex((p) => p.slug === slug)
    if (idx > 0) {
      prev = {
        path: `${author}/articulo/${posts[idx - 1].slug}`,
        title: posts[idx - 1].title
      }
    }
    if (idx < posts.length - 1) {
      next = {
        path: `${author}/articulo/${posts[idx + 1].slug}`,
        title: posts[idx + 1].title
      }
    }
  }

  const authorDetails = (post.author || ['default']).map((a) => {
    const ar = allAuthors.find((x) => x.slug === a)!
    return coreContent(ar as Authors)
  })
  const authorPostsCore = allCoreContent(
    authorArticulos.filter((p) => p.slug !== slug)
  )
  const mainContent = coreContent(post)
  const jsonLd = {
    ...(post as any).structuredData,
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name }))
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
        series={
          post.series
            ? {
                name: post.series,
                relatos: seriesArticulos.map((art) => ({
                  ...coreContent(art),
                  path: `${author}/articulo/${art.slug}`
                })),
                currentOrder: post.seriesOrder || 0
              }
            : null
        }
      >
        <MDXLayoutRenderer
          code={post.body.code}
          components={components}
          toc={post.toc}
        />
      </Layout>

      <ClientFixedNavWrapper
        title={post.title}
        authorAvatar={authorDetails[0]?.avatar}
        authorName={authorDetails[0]?.name}
        slug={slug}
        relatedPosts={authorPostsCore}
        author={author}
        pathPrefix="articulo"
        readingTime={post.readingTime}
      />
    </>
  )
}
 