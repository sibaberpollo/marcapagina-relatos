import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import SectionContainer from '@/components/SectionContainer'
import AutoAvatar from '@/components/AutoAvatar'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github, website, instagram, sitios } = content

  // Determinar si el autor es de Marcapágina
  const isMarcapaginaAuthor = !sitios || sitios.length === 0 || sitios.includes('marcapagina')

  return (
    <SectionContainer>
      <div>
        <div className="space-y-2 pt-6 pb-2 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Autor/a
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar ? (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full"
              />
            ) : (
              <AutoAvatar
                name={name}
                size={192}
                className="h-48 w-48 rounded-full bg-black text-white font-titles text-5xl flex items-center justify-center"
              />
            )}
            <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">{name}</h3>
            {!isMarcapaginaAuthor && sitios && sitios.length > 0 && (
              <div className="text-gray-500 dark:text-gray-400">
                {sitios[0]}
              </div>
            )}
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
              {instagram && <SocialIcon kind="instagram" href={instagram} />}
              <SocialIcon kind="website" href={website} />
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-2 pb-2 xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
