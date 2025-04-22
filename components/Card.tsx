import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
  authorImgSrc?: string
}

const Card = ({ title, description, imgSrc, href, authorImgSrc }: CardProps) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      } overflow-hidden rounded-md border-2 border-gray-200/60 dark:border-gray-700/60 relative bg-white dark:bg-gray-900`}
    >
      {imgSrc &&
        (href ? (
          <div className="relative">
            <Link href={href} aria-label={`Link to ${title}`}>
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center md:h-36 lg:h-48"
                width={544}
                height={306}
              />
            </Link>
            {authorImgSrc && (
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-10">
                <Image
                  alt="Autor"
                  src={authorImgSrc}
                  className="rounded-full border-4 border-white dark:border-gray-900"
                  width={80}
                  height={80}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
            {authorImgSrc && (
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-10">
                <Image
                  alt="Autor"
                  src={authorImgSrc}
                  className="rounded-full border-4 border-white dark:border-gray-900"
                  width={80}
                  height={80}
                />
              </div>
            )}
          </div>
        ))}
      
      <div className={`p-6 ${authorImgSrc ? 'pt-10' : ''}`}>
        <h2 className={`mb-3 text-2xl leading-8 font-bold tracking-tight ${authorImgSrc ? 'mt-10' : ''}`}>
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        {href && (
          <Link
            href={href}
            className="text-[#3b2c14] dark:text-[#f8f8f8] hover:text-[#5b4a32] dark:hover:text-white text-base leading-6 font-medium"
            aria-label={`Link to ${title}`}
          >
            Leer más &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
