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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle transtextos subdomain redirect
  if (request.headers.get('host') === 'transtextos.marcapagina.page') {
    return NextResponse.redirect(new URL('https://www.marcapagina.page/transtextos'));
  }

  // Handle multilingual routes dynamically
  const supportedLocales = ['en']; // Add more locales here (es is default)
  const multilingualPages = ['memes-merch-descargas', 'contacto', 'acerca-de', 'posts', 'playlist'];
  const multilingualPagesWithDynamicRoutes = ['post']; // For /post/[slug] type routes

  // Check for multilingual routes
  for (const locale of supportedLocales) {
    for (const page of multilingualPages) {
      if (pathname.startsWith(`/${locale}/${page}`)) {
        const response = NextResponse.rewrite(new URL(`/${page}`, request.url))
        response.headers.set('x-pathname', pathname)
        response.headers.set('x-locale', locale)
        return response
      }
    }
    
    // Check for dynamic routes like /en/post/[slug]
    for (const page of multilingualPagesWithDynamicRoutes) {
      if (pathname.startsWith(`/${locale}/${page}/`)) {
        // Extract the dynamic part (slug)
        const dynamicPart = pathname.replace(`/${locale}/${page}/`, '')
        const response = NextResponse.rewrite(new URL(`/${page}/${dynamicPart}?lang=${locale}`, request.url))
        response.headers.set('x-pathname', pathname)
        response.headers.set('x-locale', locale)
        return response
      }
    }
    
    // Special handling for home page in different languages
    if (pathname === `/${locale}`) {
      const response = NextResponse.rewrite(new URL('/', request.url))
      response.headers.set('x-pathname', pathname)
      response.headers.set('x-locale', locale)
      return response
    }
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

  // Nota: La protección de /mi-area se hace en el propio servidor de la página con getServerSession.

  // For other routes, just pass the pathname in headers
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response;
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