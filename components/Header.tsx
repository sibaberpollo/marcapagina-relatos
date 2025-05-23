import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import CustomLink from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import PublishLink from './PublishLink'
//import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
  'flex items-center w-full bg-white dark:bg-gray-950 justify-between pt-4 sm:pt-10 sm:pb-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }


  return (
    <header className={headerClass}>
      <CustomLink href="/" aria-label={siteMetadata.headerTitle} className="no-underline !no-underline !border-0">
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo className="fill-gray-900 dark:fill-white h-auto w-[150px]" />
          </div>
          {/*{typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}*/}
        </div>
      </CustomLink>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="hidden items-center gap-x-6 sm:flex max-w-full lg:max-w-[calc(100vw-300px)] overflow-x-auto">

            {/* Enlace destacado de publicación en desktop */}
            <PublishLink variant="desktop" />
            {headerNavLinks
              .filter((link) => link.href !== '/' && link.href !== '/publica')
              .map((link) => (
                <CustomLink
                  key={link.title}
                  href={link.href}
                  className="m-1 font-medium text-black hover:text-gray-700 dark:text-[#f8f8f8] dark:hover:text-white"
                >
                  {link.title}
                </CustomLink>
              ))}
          </div>
        {/* Enlace destacado de publicación en móvil fuera del menú */}
        <PublishLink variant="mobile" />
        {/* ThemeSwitch en desktop */}
          <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
