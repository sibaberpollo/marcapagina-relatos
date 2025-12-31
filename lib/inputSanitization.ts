/**
 * Input sanitization utilities for enhanced security
 */

import * as DOMPurify from 'isomorphic-dompurify'
import { CORPSE_CONFIG } from './corpseConfig'

// Initialize DOMPurify for server-side use
// Note: In production, you might want to configure DOMPurify more strictly

export interface SanitizationOptions {
  allowHtml?: boolean
  maxLength?: number
  preserveLineBreaks?: boolean
  trimWhitespace?: boolean
}

export interface SanitizationResult {
  sanitized: string
  originalLength: number
  sanitizedLength: number
  wasModified: boolean
  warnings: string[]
}

/**
 * Sanitize text input with comprehensive security measures
 */
export function sanitizeTextInput(
  input: string,
  options: SanitizationOptions = {}
): SanitizationResult {
  const {
    allowHtml = false,
    maxLength = CORPSE_CONFIG.CONTENT_VALIDATION.MAX_CONTENT_LENGTH,
    preserveLineBreaks = true,
    trimWhitespace = true,
  } = options

  const warnings: string[] = []
  let sanitized = input
  const originalLength = input.length

  // Basic validation
  if (typeof input !== 'string') {
    throw new Error('Input must be a string')
  }

  if (input.length === 0) {
    return {
      sanitized: '',
      originalLength: 0,
      sanitizedLength: 0,
      wasModified: false,
      warnings: [],
    }
  }

  // Trim whitespace if requested
  if (trimWhitespace) {
    sanitized = sanitized.trim()
  }

  // Handle line breaks preservation
  if (preserveLineBreaks) {
    // Normalize line breaks to \n
    sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  } else {
    // Remove all line breaks if not preserving
    sanitized = sanitized.replace(/[\r\n]+/g, ' ')
  }

  // Length validation
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
    warnings.push(`Content truncated to maximum length of ${maxLength} characters`)
  }

  // HTML sanitization
  if (!allowHtml) {
    // Use DOMPurify to remove any HTML tags and potentially dangerous content
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [], // No HTML tags allowed for text content
      ALLOWED_ATTR: [],
      ALLOW_DATA_ATTR: false,
    })
  } else {
    // If HTML is allowed, still sanitize it
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's'], // Very limited HTML
      ALLOWED_ATTR: [],
      ALLOW_DATA_ATTR: false,
    })
  }

  // Remove control characters (except line breaks if preserved)
  if (preserveLineBreaks) {
    // Remove control characters except \n (\x0A) and \r (\x0D)
    sanitized = sanitized.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
  } else {
    // Remove all control characters including line breaks
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')
  }

  // Remove zero-width characters and other invisible unicode
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, '')

  // Normalize whitespace (multiple spaces to single)
  sanitized = sanitized.replace(/ {2,}/g, ' ')

  // Check for suspicious patterns
  const suspiciousPatterns = [
    { pattern: /<script/i, message: 'Script tags detected and removed' },
    { pattern: /javascript:/i, message: 'JavaScript URLs detected and removed' },
    { pattern: /on\w+\s*=/i, message: 'Event handlers detected and removed' },
    { pattern: /data:\s*text\/html/i, message: 'Data URLs detected and removed' },
  ]

  for (const { pattern, message } of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, '')
      warnings.push(message)
    }
  }

  // Check for excessive repetition (simple DoS protection)
  if (hasExcessiveRepetition(sanitized)) {
    warnings.push('Content contains excessive character repetition')
  }

  const wasModified = sanitized !== input
  const sanitizedLength = sanitized.length

  return {
    sanitized,
    originalLength,
    sanitizedLength,
    wasModified,
    warnings,
  }
}

/**
 * Sanitize content specifically for corpse segments
 */
export function sanitizeCorpseContent(content: string): SanitizationResult {
  return sanitizeTextInput(content, {
    allowHtml: false,
    maxLength: CORPSE_CONFIG.CONTENT_VALIDATION.MAX_CONTENT_LENGTH,
    preserveLineBreaks: true,
    trimWhitespace: true,
  })
}

/**
 * Sanitize user input for actions (like usernames, titles)
 */
export function sanitizeUserInput(input: string, maxLength: number = 255): SanitizationResult {
  return sanitizeTextInput(input, {
    allowHtml: false,
    maxLength,
    preserveLineBreaks: false,
    trimWhitespace: true,
  })
}

/**
 * Check for excessive character repetition
 */
function hasExcessiveRepetition(text: string, threshold: number = 0.3): boolean {
  if (text.length < 10) return false

  const charCounts = new Map<string, number>()
  for (const char of text) {
    if (char !== ' ' && char !== '\n') {
      charCounts.set(char, (charCounts.get(char) || 0) + 1)
    }
  }

  const totalChars = text.replace(/\s/g, '').length
  const maxCount = Math.max(...Array.from(charCounts.values()))

  return maxCount / totalChars > threshold
}

/**
 * Validate input against common security patterns
 */
export function validateSecurityPatterns(input: string): {
  isValid: boolean
  violations: string[]
} {
  const violations: string[] = []

  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(#)|(%27)|(%22)|(%3B)|(%3A))/i,
  ]

  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      violations.push('Potential SQL injection pattern detected')
    }
  }

  // Check for XSS patterns
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
  ]

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      violations.push('Potential XSS pattern detected')
    }
  }

  // Check for path traversal
  if (/\.\.[/\\]/.test(input)) {
    violations.push('Path traversal pattern detected')
  }

  // Check for command injection
  if (/[;&|`$()<>]/.test(input) && /\b(rm|ls|cat|echo|eval|exec)\b/i.test(input)) {
    violations.push('Potential command injection detected')
  }

  return {
    isValid: violations.length === 0,
    violations,
  }
}
