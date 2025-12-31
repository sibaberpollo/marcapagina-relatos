'use client'

import { useCorpseTranslations } from '@/lib/i18n'
import { CreateCorpseForm } from '@/components/corpse/CreateCorpseForm'
import SectionContainer from '@/components/layout/SectionContainer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function NuevaMicronarrativaClient() {
  const translations = useCorpseTranslations()

  if (!translations) {
    return (
      <SectionContainer>
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <LoadingSpinner className="mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Cargando...</p>
            </div>
          </div>
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer>
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

        <div className="bg-accent/10 dark:bg-accent/20 mt-8 rounded-lg p-6">
          <h2 className="text-accent dark:text-accent mb-2 text-lg font-semibold">
            {translations.newPage.howItWorks}
          </h2>
          <ul className="text-accent dark:text-accent space-y-2 text-sm">
            <li>• {translations.newPage.howItWorksSteps['1']}</li>
            <li>• {translations.newPage.howItWorksSteps['2']}</li>
            <li>• {translations.newPage.howItWorksSteps['3']}</li>
            <li>• {translations.newPage.howItWorksSteps['4']}</li>
            <li>• {translations.newPage.howItWorksSteps['5']}</li>
            <li>• {translations.newPage.howItWorksSteps['6']}</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  )
}
