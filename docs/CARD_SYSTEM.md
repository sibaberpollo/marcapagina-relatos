# Sistema de Cards en MarcaPágina

## Introducción

MarcaPágina ahora soporta múltiples tipos de cards para mostrar contenido en la página principal. Esto permite experimentar con diferentes diseños visuales y encontrar el más adecuado para cada tipo de contenido.

## Tipos de Cards Disponibles

### 1. FeaturedCard (Tipo: `featured`)
- **Descripción**: El card original de MarcaPágina
- **Características**:
  - Imagen grande centrada
  - Título con versales
  - Información del autor en la parte inferior con overlay
  - Color de fondo de Sanity
  - Tags en la esquina superior izquierda
  - Badge de tipo en esquina superior derecha
  - Hover effects con scale
  - Altura aumentada (320px mínimo)
- **Uso recomendado**: Relatos destacados, contenido principal

### 2. FeaturedStoryCard (Tipo: `story`)
- **Descripción**: Card moderno tipo blog/revista
- **Características**:
  - Diseño más editorial y limpio
  - Badge de tipo en la esquina superior derecha
  - Imagen con overlay del color de Sanity
  - Metadata visible (fecha, autor)
  - Botón "Leer" explícito
  - Mejor para contenido textual
  - Altura aumentada (64px en desktop)
- **Uso recomendado**: Relatos que requieren más contexto, contenido nuevo

### 3. ImageOverlayCard (Tipo: `overlay`)
- **Descripción**: Card especializado para imágenes con texto descriptivo
- **Características**:
  - Imagen a pantalla completa
  - Overlay oscuro degradado en la parte inferior
  - Texto descriptivo centrado sobre el overlay
  - Badge "Meme" en esquina superior derecha
  - Hover effects con scale
  - Altura flexible que se adapta al grid
- **Uso recomendado**: Contenido visual con contexto, promociones, recomendaciones

### 4. QuoteCard (Tipo: `quote`)
- **Descripción**: Card especializado para citas y frases inspiradoras
- **Características**:
  - Fondo de color sólido personalizable
  - Comillas decorativas grandes
  - Texto centrado en blanco
  - Badge "Quote" en esquina superior derecha
  - Autor opcional al pie
  - Altura flexible que se adapta al grid
- **Uso recomendado**: Citas literarias, frases inspiradoras, consejos de escritura

### 5. SimpleMemeItem (Para memes)
- **Descripción**: Componente especializado para contenido visual simple
- **Características**:
  - Soporte para `image` e `image_portada`
  - Información contextual
  - Categorización
  - Enlaces directos
- **Uso automático**: Se usa automáticamente para items con `type: "meme"` sin `cardType`

## Configuración en JSON

### Estructura básica

```json
{
  "slug": "nombre-del-relato",
  "type": "relato",
  "cardType": "featured"  // ← Campo que controla el tipo de card
}
```

### Valores permitidos para `cardType`:
- `"featured"` - FeaturedCard (predeterminado)
- `"story"` - FeaturedStoryCard
- `"overlay"` - ImageOverlayCard (solo para memes)
- `"quote"` - QuoteCard (solo para quotes)

### Para el nuevo QuoteCard:

```json
{
  "type": "quote",
  "cardType": "quote",
  "quote": "Escribe borracho, edita sobrio",
  "author": "Ernest Hemingway",
  "bgColor": "#4ade80"
}
```

### Para el ImageOverlayCard:

```json
{
  "type": "meme",
  "cardType": "overlay",
  "image": "url-de-la-imagen",
  "href": "/enlace-destino",
  "tags": ["imagen", "vertical"],
  "overlayText": "Texto que aparece sobre el overlay oscuro"
}
```

### Ejemplo completo

```json
{
  "meta": {
    "language": "es",
    "version": "1.0",
    "lastUpdated": "2025-01-14"
  },
  "content": {
    "title": "Lee relatos breves y microcuentos",
    "description": "..."
  },
  "items": [
    {
      "slug": "relato-destacado",
      "type": "relato",
      "cardType": "featured"  // Card original con badge de tipo
    },
    {
      "type": "quote",
      "cardType": "quote",    // Nuevo: Card de cita
      "quote": "Escribe borracho, edita sobrio",
      "author": "Ernest Hemingway",
      "bgColor": "#4ade80"
    },
    {
      "type": "meme",
      "cardType": "overlay",  // Card con overlay y texto
      "image": "url-imagen",
      "overlayText": "Texto descriptivo sobre la imagen",
      "href": "/enlace",
      "tags": ["imagen"]
    },
    {
      "slug": "articulo-editorial",
      "type": "relato",
      "cardType": "story"     // Card moderno con badge de tipo
    }
  ]
}
```

## Características Técnicas

