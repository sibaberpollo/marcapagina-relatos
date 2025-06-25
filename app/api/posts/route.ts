import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get('lang') || 'es'
    
    const postsDirectory = path.join(process.cwd(), 'data', 'posts', lang)
    
    // Verificar si el directorio existe
    if (!fs.existsSync(postsDirectory)) {
      // Si no existe el directorio del idioma, usar español como fallback
      const fallbackDirectory = path.join(process.cwd(), 'data', 'posts', 'es')
      if (fs.existsSync(fallbackDirectory)) {
        const fallbackFiles = fs.readdirSync(fallbackDirectory)
        const posts = fallbackFiles
          .filter(file => file.endsWith('.json'))
          .map(file => {
            const filePath = path.join(fallbackDirectory, file)
            const fileContents = fs.readFileSync(filePath, 'utf8')
            const post: Post = JSON.parse(fileContents)
            return {
              title: post.title,
              slug: post.slug,
              description: post.description,
              publishedAt: post.publishedAt,
              tags: post.tags,
              author: post.author,
              image: post.image,
              readingTime: post.readingTime,
              bgColor: post.bgColor
            }
          })
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        
        return NextResponse.json(posts)
      }
      
      return NextResponse.json([])
    }
    
    const files = fs.readdirSync(postsDirectory)
    const posts = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(postsDirectory, file)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const post: Post = JSON.parse(fileContents)
        return {
          title: post.title,
          slug: post.slug,
          description: post.description,
          publishedAt: post.publishedAt,
          tags: post.tags,
          author: post.author,
          image: post.image,
          readingTime: post.readingTime,
          bgColor: post.bgColor
        }
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error reading posts:', error)
    return NextResponse.json(
      { error: 'Failed to load posts' },
      { status: 500 }
    )
  }
} 