import { NextRequest, NextResponse } from 'next/server'
import { getAllAutores } from '@/lib/sanity'

export async function GET(request: NextRequest) {
  try {
    const authors = await getAllAutores()

    // Filter out authors without email
    const authorsWithEmail = authors.filter((author) => author.email)

    return NextResponse.json({
      authors: authorsWithEmail.map((author) => ({
        name: author.name,
        email: author.email,
        avatar: author.avatar,
        slug: author.slug.current,
      })),
    })
  } catch (error) {
    console.error('Error fetching authors:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
