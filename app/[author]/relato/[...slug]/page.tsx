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
  const posts = allCoreContent(sortPosts(authorRelatos))
  const idx = posts.findIndex((p) => p.slug === slug)
  if (idx === -1) return notFound()

  const prev = posts[idx + 1] ?? null
  const next = posts[idx - 1] ?? null
  const post = allRelatos.find((p) => p.slug === slug && p.author[0] === author)! as Relato

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
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
} 