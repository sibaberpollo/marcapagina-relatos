'use client'

import LanguageDropdown from './LanguageDropdown'
import SectionContainer from './SectionContainer'

export default function ConditionalTopBar() {
  return (
    <SectionContainer>
      <div className="flex items-center justify-end mt-4">
        <LanguageDropdown isMobile />
      </div>
    </SectionContainer>
  )
}
