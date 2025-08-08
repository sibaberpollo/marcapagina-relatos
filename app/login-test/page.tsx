'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function LoginTest() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Cargando…</p>
  if (!session)
    return (
      <button
        className="rounded bg-[--color-primary-500] px-4 py-2 font-medium text-black"
        onClick={() => signIn('google')}
      >
        Entrar con Google
      </button>
    )

  return (
    <div className="space-y-3">
      <p>Hola {session.user?.email}</p>
      <button
        className="rounded bg-[--color-primary-500] px-4 py-2 font-medium text-black"
        onClick={() => signOut()}
      >
        Salir
      </button>
    </div>
  )
}

