import { NextRequest, NextResponse } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';

// Get the preferred locale
function getLocale(request: NextRequest): string {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = defaultLocale;
    return locale;
  }

  // Return the locale found in the pathname
  const locale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  return locale || defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle transtextos subdomain redirect
  if (request.headers.get('host') === 'transtextos.marcapagina.page') {
    return NextResponse.redirect(new URL('https://www.marcapagina.page/transtextos'));
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If pathname is missing locale and it's a known route that should have locale support
  if (pathnameIsMissingLocale && pathname.startsWith('/memes-merch-descargas')) {
    // Don't redirect, just continue - this handles the default Spanish version
    return NextResponse.next();
  }

  // For English routes, make sure they exist
  if (pathname.startsWith('/en/')) {
    return NextResponse.next();
  }

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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|static).*)',
  ],
}; 