import { Metadata } from 'next'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import siteMetadata from '@/data/siteMetadata'
import { headers } from 'next/headers'
import fs from 'fs'
import path from 'path'

interface Post {
  title: string
  slug: string
  description: string
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

export const metadata: Metadata = {
  title: `Posts - ${siteMetadata.title}`,
  description: 'Todos nuestros posts y artículos',
}

async function getAllPosts(lang: string = 'es'): Promise<Post[]> {
  try {
    const postsDirectory = path.join(process.cwd(), 'data', 'posts', lang)

    if (!fs.existsSync(postsDirectory)) {
      // Si no existe el directorio del idioma, usar español como fallback
      const fallbackDirectory = path.join(process.cwd(), 'data', 'posts', 'es')
      if (fs.existsSync(fallbackDirectory)) {
        const fallbackFiles = fs.readdirSync(fallbackDirectory)
        return fallbackFiles
          .filter((file) => file.endsWith('.json'))
          .map((file) => {
            const filePath = path.join(fallbackDirectory, file)
            const fileContents = fs.readFileSync(filePath, 'utf8')
            return JSON.parse(fileContents)
          })
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      }
      return []
    }

    const files = fs.readdirSync(postsDirectory)
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const filePath = path.join(postsDirectory, file)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(fileContents)
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

export default async function PostsPage() {
  const headersList = await headers()
  const langFromHeader = headersList.get('x-locale')
  const lang = langFromHeader || 'es'
  const posts = await getAllPosts(lang)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <PageSEO
        title={`Posts - ${siteMetadata.title}`}
        description="Todos nuestros posts y artículos"
      />
      <SectionContainer>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <PageTitle>Posts</PageTitle>
            <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
              Todos nuestros posts y artículos
            </p>
          </div>

          <div className="grid gap-8 pt-8">
            {posts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No hay posts disponibles.</p>
            ) : (
              posts.map((post) => (
                <article key={post.slug} className="group">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Link href={`/post/${post.slug}`} className="block">
                        <h2 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-2xl leading-8 font-bold tracking-tight text-gray-900 transition-colors dark:text-gray-100">
                          {post.title}
                        </h2>
                      </Link>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                      <p>{post.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.author.name}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {post.readingTime}
                      </span>
                    </div>
                  </div>

                  {post.image && (
                    <div className="mt-4">
                      <Link href={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-48 w-full rounded-lg object-cover transition-opacity group-hover:opacity-75"
                        />
                      </Link>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
