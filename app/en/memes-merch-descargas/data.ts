export interface MemeItem {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  type: 'meme' | 'download' | 'product'
}

export const memeItems: MemeItem[] = [
  {
    id: 1,
    title: 'Surprised face',
    description: 'A classic meme to react to the unexpected.',
    image: 'https://picsum.photos/400/300?random=1',
    tags: ['meme', 'fun'],
    type: 'meme',
  },
  {
    id: 2,
    title: 'Downloadable template',
    description: 'Download this template to create your own meme.',
    image: 'https://picsum.photos/300/500?random=2',
    tags: ['download'],
    type: 'download',
  },
  {
    id: 3,
    title: 'Commemorative mug',
    description: 'Official MarcaPágina merch for meme lovers.',
    image: 'https://picsum.photos/450/350?random=3',
    tags: ['product'],
    type: 'product',
  },
  {
    id: 4,
    title: 'Epic meme',
    description: 'Perfect to share on social media and brighten the day.',
    image: 'https://picsum.photos/300/300?random=4',
    tags: ['meme'],
    type: 'meme',
  },
  {
    id: 5,
    title: 'Downloadable sticker',
    description: 'Add it to your favorite chats.',
    image: 'https://picsum.photos/380/420?random=5',
    tags: ['download', 'meme'],
    type: 'download',
  },
  {
    id: 6,
    title: 'Limited edition T-shirt',
    description: 'Wear this design inspired by our best memes.',
    image: 'https://picsum.photos/500/300?random=6',
    tags: ['product'],
    type: 'product',
  },
]
