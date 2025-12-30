import { toast } from '@/components/ui/use-toast'
import { useCorpseTranslations } from '@/lib/i18n'

// Error types for different categories
export enum CorpseErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  TIMEOUT = 'timeout',
  WEBSOCKET = 'websocket',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Structured error interface
export interface CorpseError {
  type: CorpseErrorType
  severity: ErrorSeverity
  message: string
  userMessage?: string
  code?: string
  retryable?: boolean
  context?: Record<string, any>
  originalError?: Error
}

// Error handler hook
export function useCorpseErrorHandler() {
  const translations = useCorpseTranslations()

  const handleError = React.useCallback(
    (error: CorpseError | Error | string, showToast: boolean = true) => {
      let corpseError: CorpseError

      // Convert different error types to CorpseError
      if (typeof error === 'string') {
        corpseError = {
          type: CorpseErrorType.UNKNOWN,
          severity: ErrorSeverity.MEDIUM,
          message: error,
          userMessage: error,
          retryable: false,
        }
      } else if (error instanceof Error) {
        // Try to determine error type from error properties
        corpseError = classifyError(error)
      } else {
        corpseError = error
      }

      // Log error for monitoring
      console.error('Corpse Error:', {
        type: corpseError.type,
        severity: corpseError.severity,
        message: corpseError.message,
        code: corpseError.code,
        context: corpseError.context,
        originalError: corpseError.originalError,
      })

      // Show toast notification if requested
      if (showToast) {
        const toastVariant = corpseError.severity === ErrorSeverity.CRITICAL ||
                           corpseError.severity === ErrorSeverity.HIGH
                           ? 'destructive' : 'default'

        toast({
          variant: toastVariant,
          title: getErrorTitle(corpseError, translations),
          description: corpseError.userMessage || corpseError.message,
        })
      }

      return corpseError
    },
    [translations]
  )

  const handleRetry = React.useCallback(
    (retryFn: () => Promise<void> | void, error: CorpseError) => {
      if (!error.retryable) return

      handleError({
        ...error,
        severity: ErrorSeverity.LOW,
        userMessage: translations?.errorHandling?.retrying || 'Reintentando...',
      })

      try {
        const result = retryFn()
        if (result instanceof Promise) {
          result.catch((retryError) => {
            handleError(retryError, true)
          })
        }
      } catch (retryError) {
        handleError(retryError, true)
      }
    },
    [handleError, translations]
  )

  return { handleError, handleRetry }
}

// Classify errors based on their properties
function classifyError(error: Error): CorpseError {
  const message = error.message.toLowerCase()

  // Network errors
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return {
      type: CorpseErrorType.NETWORK,
      severity: ErrorSeverity.HIGH,
      message: error.message,
      userMessage: 'Error de conexión. Verifica tu conexión a internet.',
      retryable: true,
      originalError: error,
    }
  }

  // Authentication errors
  if (message.includes('unauthorized') || message.includes('authentication') || message.includes('401')) {
    return {
      type: CorpseErrorType.AUTHENTICATION,
      severity: ErrorSeverity.CRITICAL,
      message: error.message,
      userMessage: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      retryable: false,
      originalError: error,
    }
  }

  // Authorization errors
  if (message.includes('forbidden') || message.includes('not authorized') || message.includes('403')) {
    return {
      type: CorpseErrorType.AUTHORIZATION,
      severity: ErrorSeverity.HIGH,
      message: error.message,
      userMessage: 'No tienes permisos para realizar esta acción.',
      retryable: false,
      originalError: error,
    }
  }

  // Timeout errors
  if (message.includes('timeout') || message.includes('timed out')) {
    return {
      type: CorpseErrorType.TIMEOUT,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      userMessage: 'La operación tardó demasiado. Inténtalo de nuevo.',
      retryable: true,
      originalError: error,
    }
  }

  // WebSocket errors
  if (message.includes('websocket') || message.includes('socket')) {
    return {
      type: CorpseErrorType.WEBSOCKET,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      userMessage: 'Error de conexión en tiempo real. Reconectando...',
      retryable: true,
      originalError: error,
    }
  }

  // Validation errors
  if (message.includes('validation') || message.includes('invalid')) {
    return {
      type: CorpseErrorType.VALIDATION,
      severity: ErrorSeverity.LOW,
      message: error.message,
      userMessage: error.message, // Validation errors usually have user-friendly messages
      retryable: false,
      originalError: error,
    }
  }

  // Default to server error
  return {
    type: CorpseErrorType.SERVER,
    severity: ErrorSeverity.MEDIUM,
    message: error.message,
    userMessage: 'Ha ocurrido un error en el servidor. Inténtalo de nuevo.',
    retryable: true,
    originalError: error,
  }
}

// Get appropriate error title based on error type
function getErrorTitle(error: CorpseError, translations?: any): string {
  const titles = translations?.errorHandling?.titles || {}

  switch (error.type) {
    case CorpseErrorType.NETWORK:
      return titles.network || 'Error de conexión'
    case CorpseErrorType.AUTHENTICATION:
      return titles.authentication || 'Error de autenticación'
    case CorpseErrorType.AUTHORIZATION:
      return titles.authorization || 'Sin permisos'
    case CorpseErrorType.VALIDATION:
      return titles.validation || 'Error de validación'
    case CorpseErrorType.TIMEOUT:
      return titles.timeout || 'Tiempo agotado'
    case CorpseErrorType.WEBSOCKET:
      return titles.websocket || 'Error de conexión'
    case CorpseErrorType.SERVER:
      return titles.server || 'Error del servidor'
    default:
      return titles.unknown || 'Error desconocido'
  }
}

// Async error boundary for promises
export async function withErrorHandling<T>(
  promise: Promise<T>,
  errorHandler: (error: CorpseError) => void
): Promise<T | null> {
  try {
    return await promise
  } catch (error) {
    const corpseError = error instanceof Error ? classifyError(error) : {
      type: CorpseErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: String(error),
      userMessage: 'Ha ocurrido un error inesperado',
      retryable: false,
      originalError: error as Error,
    }

    errorHandler(corpseError)
    return null
  }
}

// Network status detection
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Hook for managing loading states with error handling
export function useAsyncOperation() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<CorpseError | null>(null)
  const { handleError } = useCorpseErrorHandler()

  const execute = React.useCallback(
    async <T,>(
      operation: () => Promise<T>,
      options: {
        showErrorToast?: boolean
        onSuccess?: (result: T) => void
        onError?: (error: CorpseError) => void
      } = {}
    ): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        const result = await operation()
        options.onSuccess?.(result)
        return result
      } catch (err) {
        const corpseError = handleError(err as Error, options.showErrorToast ?? true)
        setError(corpseError)
        options.onError?.(corpseError)
        return null
      } finally {
        setLoading(false)
      }
    },
    [handleError]
  )

  return { loading, error, execute, clearError: () => setError(null) }
}

import * as React from 'react'
import { ToastAction } from '@/components/ui/toast'