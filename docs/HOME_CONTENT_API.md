# Sistema de Gestión de Contenido del Home

## Descripción General

Este sistema permite gestionar el contenido del home de la aplicación mediante archivos JSON estáticos, sin necesidad de hacer rebuild cada vez que se actualiza el contenido. Además, está diseñado para ser multiidioma desde el inicio.

## Arquitectura

### 1. Archivos JSON de Contenido

Los archivos se ubican en `data/` y siguen la convención:
- `home-content.json` - Contenido base en español
- `home-content-en.json` - Contenido en inglés  
- `home-content-fr.json` - Contenido en francés
- etc.

### 2. API Interna

La ruta `/api/home-content` lee los archivos JSON y enriquece los datos consultando Sanity para obtener información adicional como:
- Título, descripción, imagen
- Información del autor (nombre, avatar, slug)
- Tags, color de fondo, fecha de publicación

### 3. Sistema de Overrides

Los campos definidos en el JSON **sobreescriben** los datos de Sanity. Esto permite:
- Personalizar títulos o descripciones sin modificar Sanity
- Cambiar colores o imágenes para ocasiones especiales
- Agregar tags específicos para el home

## Estructura del JSON

```json
{
  "meta": {
    "language": "es",
    "version": "1.0", 
    "lastUpdated": "2025-01-14"
  },
  "content": {
    "title": "Título principal del home",
    "description": "Descripción en markdown/html"
  },
  "relatos": [
    {
      "slug": "mi-relato",
      "type": "relato",
      // Campos opcionales que sobreescriben Sanity:
      "title": "Título personalizado",
      "description": "Descripción personalizada",
      "imgSrc": "URL de imagen personalizada",
      "authorName": "Nombre personalizado del autor",
      "authorImgSrc": "Avatar personalizado",
      "bgColor": "#ff6b6b",
      "tags": ["tag1", "tag2"],
      "publishedAt": "2025-01-14"
    }
  ]
}
```

## Uso de la API

### Desde el cliente
```javascript
// Obtener contenido en español (por defecto)
const response = await fetch('/api/home-content')

// Obtener contenido en inglés  
const response = await fetch('/api/home-content?lang=en')
```

### Desde el servidor (SSR)
```javascript
import { getHomeContent } from '@/lib/home-api'

const homeContent = await getHomeContent('es')
```

## Funcionamiento Multiidioma

1. **Idioma base**: Siempre es español (`home-content.json`)
2. **Idiomas adicionales**: Pueden tener menos contenido
3. **Fallback automático**: Si no existe el archivo del idioma solicitado, se usa el español
4. **Contenido parcial**: El archivo en inglés puede tener solo 3 relatos mientras el español tiene 6

## Ventajas

- ✅ **Sin rebuilds**: Cambios inmediatos al actualizar JSON
- ✅ **Multiidioma nativo**: Archivos separados por idioma
- ✅ **Flexibilidad total**: Override de cualquier campo de Sanity
- ✅ **Performance**: Caché de 5 minutos en la API
- ✅ **Contenido diferenciado**: Cada idioma puede mostrar contenido diferente
- ✅ **Mantenimiento sencillo**: Solo editar archivos JSON

## Ejemplos de Uso

### Campaña especial
```json
{
  "slug": "relato-navideño",
  "type": "relato",
  "bgColor": "#d42c2c",
  "tags": ["navidad", "especial"]
}
```

### Contenido en inglés (menor cantidad)
```json
{
  "meta": { "language": "en" },
  "relatos": [
    { "slug": "only-translated-story", "type": "relato" }
  ]
}
```

### Override completo
```json
{
  "slug": "mi-relato",
  "type": "relato", 
  "title": "Título completamente diferente",
  "description": "Nueva descripción",
  "authorName": "Seudónimo especial",
  "bgColor": "#purple"
}
```

## Migración

La implementación actual reemplaza:
- ❌ `getFeaturedAndNonFeaturedRelatos()` 
- ❌ `getAllMicrocuentos()` (removido del home)
- ✅ Nuevo sistema basado en JSON + API interna

El resto de la funcionalidad (Transtextos, navegación cronológica, etc.) permanece igual. 