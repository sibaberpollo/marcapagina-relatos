import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Comprueba si la URL coincide con el patrón de URL antiguo: /[author]/relato/[slug]
  const oldRelatoUrlPattern = /^\/([^\/]+)\/relato\/([^\/]+)/;
  const relatoMatch = pathname.match(oldRelatoUrlPattern);

  if (relatoMatch) {
    // El primer grupo de captura es el autor, el segundo es el slug del relato
    const authorSlug = relatoMatch[1];
    const relatoSlug = relatoMatch[2];

    // Redirigir a la nueva URL: /relato/[slug]
    return NextResponse.redirect(new URL(`/relato/${relatoSlug}`, request.url), {
      // Código 308: Permanent Redirect (preserva el método HTTP)
      status: 308
    });
  }

  // Comprueba si la URL coincide con el patrón de URL antiguo: /[author]/articulo/[slug]
  const oldArticuloUrlPattern = /^\/([^\/]+)\/articulo\/([^\/]+)/;
  const articuloMatch = pathname.match(oldArticuloUrlPattern);

  if (articuloMatch) {
    // El primer grupo de captura es el autor, el segundo es el slug del artículo
    const authorSlug = articuloMatch[1];
    const articuloSlug = articuloMatch[2];

    // Redirigir a la nueva URL: /articulo/[slug]
    return NextResponse.redirect(new URL(`/articulo/${articuloSlug}`, request.url), {
      // Código 308: Permanent Redirect (preserva el método HTTP)
      status: 308
    });
  }

  return NextResponse.next();
}

export const config = {
  // Aplicar este middleware solo a URLs que coincidan con el patrón
  matcher: ['/:author/relato/:slug*', '/:author/articulo/:slug*']
}; 