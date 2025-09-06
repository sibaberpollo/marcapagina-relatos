import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'

export default function NotFound() {
  return (
    <SectionContainer>
      <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
        <div className="mb-8 flex justify-center md:mb-0">
          <Image
            src="https://res.cloudinary.com/dx98vnos1/image/upload/v1748174899/404_msck10.png"
            alt="Error 404"
            width={300}
            height={225}
            className="max-w-xs"
          />
        </div>
        <div className="max-w-md">
          <h1 className="mb-8 text-6xl leading-9 font-extrabold md:text-8xl md:leading-14 dark:text-gray-100">
            404
          </h1>
          <p className="mb-4 text-xl leading-normal font-bold md:text-2xl">
            Lo sentimos, no pudimos encontrar esta página.
          </p>
          <p className="mb-8">
            Pero no te preocupes, puedes encontrar muchas otras cosas en nuestra página principal.
          </p>
          <Link
            href="/"
            className="focus:shadow-outline bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 inline rounded-lg border border-transparent px-4 py-2 text-sm leading-5 font-medium text-black shadow transition-colors duration-150 focus:outline-hidden"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
