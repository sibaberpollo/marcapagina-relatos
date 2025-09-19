'use client'

import { useState } from 'react'
import ReactionBar from './ReactionBar'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'

type Props = {
  open: boolean
  onClose: () => void
  slug: string
  contentType?: string
}

export default function ReactionModal({ open, onClose, slug, contentType = 'relato' }: Props) {
  const { status } = useSession()
  const callbackUrl = typeof window !== 'undefined' ? window.location.href : undefined
  const [loginOpen] = useState(false)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-md space-y-4 rounded-lg bg-white p-6 dark:bg-gray-800">
        {status === 'unauthenticated' ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Reacciona y guarda tu biblioteca
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Para reaccionar y que podamos mostrarte luego tu biblioteca (lo leído y lo que te
              gustó), además de recomendaciones personalizadas, inicia sesión.
            </p>
            <button
              onClick={() => signIn('google', { callbackUrl })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-2 font-medium text-black hover:opacity-90"
            >
              Iniciar sesión con Google
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              ¿Qué te pareció?
            </h2>
            <ReactionBar slug={slug} contentType={contentType} />
          </>
        )}
        <button
          onClick={onClose}
          className="text-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 w-full rounded bg-gray-900 px-4 py-2 hover:bg-gray-800 dark:text-gray-900"
        >
          Cerrar
        </button>
      </div>
      {/* Sin LoginModal aquí: sólo se abre flujo de Google al hacer clic */}
    </div>
  )
}
