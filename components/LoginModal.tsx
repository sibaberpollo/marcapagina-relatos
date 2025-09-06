'use client'

import { signIn } from 'next-auth/react'

type LoginModalProps = {
  open: boolean
  onClose: () => void
  callbackUrl?: string
  title?: string
}

export default function LoginModal({
  open,
  onClose,
  callbackUrl,
  title = 'Inicia sesión',
}: LoginModalProps) {
  if (!open) return null
  const cb =
    typeof window !== 'undefined' ? (callbackUrl ?? window.location.href) : (callbackUrl ?? '/')
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal
    >
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Inicia sesión para guardar tus lecturas, dar like a tus relatos favoritos y verlos en tu
            biblioteca.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: cb })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-2 font-medium text-black hover:opacity-90"
          >
            Continuar con Google
          </button>
          <button
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
