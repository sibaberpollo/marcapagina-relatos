'use client'

import CustomLink from './Link'

type NewLogoProps = {
  square?: boolean
}

const NewLogo = ({ square = false }: NewLogoProps) => {
  return (
    <CustomLink
      href="/"
      className={`absolute left-0 top-0 bottom-0 flex ${
        square ? 'items-center' : 'items-stretch'
      } z-10`}
      aria-label="Volver a Marcapágina"
      style={{ margin: 0, padding: 0 }}
    >
      <div
        className={`${
          square ? 'h-full aspect-square' : 'h-full w-[56px]'
        } bg-[#faff00] flex items-center justify-center`}
      >
        <span
          className="text-3xl font-extrabold text-black select-none font-mono"
          style={{ letterSpacing: '-5px', marginLeft: '-10px' }}
        >
          :<span style={{ letterSpacing: '-10px' }}>{'//'}</span>
        </span>
      </div>
    </CustomLink>
  )
}

export default NewLogo
