import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Llamar al endpoint original
    const response = await fetch('http://localhost:3000/api/update-external-articles');
    const data = await response.json();
    
    // Devolver la misma respuesta
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error llamando al endpoint original:', error);
    
    // Si hay un error, devolver una respuesta de error
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al actualizar artículos',
        error: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 