'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, ChevronDown, LogOut } from 'lucide-react'
import Avatar from 'react-avatar'

export default function UserMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  if (status === 'loading') {
    return (
      <div
        className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"
        aria-hidden
      />
    )
  }

  if (!session) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-accent)] bg-black px-3 py-2 text-[var(--color-accent)] transition hover:brightness-110"
          aria-label="Iniciar sesión"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Entrar</span>
        </button>

        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal
          >
            <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
              <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                <h3 className="text-lg font-semibold">Inicia sesión</h3>
              </div>
              <div className="space-y-3 p-4">
                <button
                  onClick={() => signIn('google')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-2 font-medium text-black hover:opacity-90"
                >
                  Continuar con Google
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  const userName = session.user?.name ?? session.user?.email ?? 'Usuario'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex items-center justify-center rounded-full ring-2 ring-[var(--color-accent)]">
          <Avatar
            name={userName}
            src={session.user?.image ?? undefined}
            size="28"
            round
            textSizeRatio={2}
            color={getAvatarBg(userName)}
          />
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-600 transition-transform dark:text-gray-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <div className="py-1">
            <Link
              href="/biblioteca-personal"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-900"
              onClick={() => setOpen(false)}
            >
              Biblioteca personal
            </Link>
            <button
              onClick={() => {
                setOpen(false)
                signOut()
              }}
              className="inline-flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function getAvatarBg(name: string): string {
  const palette = ['#FAFF00', '#FF8A00', '#FF2E63', '#08D9D6', '#7C4DFF', '#00E676']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const idx = Math.abs(hash) % palette.length
  return palette[idx]
}
