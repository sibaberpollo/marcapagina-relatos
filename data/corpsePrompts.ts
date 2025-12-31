export interface CorpsePrompt {
  id: string
  title: string
  description: string
  category: 'literary' | 'creative' | 'experimental'
}

export const CORPSE_PROMPTS: CorpsePrompt[] = [
  {
    id: 'memory-objects',
    title: 'Objetos de la memoria',
    description:
      'Escribe sobre un objeto que evoca un recuerdo olvidado. El siguiente autor debe continuar con un objeto relacionado pero de otro contexto.',
    category: 'literary',
  },
  {
    id: 'parallel-stories',
    title: 'Historias paralelas',
    description:
      'Dos historias que transcurren simultáneamente. Cada segmento debe alternar entre ambas narrativas.',
    category: 'creative',
  },
  {
    id: 'voice-changes',
    title: 'Cambios de voz',
    description:
      'La narración cambia de perspectiva en cada segmento: primera persona, segunda persona, tercera persona, etc.',
    category: 'experimental',
  },
  {
    id: 'time-fragments',
    title: 'Fragmentos temporales',
    description:
      'Cada segmento ocurre en un momento diferente del tiempo. Los autores deben conectar los fragmentos cronológicamente.',
    category: 'literary',
  },
  {
    id: 'character-dialogue',
    title: 'Diálogo interrumpido',
    description:
      'Una conversación entre personajes que se interrumpe y continúa con nuevos participantes.',
    category: 'creative',
  },
  {
    id: 'sensory-journey',
    title: 'Viaje sensorial',
    description:
      'Cada segmento se enfoca en un sentido diferente: vista, oído, tacto, gusto, olfato.',
    category: 'experimental',
  },
  {
    id: 'dream-reality',
    title: 'Sueño y realidad',
    description: 'Alterna entre escenas oníricas y momentos de la vida cotidiana.',
    category: 'literary',
  },
  {
    id: 'letter-exchange',
    title: 'Intercambio epistolar',
    description:
      'Una correspondencia entre personajes que nunca se han visto. Cada segmento es una carta diferente.',
    category: 'creative',
  },
  {
    id: 'urban-myth',
    title: 'Mito urbano',
    description:
      'Construye un mito urbano moderno. Cada segmento añade una capa de misterio o explicación.',
    category: 'experimental',
  },
  {
    id: 'memory-chain',
    title: 'Cadena de recuerdos',
    description:
      'Cada segmento evoca un recuerdo del anterior, creando una cadena de asociaciones.',
    category: 'literary',
  },
]
