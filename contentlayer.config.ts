import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { writeFileSync } from 'fs'
import path from 'path'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import prettier from 'prettier'

// Remark plugins
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'

// Rehype plugins
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'

import siteMetadata from './data/siteMetadata'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

// Campos computados comunes
const computedFields: ComputedFields = {
  readingTime: {
    type: 'json',
    resolve: (doc) => readingTime(doc.body.raw),
  },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: {
    type: 'json',
    resolve: (doc) => extractTocHeadings(doc.body.raw),
  },
}

async function createTagCount(allBlogs: any[]) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag: string) => {
        const t = slug(tag)
        tagCount[t] = (tagCount[t] || 0) + 1
      })
    }
  })
  const formatted = await prettier.format(JSON.stringify(tagCount, null, 2), { parser: 'json' })
  writeFileSync('./app/tag-data.json', formatted)
}

function createSearchIndex(allBlogs: any[]) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    const searchData = allCoreContent(sortPosts(allBlogs)).map((doc) => ({
      ...doc,
      path: `${doc.author[0]}/relato/${doc.slug}`,
    }));
    writeFileSync(
      `public/${path.basename(siteMetadata.search.kbarConfig.searchDocumentsPath)}`,
      JSON.stringify(searchData)
    );
    console.log('Local search index generated...');
  }
}

// Blog posts en data/blog/**/*.mdx
export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date', required: false },
    draft: { type: 'boolean', required: false },
    summary: { type: 'string', required: false },
    images: { type: 'json', required: false },
    authors: { type: 'list', of: { type: 'string' }, required: false },
    layout: { type: 'string', required: false },
    bibliography: { type: 'string', required: false },
    canonicalUrl: { type: 'string', required: false },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image:
          Array.isArray(doc.images) && doc.images.length > 0
            ? doc.images[0]
            : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

// Relatos en data/relatos/**/*.mdx
export const Relato = defineDocumentType(() => ({
  name: 'Relato',
  filePathPattern: 'relatos/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    summary: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    author: { type: 'list', of: { type: 'string' }, required: true },
    image: { type: 'string', required: false },
    images: { type: 'list', of: { type: 'string' }, required: false },
    layout: { type: 'string', required: false },
    series: { type: 'string', required: false },
    seriesOrder: { type: 'number', required: false },
  },
  computedFields: {
    // inherit common computed fields, then override path for relato routes
    ...computedFields,
    // override default 'path' to include the correct base route for Relato
    path: {
      type: 'string',
      resolve: (doc) => {
        const author = doc.author[0]
        return `${author}/relato/${doc.slug}`
      },
    },
    flattenedSlug: {
      type: 'string',
      resolve: (doc) => doc.slug,
    },
  },
}))

// Artículos en data/articulos/**/*.mdx
export const Articulo = defineDocumentType(() => ({
  name: 'Articulo',
  filePathPattern: 'articulos/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    summary: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    author: { type: 'list', of: { type: 'string' }, required: true },
    image: { type: 'string', required: false },
    images: { type: 'list', of: { type: 'string' }, required: false },
    layout: { type: 'string', required: false },
    series: { type: 'string', required: false },
    seriesOrder: { type: 'number', required: false },
  },
  computedFields: {
    // inherit common computed fields, then override path for article routes
    ...computedFields,
    // override default 'path' to include the correct base route for Articulo
    path: {
      type: 'string',
      resolve: (doc) => {
        const author = doc.author[0]
        return `${author}/articulo/${doc.slug}`
      },
    },
    flattenedSlug: {
      type: 'string',
      resolve: (doc) => doc.slug,
    },
  },
}))

// Autores en data/authors/**/*.mdx
export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string', required: false },
    occupation: { type: 'string', required: false },
    company: { type: 'string', required: false },
    email: { type: 'string', required: false },
    twitter: { type: 'string', required: false },
    bluesky: { type: 'string', required: false },
    linkedin: { type: 'string', required: false },
    github: { type: 'string', required: false },
    website: { type: 'string', required: false },
    instagram: { type: 'string', required: false },
    sitios: { type: 'list', of: { type: 'string' }, required: false },
    layout: { type: 'string', required: false },
    defaultTab: { type: 'string', required: false, default: 'relatos' },
  },
  computedFields,
}))

// External articles en external-articles.json
// COMENTADO: Se lee manualmente en app/autor/[slug]/page.tsx
// export const ExternalArticle = defineDocumentType(() => ({
//   name: 'ExternalArticle',
//   filePathPattern: 'external-articles.json',
//   contentType: 'data',
//   fields: {
//     id: { type: 'string', required: true },
//     title: { type: 'string', required: true },
//     url: { type: 'string', required: true },
//     image: { type: 'string', required: false },
//     summary: { type: 'string', required: true },
//     category: { type: 'string', required: true },
//     date: { type: 'string', required: true },
//     source: { type: 'string', required: true }
//   }
// }))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Relato, Articulo, Authors],
  mdx: {
    cwd: root,
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: { className: ['content-header'] },
        },
      ],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [
        rehypeCitation,
        {
          path: path.join(root, 'data'),
        },
      ],
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    // Generate search index for Relato documents instead of blog posts
    const { allRelatos } = await importData()
    // Usar allArticulos cuando esté disponible
    // const { allRelatos, allArticulos } = await importData()
    // const allContent = [...allRelatos, ...allArticulos]
    const allContent = [...allRelatos]
    createSearchIndex(allContent)
  },
})
