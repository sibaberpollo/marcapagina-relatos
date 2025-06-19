'use client'

import { usePathname } from 'next/navigation'
import Breadcrumbs from './Breadcrumbs'
import LanguageDropdown from './LanguageDropdown'
import SectionContainer from './SectionContainer'

export default function ConditionalTopBar() {
  const pathname = usePathname()
  if (pathname.startsWith('/relato/')) {
    return null
  }
  return (
    <SectionContainer>
      <div className="flex items-center justify-between mt-4">
        <Breadcrumbs />
        <LanguageDropdown isMobile />
      </div>
    </SectionContainer>
  )
}
