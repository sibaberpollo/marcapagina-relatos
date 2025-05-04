import Image from './Image'
import Link from './Link'

interface FeaturedCardProps {
  title: string
  description: string
  imgSrc: string
  href: string
  authorImgSrc: string
  authorName: string
  authorHref: string
}

const FeaturedCard = ({
  title,
  description,
  imgSrc,
  href,
  authorImgSrc,
  authorName,
  authorHref,
}: FeaturedCardProps) => (
  <div className="w-full mb-4">
    <div
      className="relative overflow-hidden rounded-lg border border-black border-4 bg-white dark:border-black dark:bg-gray-900 h-96"
    >
      <Link href={href} aria-label={`Link to ${title}`} className="block">
        <div className="absolute inset-0">
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center w-full h-full"
            width={1200}
            height={600}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
      </Link>
      
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <div className="flex items-center">
          <Link
            href={authorHref}
            className="mr-3"
          >
            <Image
              alt={authorName}
              src={authorImgSrc}
              className="rounded-full border-2 border-white dark:border-gray-900"
              width={60}
              height={60}
            />
          </Link>
          <div>
            <Link
              href={authorHref}
              className="inline-block text-sm font-medium bg-black text-gray-100 px-2 py-1 rounded hover:underline"
            >
              {authorName}
            </Link>
            <Link href={href} aria-label={`Link to ${title}`}>
              <h1 className="text-3xl font-bold text-white mb-1 hover:underline">
                {title}
              </h1>
            </Link>
          </div>
        </div>
        <p className="mt-4 text-base text-gray-50 line-clamp-2">
          {description}
        </p>
        <Link
          href={href}
          className="mt-4 inline-block text-base leading-6 font-medium text-white hover:text-gray-300"
          aria-label={`Link to ${title}`}
        >
          Leer más &rarr;
        </Link>
      </div>
    </div>
  </div>
)

export default FeaturedCard 