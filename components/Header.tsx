import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
//import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
  'flex items-center w-full bg-white dark:bg-gray-950 justify-between pt-4 sm:pt-10 sm:pb-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }


  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
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
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={
                  link.title === 'Publica con nosotros'
                    ? 'm-1 font-bold flex items-center gap-2 px-3 py-1 rounded-lg bg-black text-[#faff00] hover:bg-gray-800 transition-colors duration-200'
                    : 'm-1 font-medium text-[#3b2c14] hover:text-[#5b4a32] dark:text-[#f8f8f8] dark:hover:text-white flex items-center gap-2'
                }
              >
                {link.title}
                {link.title === 'Publica con nosotros' && (
                  <span className="inline-flex items-center justify-center rounded-full ml-2" style={{ background: '#faff00', width: 22, height: 22 }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" fill="#222"/>
                      <path d="M17.71 6.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#222"/>
                    </svg>
                  </span>
                )}
              </Link>
            ))}
        </div>
        {/*<SearchButton />*/}
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
