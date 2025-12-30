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
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Error en la colaboración
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ha ocurrido un error inesperado en la interfaz de contribución
              </p>
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mb-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Detalles técnicos (desarrollo)
                  </summary>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={resetError}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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