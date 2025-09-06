import { NextRequest, NextResponse } from 'next/server'
import { getAllRelatosForMCP } from '@/lib/sanity'

// GET /api/mcp/posts - Obtener todos los posts para MCP
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Ejecutar export completo
    const result = await getAllRelatosForMCP()

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error en API de posts:', error)
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
