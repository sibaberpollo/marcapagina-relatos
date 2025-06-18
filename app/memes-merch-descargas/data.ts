export interface MemeItem {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  type: 'meme' | 'descarga' | 'producto'
}

export const memeItems: MemeItem[] = [
  {
    id: 1,
    title: 'Cara de sorpresa',
    description: 'Un meme clásico para reaccionar a lo inesperado.',
    image: 'https://picsum.photos/400/300?random=1',
    tags: ['meme', 'diversión'],
    type: 'meme',
  },
  {
    id: 2,
    title: 'Plantilla descargable',
    description: 'Descarga esta plantilla para crear tu propio meme.',
    image: 'https://picsum.photos/300/500?random=2',
    tags: ['descarga'],
    type: 'descarga',
  },
  {
    id: 3,
    title: 'Taza conmemorativa',
    description: 'Producto oficial de MarcaPágina para amantes de los memes.',
    image: 'https://picsum.photos/450/350?random=3',
    tags: ['producto'],
    type: 'producto',
  },
  {
    id: 4,
    title: 'Meme épico',
    description: 'Ideal para compartir en redes y alegrar el día.',
    image: 'https://picsum.photos/300/300?random=4',
    tags: ['meme'],
    type: 'meme',
  },
  {
    id: 5,
    title: 'Sticker descargable',
    description: 'Agrégalo a tus chats favoritos.',
    image: 'https://picsum.photos/380/420?random=5',
    tags: ['descarga', 'meme'],
    type: 'descarga',
  },
  {
    id: 6,
    title: 'Playera edición limitada',
    description: 'Luce este diseño inspirado en nuestros mejores memes.',
    image: 'https://picsum.photos/500/300?random=6',
    tags: ['producto'],
    type: 'producto',
  },
]
