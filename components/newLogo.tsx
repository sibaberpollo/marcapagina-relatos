'use client'

import CustomLink from './Link'

type NewLogoProps = {
  square?: boolean
}

const NewLogo = ({ square = false }: NewLogoProps) => {
  return (
    <CustomLink
      href="/"
      className={`h-full flex absolute left-0 top-0 z-10 ${
        square ? 'items-center' : 'items-stretch'
      }`}
      aria-label="Volver a Marcapágina"
      style={{ margin: 0, padding: 0 }}
    >
      <div
        className={`${
          square ? 'h-[56px] w-[56px]' : 'h-full w-[56px]'
        } bg-[#faff00] flex items-center justify-center pr-3`}
      >
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
