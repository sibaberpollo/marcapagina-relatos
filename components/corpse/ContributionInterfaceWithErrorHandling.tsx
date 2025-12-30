'use client'

import * as React from 'react'
import { CorpseErrorBoundary } from '@/components/common/ErrorBoundary'
import { ContributionInterface } from './ContributionInterface'
import { ContributionSkeleton } from './CorpseSkeletons'
import type { ExquisiteCorpse, CorpseAuthor, CorpseSegment } from '@prisma/client'

interface ContributionInterfaceWithErrorHandlingProps {
  corpseId: string
  corpse: ExquisiteCorpse & {
    authors: (CorpseAuthor & { user: { id: string; name: string | null; image: string | null } })[]
    segments: (CorpseSegment & {
      author: { id: string; name: string | null; image: string | null }
    })[]
  }
  userId: string
  author: CorpseAuthor
}

export function ContributionInterfaceWithErrorHandling({
  corpseId,
  corpse,
  userId,
  author,
}: ContributionInterfaceWithErrorHandlingProps) {
  return (
    <CorpseErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Error en la colaboración
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Ha ocurrido un error inesperado en la interfaz de contribución
              </p>
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mb-4 text-left">
                  <summary className="mb-2 cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                    Detalles técnicos (desarrollo)
                  </summary>
                  <pre className="max-h-32 overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={resetError}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Reintentar
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <React.Suspense fallback={<ContributionSkeleton />}>
        <ContributionInterface
          corpseId={corpseId}
          corpse={corpse}
          userId={userId}
          author={author}
        />
      </React.Suspense>
    </CorpseErrorBoundary>
  )
}
