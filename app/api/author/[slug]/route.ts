import { NextRequest, NextResponse } from 'next/server'
import { getAutorBySlug } from '../../../../lib/sanity'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const author = await getAutorBySlug(slug)
    
    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 })
    }
    
    return NextResponse.json({ name: author.name })
  } catch (error) {
    console.error('Error fetching author:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 