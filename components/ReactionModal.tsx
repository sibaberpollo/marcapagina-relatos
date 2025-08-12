'use client'

import ReactionBar from './ReactionBar'

type Props = {
  open: boolean
  onClose: () => void
  slug: string
  contentType?: string
}

export default function ReactionModal({ open, onClose, slug, contentType = 'relato' }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">¿Qué te pareció?</h2>
        <ReactionBar slug={slug} contentType={contentType} />
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-900 text-primary-500 dark:bg-primary-500 dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-primary-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}


