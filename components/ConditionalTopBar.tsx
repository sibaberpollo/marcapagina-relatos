'use client'

import LanguageDropdown from './LanguageDropdown'
import SectionContainer from './SectionContainer'
import { usePathname } from 'next/navigation'

export default function ConditionalTopBar() {
  const pathname = usePathname()
  if (pathname.startsWith('/biblioteca-personal') || pathname.startsWith('/dashboard')) return null
  return (
    <SectionContainer>
      <div className="flex items-center justify-end mt-4">
        <LanguageDropdown isMobile />
      </div>
    </SectionContainer>
  )
}
