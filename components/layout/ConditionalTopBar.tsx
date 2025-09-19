'use client'

import LanguageDropdown from '../common/LanguageDropdown'
import SectionContainer from './SectionContainer'
import { usePathname } from 'next/navigation'

export default function ConditionalTopBar() {
  const pathname = usePathname()
  if (pathname.startsWith('/biblioteca-personal') || pathname.startsWith('/dashboard')) return null
  return (
    <SectionContainer>
      <div className="mt-4 flex items-center justify-end">
        <LanguageDropdown isMobile />
      </div>
    </SectionContainer>
  )
}