### Campos de override disponibles
Para relatos, puedes sobrescribir cualquier dato de Sanity:
- `title`
- `description`
- `imgSrc`
- `authorName`
- `authorImgSrc`
- `bgColor`
- `tags`
- `publishedAt`

### Campos específicos para QuoteCard:
- `quote` - Texto de la cita (obligatorio)
- `author` - Autor de la cita (opcional)
- `bgColor` - Color de fondo (opcional, por defecto verde #4ade80)
- `href` - Enlace de destino (opcional)

### Campos específicos para ImageOverlayCard:
- `overlayText` - Texto que aparece sobre el overlay (obligatorio)
- `image` - URL de la imagen (obligatorio)
- `href` - Enlace de destino (opcional)
- `tags` - Tags para mostrar en esquina superior izquierda
- `title` y `description` - Fallback si no hay overlayText

### Fallbacks y valores predeterminados
- Si no se especifica `cardType`, se usa `"featured"` para relatos
- Si no hay datos en JSON, se usan los de Sanity CMS
- Los memes sin `cardType` usan `SimpleMemeItem`
- Los memes con `cardType: "overlay"` usan `ImageOverlayCard`
- Los quotes siempre usan `QuoteCard`

### Responsive behavior
- **Móvil**: Layout masonry en 1 columna (respeta orden)
- **Tablet/Desktop**: Grid 2-3 columnas (mantiene orden visual)
- **CSS Grid automático**: Todas las cards se adaptan a la altura de la más alta en cada fila

### Badges de tipo consistentes
Todos los cards ahora incluyen badges de tipo:
- **Relatos**: "Relato" / "Short story" (BookOpen icon)
- **Microcuentos**: "Microcuento" / "Flash fiction" (BookOpen icon)
- **Series**: Nombre de la serie con número (BookOpen icon)
- **Memes con overlay**: "Meme" (Camera icon)
- **Quotes**: "Quote" (Quote icon)
- Los badges aparecen en la esquina superior derecha con estilo uniforme

## Ejemplos de uso

### Portada mixta con diferentes cards:
```json
"items": [
  {
    "slug": "relato-principal",
    "type": "relato",
    "cardType": "featured"    // Card original con badge
  },
  {
    "type": "quote",
    "cardType": "quote",      // Nuevo: cita inspiradora
    "quote": "Escribe borracho, edita sobrio",
    "author": "Ernest Hemingway",
    "bgColor": "#4ade80"
  },
  {
    "type": "meme",
    "cardType": "overlay",    // Imagen con overlay
    "image": "...",
    "overlayText": "Texto descriptivo contextual",
    "href": "/enlace"
  },
  {
    "slug": "articulo-editorial",
    "type": "relato",
    "cardType": "story"       // Card moderno con badge
  }
]
```

### Experimentación de diseño:
Puedes cambiar rápidamente el `cardType` de cualquier contenido para ver qué diseño funciona mejor sin tocar código.

## Mejoras implementadas

### Badges de tipo universales
- Todos los cards tienen badges consistentes en esquina superior derecha
- Iconos identificativos para cada tipo de contenido
- Estilo uniforme con fondo oscuro y backdrop-blur

### Alturas automáticas con CSS Grid
- Sistema `items-stretch` que adapta todas las cards a la altura de la más alta
- Sin alturas fijas, comportamiento completamente dinámico
- Funciona en cualquier resolución y combinación de contenido

### Soporte multiidioma
- Badges automáticos según idioma (es/en)
- Contenido de quotes traducido automáticamente

### Diversidad de contenido
- **Relatos**: Contenido principal literario
- **Memes**: Contenido visual de entretenimiento  
- **Quotes**: Citas inspiradoras y consejos
- **Overlays**: Promociones y recomendaciones contextuales

## Notas importantes

1. **El sistema es compatible hacia atrás**: Los JSON existentes sin `cardType` seguirán funcionando
2. **Fácil experimentación**: Cambiar `cardType` no requiere rebuild, solo refrescar
3. **Consistencia visual**: Todos los tipos de card respetan los colores y branding de MarcaPágina
4. **Flexibilidad futura**: Es fácil agregar nuevos tipos de card al sistema
5. **Badges universales**: Todos los cards tienen identificación de tipo consistente
6. **Altura automática**: CSS Grid maneja automáticamente la uniformidad de alturas

## Debugging

Si un contenido no se muestra:
1. Verificar que el `slug` existe en Sanity (para relatos)
2. Verificar que el `type` sea válido ("relato", "microcuento", "meme", "quote")
3. Verificar que el `cardType` sea válido ("featured", "story", "overlay", "quote")
4. Para QuoteCard, verificar que `quote` esté presente
5. Para ImageOverlayCard, verificar que `overlayText` e `image` estén presentes
6. Revisar logs en consola para errores de datos 