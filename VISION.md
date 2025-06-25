# MarcaPágina 2.0: App de Entretenimiento Literario

## Manifiesto Editorial

**Lo que somos:** Una app para disfrutar literatura, no solo para leer cuentos.

**Lo que no somos:** Otra página web con relatos. Hay muchas en español. Son aburridas.

### El Problema
- Las plataformas literarias son demasiado solemnes
- El contenido de calidad es irregular (semanas sin material nuevo)
- No existe diferenciación real en el mercado español
- Los lectores buscan experiencias, no solo textos

### La Solución: Ecosistema de Contenido Híbrido

#### 1. **Transtextos como Núcleo Editorial**
- **Múculo editorial ganado:** reputación y calidad establecida
- **Relatos que aspiran a lo literario:** no journaling ni contenido amateur
- **Migración completa:** todos los relatos principales vendrán de este proyecto
- **Estándar de calidad:** filtro editorial riguroso

#### 2. **Contenido Complementario Estratégico**
- **Horóscopo Literario Quincenal:** diferenciador único, voz editorial distintiva
- **Memes con contexto:** relacionados con relatos o cultura literaria
- **Posts del equipo:** recomendaciones, recursos, productos editoriales

#### 3. **Experiencia de App vs Magazine**
- **Frecuencia irregular pero consistente:** calidad sobre cantidad
- **Engagement a través de diversidad:** múltiples razones para volver
- **Contenido shareable:** elementos que generan conversación

---

## Arquitectura Técnica

### Sistema Híbrido de Contenido

#### **Relatos (Transtextos)**
- **Fuente:** Sanity CMS
- **Layout:** Cards completas, máximo impacto visual
- **Frecuencia:** Irregular según disponibilidad editorial
- **Prioridad:** Máxima en el feed

#### **Posts (MarcaPágina)**
- **Fuente:** Sistema JSON multiidioma
- **Layout:** Diseño diferenciado pero complementario
- **Tipos:** Horóscopo, memes, productos, recursos
- **Frecuencia:** Regular para mantener actividad

#### **Horóscopo Literario**
- **Formato:** Componente especial en home
- **Frecuencia:** Quincenal
- **Tratamiento:** Widget premium, no mezclado
- **Valor:** Diferenciador único en el mercado

### Stack Tecnológico Actualizado

```
Frontend: Next.js 15 + TypeScript
CMS: Sanity (Transtextos) + JSON (Posts)
Styling: Tailwind CSS
Components: Lucide React + Custom
Deployment: Vercel
Analytics: Google Analytics + Custom events
```

### URLs y Estructura

```
/ - Home híbrido (relatos + posts + horóscopo)
/relato/[slug] - Relatos de Transtextos
/post/[slug] - Posts de MarcaPágina
/en - Versión inglés (SEO-friendly)
/transtextos - Feed específico Transtextos
/horoscopo - Archivo horóscopos literarios
```

---

## Roadmap de Implementación

### ✅ **Fase 1: Fundación (Completada)**
- [x] Sistema JSON para posts
- [x] Multiidioma (es/en)
- [x] URLs SEO-friendly
- [x] Build sin errores
- [x] Botones de compartir

### 🔄 **Fase 2: Experiencia Híbrida (En Curso)**
- [ ] Jerarquía visual clara relatos vs posts
- [ ] Componente horóscopo literario
- [ ] Sistema de etiquetado contextual
- [ ] Mejoras UX en el feed

### 📋 **Fase 3: Diferenciación**
- [ ] Horóscopo literario quincenal
- [ ] Memes con contexto literario
- [ ] Sistema de recomendaciones
- [ ] PWA optimizada

### 🚀 **Fase 4: Escalabilidad**
- [ ] Analytics de engagement
- [ ] A/B testing de contenido
- [ ] Sistema de subscripción/newsletter
- [ ] Monetización editorial

---

## Principios de Diseño

### **1. Jerarquía Clara**
- **Relatos:** Protagonistas visuales
- **Posts:** Complementarios, nunca competidores
- **Horóscopo:** Especial, diferenciado

### **2. Contexto Obligatorio**
- Todo contenido no-relato debe justificar su presencia
- No "imágenes tiradas sin propósito"
- Conexión clara con la experiencia literaria

### **3. Calidad sobre Frecuencia**
- Mejor 1 relato excelente que 5 mediocres
- El horóscopo debe mantener nivel de escritura alto
- Los memes deben tener relevancia cultural

### **4. App-First Mentality**
- Pensado para revisitas frecuentes
- Contenido shareable
- Experiencia móvil prioritaria
- PWA funcional

---

## Métricas de Éxito

### **Engagement**
- Tiempo en página > 3 minutos
- Revisitas semanales > 40%
- Compartidos por contenido

### **Editorial**
- Relatos completados > 60%
- Engagement horóscopo > posts normales
- Comentarios y feedback cualitativo

### **Técnico**
- Core Web Vitals > 90
- Tiempo de carga < 2s
- PWA score > 95

---

## Riesgos y Mitigaciones

### **Editorial**
- **Riesgo:** Dilución de calidad por contenido de relleno
- **Mitigación:** Ratio estricto 3:1 relatos:posts

### **Audiencia**
- **Riesgo:** Nicho muy específico
- **Mitigación:** Contenido shareable para amplificación orgánica

### **Operacional**
- **Riesgo:** Dependencia de un solo autor (horóscopo)
- **Mitigación:** Banco de contenido, colaboradores

---

*Última actualización: Enero 2025*
*Versión: 2.0 - Entretenimiento Literario* 