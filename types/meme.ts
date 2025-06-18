export interface MemeItem {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  type: 'meme' | 'descarga' | 'download' | 'producto' | 'product'
}
