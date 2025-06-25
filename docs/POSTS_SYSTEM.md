# Sistema de Posts

Este sistema permite crear y gestionar posts/artículos usando archivos JSON, independiente de Sanity CMS. Es ideal para contenido que necesita ser traducido fácilmente con IA.

## Estructura de archivos

```
data/
  posts/
    es/
      [slug].json
    en/
      [slug].json
```

## Estructura del JSON

Cada post debe tener esta estructura:

```json
{
  "title": "Título del post",
  "slug": "titulo-del-post",
  "description": "Descripción corta para SEO y listados",
  "content": "Contenido HTML del post",
  "publishedAt": "2024-01-24",
  "tags": ["tag1", "tag2"],
  "author": {
    "name": "Nombre del autor",
    "avatar": "/static/images/avatar.png"
  },
  "image": "https://example.com/imagen.jpg",
  "readingTime": "5 min",
  "bgColor": "#E5F3FF"
}
```

### Campos explicados

- **title**: Título del post
- **slug**: URL amigable (debe ser única)
- **description**: Descripción para SEO y vista previa
- **content**: Contenido HTML del post (puede incluir imágenes, enlaces, etc.)
- **publishedAt**: Fecha de publicación (formato YYYY-MM-DD)
- **tags**: Array de etiquetas
- **author**: Información del autor
- **image**: Imagen principal del post
- **readingTime**: Tiempo estimado de lectura
- **bgColor**: Color de fondo opcional para la letra capital

## URLs disponibles

- `/posts` - Lista todos los posts
- `/post/[slug]` - Post individual
- Soporte multiidioma con `?lang=en`

## APIs

- `GET /api/posts` - Lista todos los posts
- `GET /api/posts/[slug]` - Post individual
- Ambas soportan `?lang=en` para multiidioma

## Características

- **Multiidioma**: Automáticamente usa español como fallback si no existe traducción
- **Sin rebuild**: Añadir posts no requiere recompilar la aplicación
- **SEO optimizado**: Metadata automática para cada post
- **Escalable**: Fácil de mantener y expandir
- **IA-friendly**: Estructura simple para traducción automática

## Layout

Los posts usan `AlternativeLayout`, el mismo que microcuentos pero sin cursiva en el texto. Incluye:

- Letra capital estilizada
- Información del autor
- Tags
- Fecha de publicación
- Imagen destacada

## Cómo añadir un nuevo post

1. Crear archivo JSON en `data/posts/es/nuevo-post.json`
2. Opcionalmente crear traducción en `data/posts/en/nuevo-post.json`
3. El post estará disponible inmediatamente en `/post/nuevo-post`

No es necesario reiniciar la aplicación. 