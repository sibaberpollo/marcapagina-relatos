'use client'

import { useCorpseTranslations } from '@/lib/i18n'
import { CreateCorpseForm } from '@/components/corpse/CreateCorpseForm'

export default function NuevaMicronarrativaClient() {
  const translations = useCorpseTranslations()

  if (!translations) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {translations.newPage.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {translations.newPage.description}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <CreateCorpseForm />
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h2 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
            {translations.newPage.howItWorks}
          </h2>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• {translations.newPage.howItWorksSteps['1']}</li>
            <li>• {translations.newPage.howItWorksSteps['2']}</li>
            <li>• {translations.newPage.howItWorksSteps['3']}</li>
            <li>• {translations.newPage.howItWorksSteps['4']}</li>
            <li>• {translations.newPage.howItWorksSteps['5']}</li>
            <li>• {translations.newPage.howItWorksSteps['6']}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
