import { Filter } from 'bad-words'

export interface ValidationResult {
  isValid: boolean
  error?: string
  warnings?: string[]
  wordCount: number
  qualityScore: number
}

export interface ContentFilters {
  wordCount: {
    min: number
    max: number
  }
  profanity: boolean
  spam: boolean
  quality: boolean
}

export class ContentValidator {
  private filter: Filter
  private filters: ContentFilters

  constructor(filters: Partial<ContentFilters> = {}) {
    this.filter = new Filter()

    // Configure filter with Spanish swear words (add more as needed)
    const badWords = [
      'mierda',
      'joder',
      'puta',
      'coño',
      'cabrón',
      'gilipollas',
      'imbécil',
      'idiota',
      'estúpido',
      'tonto',
      'pendejo',
      'verga',
      'chingar',
      'madre',
      'carajo',
      'fuck',
      'shit',
      'asshole',
      'bitch',
      'damn',
      'hell',
    ]
    badWords.forEach((word) => this.filter.addWords(word))

    this.filters = {
      wordCount: { min: 50, max: 100 },
      profanity: true,
      spam: true,
      quality: true,
      ...filters,
    }
  }

  /**
   * Validate content against all enabled filters
   */
  validate(content: string): ValidationResult {
    if (!content || typeof content !== 'string') {
      return {
        isValid: false,
        error: 'El contenido debe ser una cadena de texto válida',
        wordCount: 0,
        qualityScore: 0,
      }
    }

    const trimmedContent = content.trim()
    const wordCount = this.countWords(trimmedContent)
    const warnings: string[] = []

    // Word count validation
    if (this.filters.wordCount) {
      const { min, max } = this.filters.wordCount
      if (wordCount < min) {
        return {
          isValid: false,
          error: `El segmento debe tener al menos ${min} palabras. Actualmente tiene ${wordCount}.`,
          wordCount,
          qualityScore: 0,
        }
      }
      if (wordCount > max) {
        return {
          isValid: false,
          error: `El segmento no puede exceder ${max} palabras. Actualmente tiene ${wordCount}.`,
          wordCount,
          qualityScore: 0,
        }
      }
    }

    // Profanity check
    if (this.filters.profanity) {
      const hasProfanity = this.checkProfanity(trimmedContent)
      if (hasProfanity) {
        return {
          isValid: false,
          error:
            'El contenido contiene lenguaje inapropiado. Por favor, revisa y modifica tu texto.',
          wordCount,
          qualityScore: 0,
        }
      }
    }

    // Spam detection
    if (this.filters.spam) {
      const spamCheck = this.checkSpam(trimmedContent)
      if (!spamCheck.isValid) {
        return {
          isValid: false,
          error: spamCheck.error,
          wordCount,
          qualityScore: 0,
        }
      }
      if (spamCheck.warning) {
        warnings.push(spamCheck.warning)
      }
    }

    // Quality check
    let qualityScore = 0
    if (this.filters.quality) {
      qualityScore = this.assessQuality(trimmedContent)
      if (qualityScore < 0.3) {
        warnings.push('El contenido podría beneficiarse de una revisión para mejorar la calidad.')
      }
    }

    return {
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined,
      wordCount,
      qualityScore,
    }
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  /**
   * Check for profanity
   */
  private checkProfanity(text: string): boolean {
    return this.filter.isProfane(text)
  }

  /**
   * Check for spam patterns
   */
  private checkSpam(text: string): { isValid: boolean; error?: string; warning?: string } {
    const lowerText = text.toLowerCase()

    // Check for excessive repetition
    const words = lowerText.split(/\s+/)
    const wordCounts = new Map<string, number>()
    for (const word of words) {
      if (word.length > 3) {
        // Only check words longer than 3 chars
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
      }
    }

    const maxRepetition = Math.max(...Array.from(wordCounts.values()))
    if (maxRepetition > words.length * 0.3) {
      // More than 30% of words are repetitions
      return {
        isValid: false,
        error: 'El contenido parece contener repeticiones excesivas. Por favor, varía tu lenguaje.',
      }
    }

    // Check for character repetition (like "aaaaa")
    if (/(.)\1{4,}/.test(lowerText)) {
      return {
        isValid: false,
        error: 'El contenido contiene repeticiones de caracteres excesivas.',
      }
    }

    // Check for very short sentences (potential spam)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const avgSentenceLength = words.length / sentences.length
    if (avgSentenceLength < 3 && sentences.length > 5) {
      return {
        isValid: false,
        warning:
          'Tu texto tiene muchas oraciones muy cortas. Considera combinar algunas para mejorar el flujo.',
      }
    }

    return { isValid: true }
  }

  /**
   * Assess content quality with basic heuristics
   */
  private assessQuality(text: string): number {
    let score = 0
    const words = text.split(/\s+/)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

    // Sentence variety (not too many short sentences)
    const avgWordsPerSentence = words.length / sentences.length
    if (avgWordsPerSentence >= 5 && avgWordsPerSentence <= 20) {
      score += 0.3
    } else if (avgWordsPerSentence >= 3 && avgWordsPerSentence <= 25) {
      score += 0.2
    }

    // Punctuation variety
    const punctuationCount = (text.match(/[.!?]/g) || []).length
    const punctuationRatio = punctuationCount / sentences.length
    if (punctuationRatio >= 0.8 && punctuationRatio <= 1.2) {
      score += 0.2
    }

    // Word variety (unique words ratio)
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()))
    const uniqueRatio = uniqueWords.size / words.length
    if (uniqueRatio >= 0.6) {
      score += 0.3
    } else if (uniqueRatio >= 0.4) {
      score += 0.2
    }

