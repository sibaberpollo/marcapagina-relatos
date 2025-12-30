import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Types for translations
export interface CorpseTranslations {
  createForm: {
    title: string
    titleRequired: string
    titlePlaceholder: string
    titleHelp: string
    promptLabel: string
    promptHelp: string
    promptPlaceholder: string
    selectedPrompt: string
    category: string
    categories: {
      literary: string
      creative: string
      experimental: string
    }
    selectPrompt: string
    maxContributors: string
    contributorsOptions: {
      '7': string
      '8': string
      '9': string
      '10': string
    }
    contributorsHelp: string
    submitButton: string
    submitting: string
    generalError: string
  }
  waitingRoom: {
    title: string
    status: {
      active: string
      pending: string
      completed: string
      ended: string
    }
    participants: string
    statusLabel: string
    progress: string
    contributionsCompleted: string
    writingNow: string
    queue: string
    noParticipants: string
    joinQueue: string
    joining: string
    voteToEnd: string
    voting: string
    votesToEnd: string
    alreadyVoted: string
    previousSegments: string
    andMore: string
    words: string
    anonymous: string
    loading: string
    queueFull: string
    canJoin: string
    canVote: string
  }
  contributionInterface: {
    contributeTo: string
    instructions: string
    yourPosition: string
    status: string
    contributionLabel: string
    contributionPlaceholder: string
    waitingPlaceholder: string
    contributionInstructions: string
    submitButton: string
    submitButtonShort: string
    submitting: string
    skipButton: string
    skipButtonShort: string
    skipping: string
    yourTurn: string
    waitingTurn: string
    loading: string
    retry: string
    notYourTurn: string
    notYourTurnSkip: string
    submitError: string
    skipError: string
    fetchError: string
    initError: string
  }
  circularTimer: {
    remaining: string
    criticalTime: string
    limitedTime: string
    timeRemaining: string
  }
  wordCounter: {
    requiredWords: string
    words: string
    valid: string
    needMore: string
    tooMany: string
    progress: string
  }
  validation: {
    warnings: {
      tooShort: string
      tooLong: string
      repetitive: string
      inappropriate: string
      offTopic: string
      generic: string
    }
    suggestionsTitle: string
  }
  newPage: {
    title: string
    description: string
    howItWorks: string
    howItWorksSteps: {
      '1': string
      '2': string
      '3': string
      '4': string
      '5': string
      '6': string
    }
  }
}

// Function to get current locale from pathname
function getCurrentLocale(pathname: string): string {
  return pathname.startsWith('/en/') || pathname === '/en' ? 'en' : 'es'
}

// Function to load translations
async function loadTranslations(locale: string): Promise<CorpseTranslations> {
  try {
    const response = await fetch(`/locales/${locale}/corpse.json`)
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${locale}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error)
    // Fallback to Spanish
    const fallbackResponse = await fetch('/locales/es/corpse.json')
    return await fallbackResponse.json()
  }
}

// Custom hook for corpse translations
export function useCorpseTranslations(): CorpseTranslations | null {
  const pathname = usePathname()
  const [translations, setTranslations] = useState<CorpseTranslations | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const locale = getCurrentLocale(pathname)

    loadTranslations(locale)
      .then(setTranslations)
      .catch((error) => {
        console.error('Failed to load translations:', error)
        setTranslations(null)
      })
      .finally(() => setLoading(false))
  }, [pathname])

  return loading ? null : translations
}
