'use client'

import CustomLink from './Link'

const NewLogo = () => {
  return (
    <CustomLink
      href="/"
      className="h-full flex items-stretch absolute left-0 top-0 z-10"
      aria-label="Volver a Marcapágina"
      style={{ margin: 0, padding: 0 }}
    >
      <div className="h-full w-[56px] bg-[#faff00] flex items-center justify-center pr-3">
        <span
          className="text-3xl font-extrabold text-black select-none font-mono"
          style={{ letterSpacing: '-5px' }}
        >
          :<span style={{ letterSpacing: '-10px' }}>{'//'}</span>
        </span>
      </div>
    </CustomLink>
  )
}

export default NewLogo
