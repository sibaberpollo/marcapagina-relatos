import { NextRequest, NextResponse } from 'next/server'
import { searchRelatos } from '@/lib/sanity'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)

    // Parsear parámetros de la URL
    const params = {
      query: searchParams.get('query') || undefined,
      author: searchParams.get('author') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      site: searchParams.get('site') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      includeContent: searchParams.get('includeContent') === 'true',
    }

    // Ejecutar búsqueda
    const results = await searchRelatos(params)

    return NextResponse.json({
      success: true,
      data: results,
      query: params,
    })
  } catch (error) {
    console.error('Error en API de búsqueda:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    // Ejecutar búsqueda con parámetros del body
    const results = await searchRelatos(body)

    return NextResponse.json({
      success: true,
      data: results,
      query: body,
    })
  } catch (error) {
    console.error('Error en API de búsqueda:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
