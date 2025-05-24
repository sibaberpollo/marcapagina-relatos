import Image from './Image'
import Link from './Link'

interface FeaturedCardProps {
  title: string
  description: string
  imgSrc?: string
  href: string
  authorImgSrc: string
  authorName: string
  authorHref: string
  date?: string
  wide?: boolean
  className?: string
  index?: number
}

const CARD_CONFIG = {
  0: {
    image: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1748046084/brain_demo_lhkgye.png',
    bgColor: '#efa106'
  },
  1: {
    image: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1748047707/escorpion_btlhku.png',
    bgColor: '#ead00f'
  },
  2: {
    image: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1748048265/escribir_ar07tf.png',
    bgColor: '#dccd9f'
  }
}

const FeaturedCard = ({
  title,
  description,
  imgSrc,
  href,
  authorImgSrc,
  authorName,
  authorHref,
  date,
  wide = false,
  className = '',
  index = 0
}: FeaturedCardProps) => {
  const config = CARD_CONFIG[index] || CARD_CONFIG[0]
  
  if (index === 2) {
    return (
      <div
        className={`relative flex flex-col rounded-lg overflow-hidden w-full h-full ${className}`}
        style={{ backgroundColor: config.bgColor }}
      >
        <div className="flex-1 flex items-center justify-center">
          <Image
            alt={title}
            src={config.image}
            className="w-full h-full object-contain"
            width={500}
            height={500}
          />
        </div>
      </div>
    )
  }
  
  return (
    <div
      className={`relative flex flex-col rounded-lg overflow-hidden w-full h-full ${className}`}
      style={{ backgroundColor: config.bgColor }}
    >
      <div className="flex-1 flex items-center justify-center">
        <Image
          alt={title}
          src={config.image}
          className="w-[300px] h-[300px] object-contain"
          width={300}
          height={300}
        />
      </div>
      <div className="flex flex-col">
        <div className="px-6 mb-4">
          <Link href={href} aria-label={`Link to ${title}`} className="block w-full text-left">
            <h1 className="text-2xl font-bold text-black mb-2 leading-tight">{title}</h1>
          </Link>
          <p className="text-base text-black/90 line-clamp-2 text-left">{description}</p>
        </div>
        <div 
          className="w-full px-6 py-4 relative"
          style={{ backgroundColor: config.bgColor }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center gap-3">
            <Image
              src={authorImgSrc}
              alt={authorName}
              width={32}
              height={32}
              className="rounded-full contrast-150 grayscale brightness-110"
            />
            <div>
              <Link href={authorHref} className="text-white font-medium text-left hover:underline">
                {authorName}
              </Link>
              {date && (
                <span className="text-white/80 text-xs mt-1 text-left block">{date}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedCard 