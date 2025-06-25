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
  - Hover effects con scale
- **Uso recomendado**: Relatos destacados, contenido principal

### 2. FeaturedStoryCard (Tipo: `story`)
- **Descripción**: Card moderno tipo blog/revista
- **Características**:
  - Diseño más editorial y limpio
  - Badge "Relato" en la esquina
  - Imagen con overlay del color de Sanity
  - Metadata visible (fecha, autor)
  - Botón "Leer" explícito
  - Mejor para contenido textual
- **Uso recomendado**: Relatos que requieren más contexto, contenido nuevo

### 3. SimpleMemeItem (Para memes)
- **Descripción**: Componente especializado para contenido visual
- **Características**:
  - Soporte para `image` e `image_portada`
  - Información contextual
  - Categorización
  - Enlaces directos
- **Uso automático**: Se usa automáticamente para items con `type: "meme"`

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
      "cardType": "featured"  // Usará FeaturedCard
    },
    {
      "slug": "relato-moderno",
      "type": "relato",
      "cardType": "story"     // Usará FeaturedStoryCard
    },
    {
      "type": "meme",
      "title": "Contenido visual",
      "image": "url-imagen",
      "tags": ["meme", "diversión"]
      // Los memes usan automáticamente SimpleMemeItem
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

### Fallbacks y valores predeterminados
- Si no se especifica `cardType`, se usa `"featured"`
- Si no hay datos en JSON, se usan los de Sanity CMS
- Los memes siempre usan `SimpleMemeItem`

### Responsive behavior
- **Móvil**: Layout masonry en 1 columna (respeta orden)
- **Tablet/Desktop**: Grid 2-3 columnas (mantiene orden visual)

## Ejemplos de uso

### Portada mixta con diferentes cards:
```json
"items": [
  {
    "slug": "relato-principal",
    "type": "relato",
    "cardType": "featured"    // Card original, visual llamativo
  },
  {
    "slug": "articulo-editorial",
    "type": "relato",
    "cardType": "story"       // Card moderno, más información
  },
  {
    "type": "meme",
    "title": "Contenido divertido",
    "image": "...",
    "tags": ["humor"]
  }
]
```

### Experimentación de diseño:
Puedes cambiar rápidamente el `cardType` de cualquier relato para ver qué diseño funciona mejor sin tocar código.

## Notas importantes

1. **El sistema es compatible hacia atrás**: Los JSON existentes sin `cardType` seguirán funcionando
2. **Fácil experimentación**: Cambiar `cardType` no requiere rebuild, solo refrescar
3. **Consistencia visual**: Ambos tipos de card respetan los colores y branding de MarcaPágina
4. **Flexibilidad futura**: Es fácil agregar nuevos tipos de card al sistema

## Debugging

Si un relato no se muestra:
1. Verificar que el `slug` existe en Sanity
2. Verificar que el `type` sea "relato" o "microcuento"
3. Verificar que el `cardType` sea válido ("featured" o "story")
4. Revisar logs en consola para errores de datos 