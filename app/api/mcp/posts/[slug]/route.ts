import { NextRequest, NextResponse } from 'next/server';
import { getRelatoBySlug } from '@/lib/sanity';

// GET /api/mcp/posts/[slug] - Obtener contenido completo de un post
export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;
    
    if (!slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug requerido' 
        },
        { status: 400 }
      );
    }

    // Obtener relato completo
    const relato = await getRelatoBySlug(slug);

    if (!relato) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Post no encontrado' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: relato
    });

  } catch (error) {
    console.error('Error en API de post individual:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 