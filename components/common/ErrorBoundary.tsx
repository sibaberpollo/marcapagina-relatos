'use client'

import * as React from 'react'
import { useCorpseTranslations } from '@/lib/i18n'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class CorpseErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error for monitoring
    console.error('Corpse Error Boundary caught an error:', error, errorInfo)

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <CorpseErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

// Default error fallback component
interface CorpseErrorFallbackProps {
  error?: Error
  resetError: () => void
}

function CorpseErrorFallback({ error, resetError }: CorpseErrorFallbackProps) {
  const translations = useCorpseTranslations()

  const errorMessage = translations?.errorBoundary?.genericError ||
    'Ha ocurrido un error inesperado en la interfaz de colaboración'

  const retryMessage = translations?.errorBoundary?.retryMessage ||
    'Inténtalo de nuevo'

  const reportMessage = translations?.errorBoundary?.reportMessage ||
    'Si el problema persiste, por favor reporta el error'

  return (
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
            {translations?.errorBoundary?.title || 'Error en la colaboración'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {errorMessage}
          </p>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                Detalles técnicos (desarrollo)
              </summary>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {retryMessage}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {reportMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook for error handling in functional components
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)

    // Could send to error reporting service here
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }, [])
}

export { CorpseErrorBoundary, CorpseErrorFallback }
export type { ErrorBoundaryProps, CorpseErrorFallbackProps }