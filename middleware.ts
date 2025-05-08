import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Comprueba si la URL coincide con el patrón de URL antiguo: /[author]/relato/[slug]
  const oldUrlPattern = /^\/([^\/]+)\/relato\/([^\/]+)/;
  const match = pathname.match(oldUrlPattern);

  if (match) {
    // El primer grupo de captura es el autor, el segundo es el slug del relato
    const authorSlug = match[1];
    const relatoSlug = match[2];

    // Redirigir a la nueva URL: /relato/[slug]
    return NextResponse.redirect(new URL(`/relato/${relatoSlug}`, request.url), {
      // Código 308: Permanent Redirect (preserva el método HTTP)
      status: 308
    });
  }

  return NextResponse.next();
}

export const config = {
  // Aplicar este middleware solo a URLs que coincidan con el patrón
  matcher: '/:author/relato/:slug*'
}; 