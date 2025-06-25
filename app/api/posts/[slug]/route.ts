import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const searchParams = request.nextUrl.searchParams
    const lang = searchParams.get('lang') || 'es'
    
    const postsDirectory = path.join(process.cwd(), 'data', 'posts', lang)
    const filePath = path.join(postsDirectory, `${slug}.json`)
    
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      // Si no existe en el idioma solicitado, intentar con español como fallback
      if (lang !== 'es') {
        const fallbackPath = path.join(process.cwd(), 'data', 'posts', 'es', `${slug}.json`)
        if (fs.existsSync(fallbackPath)) {
          const fallbackData = fs.readFileSync(fallbackPath, 'utf8')
          const post = JSON.parse(fallbackData)
          return NextResponse.json(post)
        }
      }
      
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const post = JSON.parse(fileContents)
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error reading post:', error)
    return NextResponse.json(
      { error: 'Failed to load post' },
      { status: 500 }
    )
  }
} 