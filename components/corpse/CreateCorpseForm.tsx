'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { CORPSE_PROMPTS } from '@/data/corpsePrompts'
import { createExquisiteCorpse } from '../../app/micronarrativas/nueva/actions'

function CreateCorpseForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/?login=true')
    }
  }, [status, router])

  const [selectedPromptId, setSelectedPromptId] = React.useState<string>('')

  const selectedPrompt = CORPSE_PROMPTS.find((prompt) => prompt.id === selectedPromptId)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!session?.user) return

    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(event.currentTarget)

    try {
      const result = await createExquisiteCorpse(formData)

      if (result.success && result.corpseId) {
        router.push(`/micronarrativas/${result.corpseId}/contribuir`)
      } else if (result.errors) {
        setErrors(result.errors)
      }
    } catch (error) {
      console.error('Error creating corpse:', error)
      setErrors({ general: 'Error al crear la micronarrativa. Inténtalo de nuevo.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePromptChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPromptId(event.target.value)
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)} {...props}>
      {/* General Error */}
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
          <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
        </div>
      )}

      {/* Title Field */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          Título de la micronarrativa <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={100}
          className={cn(
            'block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100',
            errors.title
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600'
          )}
          placeholder="Ingresa un título atractivo para tu micronarrativa"
        />
        {errors.title && <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
      </div>

      {/* Prompt Selection */}
      <div className="space-y-2">
        <label
          htmlFor="promptId"
          className="block text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          Elige un prompt creativo
        </label>
        <select
          id="promptId"
          name="promptId"
          onChange={handlePromptChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">Sin prompt específico (libre creación)</option>
          {CORPSE_PROMPTS.map((prompt) => (
            <option key={prompt.id} value={prompt.id}>
              {prompt.title}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Los prompts ayudan a guiar la creación colectiva y generan resultados más coherentes.
        </p>
      </div>

      {/* Selected Prompt Description */}
      <div className="space-y-2">
        <div className="min-h-[60px] rounded-md border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          {selectedPrompt ? (
            <div>
              <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">
                {selectedPrompt.title}
              </p>
              <p className="text-gray-700 dark:text-gray-300">{selectedPrompt.description}</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Categoría:{' '}
                {selectedPrompt.category === 'literary'
                  ? 'Literario'
                  : selectedPrompt.category === 'creative'
                    ? 'Creativo'
                    : selectedPrompt.category === 'experimental'
                      ? 'Experimental'
                      : selectedPrompt.category}
              </p>
            </div>
          ) : (
            <p>Selecciona un prompt para ver su descripción aquí.</p>
          )}
        </div>
      </div>

      {/* Max Contributors */}
      <div className="space-y-2">
        <label
          htmlFor="maxContributors"
          className="block text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          Número máximo de colaboradores
        </label>
        <select
          id="maxContributors"
          name="maxContributors"
          defaultValue="7"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="7">7 colaboradores</option>
          <option value="8">8 colaboradores</option>
          <option value="9">9 colaboradores</option>
          <option value="10">10 colaboradores</option>
        </select>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Entre 7 y 10 autores pueden contribuir. Más autores = más diversidad, menos control.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Creando...
            </>
          ) : (
            'Crear micronarrativa'
          )}
        </button>
      </div>
    </form>
  )
}

export { CreateCorpseForm }
