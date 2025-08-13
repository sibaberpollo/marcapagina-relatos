'use client'

import { signIn } from 'next-auth/react'

type LoginModalProps = {
  open: boolean
  onClose: () => void
  callbackUrl?: string
  title?: string
}

export default function LoginModal({ open, onClose, callbackUrl, title = 'Inicia sesión' }: LoginModalProps) {
  if (!open) return null
  const cb = typeof window !== 'undefined' ? callbackUrl ?? window.location.href : callbackUrl ?? '/'
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Inicia sesión para guardar tus lecturas, dar like a tus relatos favoritos y verlos en tu biblioteca.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: cb })}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium bg-[var(--color-accent)] text-black hover:opacity-90"
          >
            Continuar con Google
          </button>
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}


