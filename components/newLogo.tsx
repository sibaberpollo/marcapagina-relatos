'use client'

import CustomLink from './Link'

type NewLogoProps = {
  square?: boolean
}

const NewLogo = ({ square = false }: NewLogoProps) => {
  return (
    <CustomLink
      href="/"
      className={`absolute top-0 bottom-0 left-0 flex ${
        square ? 'items-center' : 'items-stretch'
      } z-10`}
      aria-label="Volver a Marcapágina"
      style={{ margin: 0, padding: 0 }}
    >
      <div
        className={`${
          square ? 'aspect-square h-full' : 'h-full w-[56px]'
        } flex items-center justify-center bg-[#faff00]`}
      >
        <span
          className="font-mono text-3xl font-extrabold text-black select-none"
          style={{ letterSpacing: '-5px', marginLeft: '-10px' }}
        >
          :<span style={{ letterSpacing: '-10px' }}>{'//'}</span>
        </span>
      </div>
    </CustomLink>
  )
}

export default NewLogo
