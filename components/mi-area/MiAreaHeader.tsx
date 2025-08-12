"use client"

import Image from 'next/image'
import Link from 'next/link'
import UserMenu from '@/components/UserMenu'

export default function MiAreaHeader() {
  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Inicio" className="flex items-center h-full">
            <Image
              src="/static/images/logo_amarillo.png"
              alt="Marcapágina"
              width={160}
              height={56}
              className="h-14 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}