    // Length appropriateness (within word count limits)
    if (words.length >= 50 && words.length <= 100) {
      score += 0.2
    }

    return Math.min(1, score)
  }

  /**
   * Clean content (remove extra whitespace, normalize)
   */
  clean(content: string): string {
    return content
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
  }

  /**
   * Get filter configuration
   */
  getFilters(): ContentFilters {
    return { ...this.filters }
  }

  /**
   * Update filter configuration
   */
  updateFilters(newFilters: Partial<ContentFilters>): void {
    this.filters = { ...this.filters, ...newFilters }
  }
}

// Singleton instance for server-side use
export const contentValidator = new ContentValidator()

// Client-side validation (lighter version without bad-words for bundle size)
export class ClientContentValidator {
  private filters: ContentFilters

  constructor(filters: Partial<ContentFilters> = {}) {
    this.filters = {
      wordCount: { min: 50, max: 100 },
      profanity: false, // Disabled on client for bundle size
      spam: true,
      quality: false, // Disabled on client for performance
      ...filters,
    }
  }

  validate(content: string): ValidationResult {
    if (!content || typeof content !== 'string') {
      return {
        isValid: false,
        error: 'El contenido debe ser una cadena de texto válida',
        wordCount: 0,
        qualityScore: 0,
      }
    }

    const trimmedContent = content.trim()
    const wordCount = this.countWords(trimmedContent)

    // Word count validation
    if (this.filters.wordCount) {
      const { min, max } = this.filters.wordCount
      if (wordCount < min) {
        return {
          isValid: false,
          error: `El segmento debe tener al menos ${min} palabras. Actualmente tiene ${wordCount}.`,
          wordCount,
          qualityScore: 0,
        }
      }
      if (wordCount > max) {
        return {
          isValid: false,
          error: `El segmento no puede exceder ${max} palabras. Actualmente tiene ${wordCount}.`,
          wordCount,
          qualityScore: 0,
        }
      }
    }

    // Basic spam detection (without profanity check)
    if (this.filters.spam) {
      const spamCheck = this.checkBasicSpam(trimmedContent)
      if (!spamCheck.isValid) {
        return {
          isValid: false,
          error: spamCheck.error,
          wordCount,
          qualityScore: 0,
        }
      }
    }

    return {
      isValid: true,
      wordCount,
      qualityScore: 0.5, // Default score for client-side
    }
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  private checkBasicSpam(text: string): { isValid: boolean; error?: string } {
    const lowerText = text.toLowerCase()

    // Check for excessive repetition
    const words = lowerText.split(/\s+/)
    const wordCounts = new Map<string, number>()
    for (const word of words) {
      if (word.length > 3) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
      }
    }

    const maxRepetition = Math.max(...Array.from(wordCounts.values()))
    if (maxRepetition > words.length * 0.3) {
      return {
        isValid: false,
        error: 'El contenido parece contener repeticiones excesivas.',
      }
    }

    // Check for character repetition
    if (/(.)\1{4,}/.test(lowerText)) {
      return {
        isValid: false,
        error: 'El contenido contiene repeticiones de caracteres excesivas.',
      }
    }

    return { isValid: true }
  }

  clean(content: string): string {
    return content.trim().replace(/\s+/g, ' ').replace(/\n+/g, '\n')
  }
}

// Export client validator instance
export const clientContentValidator = new ClientContentValidator()
