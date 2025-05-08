// app/relato/[slug]/page.tsx
import 'css/prism.css'
import 'katex/dist/katex.css'

import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import seriesMetadata from '@/data/seriesMetadata'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClientFixedNavWrapper from '@/components/ClientFixedNavWrapper'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import CustomTooltip from '@/components/CustomTooltip'
import { getRelatoBySlug, getRelatosByAutor, getAllRelatos, getSerieDeRelato } from '../../../lib/sanity'
import { PortableText } from '@portabletext/react'

const defaultLayout = 'PostLayout'
const layouts = { PostSimple, PostLayout, PostBanner }

// Componentes personalizados para el PortableText de Sanity
const ptComponents = {
  types: {
    image: ({ value }: any) => (
      <img
        src={value.imageUrl || value.asset?.url}
        alt={value.alt || ''}
        className="w-full rounded-lg my-4"
      />
    ),
    callout: ({ value }: any) => (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg my-4">
        <p className="italic">{value.text}</p>
      </div>
    )
  },
  marks: {
    link: ({ value, children }: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
    tooltip: ({ value, children }: any) => {
      return <CustomTooltip text={String(children)} tooltip={value.tooltipText} />
    }
  }
} as any

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const { slug } = params
  const post = await getRelatoBySlug(slug)
  if (!post) return

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.date).toISOString()
  const imageList = post.image ? [post.image] : [siteMetadata.socialBanner]
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
      url: siteMetadata.siteUrl + `/relato/${slug}`,
      images: ogImages,
      authors: [post.author.name]
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
  const relatos = await getAllRelatos()
  return relatos.map((relato) => ({
    slug: relato.slug.current
  }))
}

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const { slug } = params
  const post = await getRelatoBySlug(slug)
  if (!post) return notFound()

  const autorRelatos = await getRelatosByAutor(post.author.slug.current)
  const { serie, relatosDeSerie } = await getSerieDeRelato(slug)

  let prev: { path: string; title: string } | undefined
  let next: { path: string; title: string } | undefined

  if (serie && relatosDeSerie.length > 0) {
    const idx = relatosDeSerie.findIndex((r) => r.slug.current === slug)
    if (idx > 0) {
      const p = relatosDeSerie[idx - 1]
      prev = { path: `relato/${p.slug.current}`, title: p.title }
    }
    if (idx < relatosDeSerie.length - 1) {
      const n = relatosDeSerie[idx + 1]
      next = { path: `relato/${n.slug.current}`, title: n.title }
    }
  } else {
    const sorted = [...autorRelatos].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    const idx = sorted.findIndex((r) => r.slug.current === slug)
    if (idx > 0) {
      const p = sorted[idx - 1]
      prev = { path: `relato/${p.slug.current}`, title: p.title }
    }
    if (idx < sorted.length - 1) {
      const n = sorted[idx + 1]
      next = { path: `relato/${n.slug.current}`, title: n.title }
    }
  }

  const authorDetails = [
    {
      name: post.author.name,
      avatar: post.author.avatar,
      occupation: post.author.occupation || '',
      company: post.author.company || '',
      twitter: post.author.twitter || '',
      linkedin: post.author.linkedin || '',
      github: post.author.github || '',
      slug: post.author.slug.current,
      type: 'authors',
      path: `/autor/${post.author.slug.current}`,
      defaultTab: 'relatos',
      readingTime: { text: '', minutes: 0, time: 0, words: 0 },
      filePath: '',
      url: `/autor/${post.author.slug.current}`,
      toc: []
    }
  ] as any

  let relatedPosts: any[] = []
  if (serie && relatosDeSerie.length > 0) {
    relatedPosts = relatosDeSerie
      .filter((r) => r.slug.current !== slug)
      .map((r) => ({
        title: r.title,
        path: `relato/${r.slug.current}`,
        slug: r.slug.current
      }))
  } else {
    relatedPosts = autorRelatos
      .filter((r) => r.slug.current !== slug)
      .map((r) => ({
        title: r.title,
        path: `relato/${r.slug.current}`,
        slug: r.slug.current
      }))
  }

  const mainContent = {
    title: post.title,
    date: post.date,
    tags: post.tags || [],
    draft: false,
    summary: post.summary || '',
    images: post.image ? [post.image] : [],
    image: post.image,
    authors: [post.author.name],
    slug: post.slug.current,
    path: `relato/${post.slug.current}`,
    series: serie?.title,
    seriesOrder: serie
      ? relatosDeSerie.findIndex((r) => r.slug.current === slug) + 1
      : undefined,
    body: {
      code: `
        function MDXContent() {
          return null;
        }
      `
    },
    toc: []
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.summary,
    image: post.image,
    url: siteMetadata.siteUrl + `/relato/${slug}`,
    author: authorDetails.map((a) => ({ '@type': 'Person', name: a.name }))
  }

  const Layout = layouts[defaultLayout]

  const formattedSeriesRelatos = (relatosDeSerie || []).map((r, index) => ({
    title: r.title,
    slug: r.slug.current,
    path: `relato/${r.slug.current}`,
    order: index + 1
  }))

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
      >
        <div className="prose dark:prose-invert max-w-none">
          <PortableText value={post.body} components={ptComponents} />
        </div>
        {serie && formattedSeriesRelatos.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Serie: {serie.title}</h2>
            {(seriesMetadata[serie.title]?.description || serie.description) && (
              <p className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400 mb-4">
                {seriesMetadata[serie.title]?.description || serie.description}
              </p>
            )}
            <div className="space-y-0">
              {formattedSeriesRelatos.map((relato, idx) => (
                <div key={relato.slug} className="relative pl-10">
                  <div
                    className="absolute left-4 top-0 bottom-0 w-0.5"
                    style={{
                      borderLeft: '2px dotted #bdbdbd',
                      height:
                        idx === formattedSeriesRelatos.length - 1
                          ? '1.25rem'
                          : '100%'
                    }}
                  />
                  <div
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-black ${
                      relato.slug === slug ? 'bg-[#faff00]' : 'bg-white'
                    }`}
                  />
                  <Link
                    href={`/relato/${relato.slug}`}
                    className="block hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-black dark:text-white">
                        {relato.order}. {relato.title}
                        {relato.slug === slug && (
                          <span className="ml-2 px-2 py-0.5 bg-black text-[#faff00] rounded text-sm">
                            (Leyendo)
                          </span>
                        )}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </Layout>
      <ClientFixedNavWrapper
        title={post.title}
        authorAvatar={post.author.avatar}
        authorName={post.author.name}
        slug={slug}
        relatedPosts={relatedPosts}
        author={post.author.slug.current}
        pathPrefix="relato"
        readingTime={post.readingTime}
        seriesName={serie?.title}
      />
    </>
  )
}
