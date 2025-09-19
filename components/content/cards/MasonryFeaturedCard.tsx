import FeaturedCard from './FeaturedCard'

interface MasonryFeaturedCardProps {
  title: string
  description: string
  imgSrc: string
  href: string
  authorImgSrc: string
  authorName: string
  authorHref: string
  bgColor: string
  tags: string[]
  publishedAt: string
  transtextos?: boolean
}

export default function MasonryFeaturedCard(props: MasonryFeaturedCardProps) {
  return (
    <div className="mb-4 break-inside-avoid">
      <FeaturedCard {...props} />
    </div>
  )
}
