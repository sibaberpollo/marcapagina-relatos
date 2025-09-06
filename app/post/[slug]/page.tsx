import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonPostLayout from '@/layouts/JsonPostLayout'
import siteMetadata from '@/data/siteMetadata'
import { headers } from 'next/headers'
import fs from 'fs'
import path from 'path'

interface Post {
  title: string
  slug: string
  description: string
  content: string
  publishedAt: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
  image: string
  readingTime: string
  bgColor?: string
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ lang?: string }>
}

async function getPost(slug: string, lang: string = 'es'): Promise<Post | null> {
  try {
    const postsDirectory = path.join(process.cwd(), 'data', 'posts', lang)
    const filePath = path.join(postsDirectory, `${slug}.json`)

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      // Si no existe en el idioma solicitado, intentar con español como fallback
      if (lang !== 'es') {
        const fallbackPath = path.join(process.cwd(), 'data', 'posts', 'es', `${slug}.json`)
        if (fs.existsSync(fallbackPath)) {
          const fallbackData = fs.readFileSync(fallbackPath, 'utf8')
          return JSON.parse(fallbackData)
        }
      }
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading post:', error)
    return null
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const headersList = await headers()
  const langFromHeader = headersList.get('x-locale')
  const lang = langFromHeader || resolvedSearchParams?.lang || 'es'

  const post = await getPost(slug, lang)

  if (!post) {
    return {
      title: 'Post no encontrado',
    }
  }

  return {
    title: `${post.title} - ${siteMetadata.title}`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      authors: [post.author.name],
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const headersList = await headers()
  const langFromHeader = headersList.get('x-locale')
  const lang = langFromHeader || resolvedSearchParams?.lang || 'es'

  const post = await getPost(slug, lang)

  if (!post) {
    notFound()
  }

  return (
    <JsonPostLayout
      content={{
        title: post.title,
        author: post.author.name,
        description: post.description,
        image: post.image,
        bgColor: post.bgColor || '#E5F3FF',
        tags: post.tags,
        publishedAt: post.publishedAt,
        slug: post.slug,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </JsonPostLayout>
  )
}
