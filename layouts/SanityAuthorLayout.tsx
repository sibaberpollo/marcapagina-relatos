import { ReactNode } from 'react'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Autor {
  name: string;
  avatar?: string;
  occupation?: string;
  company?: string;
  email?: string;
  twitter?: string;
  bluesky?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  bio?: string;
  slug: {
    current: string;
  };
  defaultTab?: string;
}

interface Props {
  children: ReactNode
  autor: Autor
}

export default function SanityAuthorLayout({ children, autor }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github, website } = autor

  return (
    <>
      <div>
        <div className="space-y-2 pt-6 pb-2 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Autor/a
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full object-cover"
              />
            )}
            <h3 className="pt-4 pb-2 text-2xl font-bold tracking-tight">{name}</h3>
            {occupation && <div className="text-gray-500 dark:text-gray-400">{occupation}</div>}
            {company && <div className="text-gray-500 dark:text-gray-400">{company}</div>}
            <div className="flex space-x-3 pt-6">
              {email && <SocialIcon kind="mail" href={`mailto:${email}`} />}
              {github && <SocialIcon kind="github" href={github} />}
              {linkedin && <SocialIcon kind="linkedin" href={linkedin} />}
              {twitter && <SocialIcon kind="x" href={twitter} />}
              {bluesky && <SocialIcon kind="bluesky" href={bluesky} />}
              {website && <SocialIcon kind="website" href={website} />}
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-2 pb-2 xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
} 