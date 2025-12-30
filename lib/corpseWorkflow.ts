import { prisma } from '@/lib/prisma'
import { contentValidator } from '@/lib/contentValidation'
import type { Server } from 'socket.io'

// In-memory storage for drafts (temporary, not persisted)
// Key: `${corpseId}:${userId}`, Value: { content: string, lastSaved: Date }
const draftStorage = new Map<string, { content: string; lastSaved: Date }>()

// In-memory storage for active timers
// Key: `${corpseId}:${userId}`, Value: { timeoutId: NodeJS.Timeout, endTime: Date }
const activeTimers = new Map<string, { timeoutId: NodeJS.Timeout; endTime: Date }>()

export interface CorpseQueueItem {
  userId: string
  joinedAt: Date
  hasContributed: boolean
  position: number
}

export interface CorpseState {
  corpse: {
    id: string
    title: string
    status: 'active' | 'ended' | 'completed' | 'pending_moderation'
    maxContributors: number
    currentContributorId?: string
  }
  queue: CorpseQueueItem[]
  currentContributor?: CorpseQueueItem
  nextContributor?: CorpseQueueItem
  timeRemaining?: number // seconds
}

export class CorpseWorkflow {
  private static instance: CorpseWorkflow

  private constructor() {}

  static getInstance(): CorpseWorkflow {
    if (!CorpseWorkflow.instance) {
      CorpseWorkflow.instance = new CorpseWorkflow()
    }
    return CorpseWorkflow.instance
  }

  /**
   * Get the current state of a corpse including queue and timer
   */
  async getCorpseState(corpseId: string): Promise<CorpseState | null> {
    const corpse = await prisma.exquisiteCorpse.findUnique({
      where: { id: corpseId },
      include: {
        authors: {
          include: { user: true },
          orderBy: { joinedAt: 'asc' },
        },
      },
    })

    if (!corpse) return null

    // Build queue ordered by join time
    const queue: CorpseQueueItem[] = corpse.authors.map((author, index) => ({
      userId: author.userId,
      joinedAt: author.joinedAt,
      hasContributed: author.hasContributed,
      position: index + 1,
    }))

    // Determine current contributor (first in queue who hasn't contributed or last contributor)
    let currentContributor: CorpseQueueItem | undefined
    let nextContributor: CorpseQueueItem | undefined

    if (corpse.status === 'active') {
      // Find the current contributor (the one whose turn it is)
      const lastSegment = await prisma.corpseSegment.findFirst({
        where: { corpseId },
        orderBy: { position: 'desc' },
      })

      if (lastSegment) {
        // Find the next contributor in queue after the last segment author
        const lastAuthorIndex = queue.findIndex((q) => q.userId === lastSegment.authorId)
        const nextIndex = (lastAuthorIndex + 1) % queue.length
        currentContributor = queue[nextIndex]
        nextContributor = queue[(nextIndex + 1) % queue.length]
      } else {
        // First contribution
        currentContributor = queue[0]
        nextContributor = queue[1]
      }
    }

    // Calculate time remaining for current contributor
    let timeRemaining: number | undefined
    if (currentContributor) {
      const timerKey = `${corpseId}:${currentContributor.userId}`
      const timerData = activeTimers.get(timerKey)
      if (timerData) {
        timeRemaining = Math.max(0, Math.floor((timerData.endTime.getTime() - Date.now()) / 1000))
      }
    }

    return {
      corpse: {
        id: corpse.id,
        title: corpse.title,
        status: corpse.status,
        maxContributors: corpse.maxContributors,
        currentContributorId: currentContributor?.userId,
      },
      queue,
      currentContributor,
      nextContributor,
      timeRemaining,
    }
  }

  /**
   * Start a timer for a contributor
   */
  startTimer(corpseId: string, userId: string, io: Server): void {
    const timerKey = `${corpseId}:${userId}`
    const endTime = new Date(Date.now() + 2 * 60 * 1000) // 2 minutes

    // Clear existing timer if any
    this.clearTimer(corpseId, userId)

    const timeoutId = setTimeout(
      async () => {
        await this.handleTimeout(corpseId, userId, io)
      },
      2 * 60 * 1000
    )

    activeTimers.set(timerKey, { timeoutId, endTime })

    // Broadcast timer start
    io.to(corpseId).emit('timer-started', {
      userId,
      endTime: endTime.toISOString(),
      duration: 120, // 2 minutes in seconds
    })

    console.log(`Timer started for user ${userId} on corpse ${corpseId}`)
  }

  /**
   * Clear a timer for a contributor
   */
  clearTimer(corpseId: string, userId: string): void {
    const timerKey = `${corpseId}:${userId}`
    const timerData = activeTimers.get(timerKey)
    if (timerData) {
      clearTimeout(timerData.timeoutId)
      activeTimers.delete(timerKey)
      console.log(`Timer cleared for user ${userId} on corpse ${corpseId}`)
    }
  }

  /**
   * Handle timer timeout (automatic progression)
   */
  private async handleTimeout(corpseId: string, userId: string, io: Server): Promise<void> {
    try {
      console.log(`Timer expired for user ${userId} on corpse ${corpseId}`)

      // Clear the timer
      this.clearTimer(corpseId, userId)

      // Create a skipped segment
      const corpse = await prisma.exquisiteCorpse.findUnique({
        where: { id: corpseId },
        include: { segments: { orderBy: { position: 'desc' }, take: 1 } },
      })

      if (!corpse) return

      const lastSegment = corpse.segments[0]
      const position = (lastSegment?.position || 0) + 1

      await prisma.corpseSegment.create({
        data: {
          corpseId,
          authorId: userId,
          content: '[Tiempo agotado - segmento omitido]',
          wordCount: 0,
          position,
          isSkipped: true,
        },
      })

      // Progress to next contributor
      await this.progressToNext(corpseId, io)

      // Broadcast timeout event
      io.to(corpseId).emit('timer-expired', { userId })
    } catch (error) {
      console.error('Error handling timeout:', error)
    }
  }

  /**
   * Progress to the next contributor in queue
   */
  private async progressToNext(corpseId: string, io: Server): Promise<void> {
    const state = await this.getCorpseState(corpseId)
    if (!state || !state.nextContributor) return

    // Start timer for next contributor
    this.startTimer(corpseId, state.nextContributor.userId, io)

    // Update current contributor in database
    await prisma.exquisiteCorpse.update({
      where: { id: corpseId },
      data: { currentContributorId: state.nextContributor.userId },
    })

    // Broadcast queue update
    io.to(corpseId).emit('queue-updated', {
      currentContributorId: state.nextContributor.userId,
      queue: state.queue,
    })

    console.log(
      `Progressed to next contributor ${state.nextContributor.userId} on corpse ${corpseId}`
    )
  }

  /**
   * Validate segment content using the content validator
   */
  validateSegment(content: string): {
    isValid: boolean
    error?: string
    wordCount: number
    warnings?: string[]
  } {
    const result = contentValidator.validate(content)
    return {
      isValid: result.isValid,
      error: result.error,
      wordCount: result.wordCount,
      warnings: result.warnings,
    }
  }

  /**
   * Save a draft
   */
  saveDraft(corpseId: string, userId: string, content: string): void {
    const draftKey = `${corpseId}:${userId}`
    draftStorage.set(draftKey, {
      content,
      lastSaved: new Date(),
    })
    console.log(`Draft saved for user ${userId} on corpse ${corpseId}`)
  }

  /**
   * Get a draft
   */
  getDraft(corpseId: string, userId: string): string | null {
    const draftKey = `${corpseId}:${userId}`
    const draft = draftStorage.get(draftKey)
    return draft ? draft.content : null
  }

  /**
   * Clear a draft
   */
  clearDraft(corpseId: string, userId: string): void {
    const draftKey = `${corpseId}:${userId}`
    draftStorage.delete(draftKey)
    console.log(`Draft cleared for user ${userId} on corpse ${corpseId}`)
  }

  /**
   * Submit a segment
   */
  async submitSegment(
    corpseId: string,
    userId: string,
    content: string,
    io: Server
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const state = await this.getCorpseState(corpseId)
      if (!state) {
        return { success: false, error: 'Micronarrativa no encontrada' }
      }

      if (state.corpse.status !== 'active') {
        return { success: false, error: 'La micronarrativa no está activa' }
      }

      if (state.currentContributor?.userId !== userId) {
        return { success: false, error: 'No es tu turno para contribuir' }
      }

      // Validate content
      const validation = this.validateSegment(content)
      if (!validation.isValid) {
        return { success: false, error: validation.error }
      }

      // Clear timer
      this.clearTimer(corpseId, userId)

      // Create segment
      const lastSegment = await prisma.corpseSegment.findFirst({
        where: { corpseId },
        orderBy: { position: 'desc' },
      })

      const newSegment = await prisma.corpseSegment.create({
        data: {
          corpseId,
          authorId: userId,
          content,
          wordCount: validation.wordCount,
          position: (lastSegment?.position || 0) + 1,
        },
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
      })

      // Update author's contribution status
      await prisma.corpseAuthor.updateMany({
        where: { corpseId, userId },
        data: { hasContributed: true },
      })

      // Clear draft
      this.clearDraft(corpseId, userId)

      // Progress to next contributor
      await this.progressToNext(corpseId, io)

      // Broadcast new segment
      io.to(corpseId).emit('segment-submitted', {
        segment: newSegment,
        author: newSegment.author,
      })

      // Check if corpse should be completed (all authors contributed)
      await this.checkCompletion(corpseId)

      console.log(`Segment submitted for corpse ${corpseId} by user ${userId}`)

      return { success: true }
    } catch (error) {
      console.error('Error submitting segment:', error)
      return { success: false, error: 'Error al enviar el segmento' }
    }
  }

  /**
   * Skip a turn
   */
  async skipTurn(
    corpseId: string,
    userId: string,
    io: Server
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const state = await this.getCorpseState(corpseId)
      if (!state) {
        return { success: false, error: 'Micronarrativa no encontrada' }
      }

      if (state.currentContributor?.userId !== userId) {
        return { success: false, error: 'No es tu turno para saltar' }
      }

      // Clear timer
      this.clearTimer(corpseId, userId)

      // Create skipped segment
      const lastSegment = await prisma.corpseSegment.findFirst({
        where: { corpseId },
        orderBy: { position: 'desc' },
      })

      await prisma.corpseSegment.create({
        data: {
          corpseId,
          authorId: userId,
          content: '[Turno saltado]',
          wordCount: 0,
          position: (lastSegment?.position || 0) + 1,
          isSkipped: true,
        },
      })

      // Progress to next
      await this.progressToNext(corpseId, io)

      // Broadcast skip event
      io.to(corpseId).emit('turn-skipped', { userId })

      console.log(`Turn skipped for user ${userId} on corpse ${corpseId}`)

      return { success: true }
    } catch (error) {
      console.error('Error skipping turn:', error)
      return { success: false, error: 'Error al saltar el turno' }
    }
  }

  /**
   * Add a user to the corpse queue
   */
  async joinCorpse(
    corpseId: string,
    userId: string,
    io: Server
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if corpse exists and is active
      const corpse = await prisma.exquisiteCorpse.findUnique({
        where: { id: corpseId },
        include: { authors: true },
      })

      if (!corpse) {
        return { success: false, error: 'Micronarrativa no encontrada' }
      }

      if (corpse.status !== 'active') {
        return { success: false, error: 'La micronarrativa no está activa' }
      }

      if (corpse.authors.length >= corpse.maxContributors) {
        return { success: false, error: 'La micronarrativa está llena' }
      }

      // Check if user is already an author
      const existingAuthor = corpse.authors.find((a) => a.userId === userId)
      if (existingAuthor) {
        return { success: false, error: 'Ya eres parte de esta micronarrativa' }
      }

      // Add user as author
      await prisma.corpseAuthor.create({
        data: {
          corpseId,
          userId,
        },
      })

      // Get updated state
      const state = await this.getCorpseState(corpseId)
      if (!state) return { success: false, error: 'Error al obtener estado' }

      // If this is the first contributor, start the timer
      if (state.queue.length === 1 && state.currentContributor) {
        this.startTimer(corpseId, state.currentContributor.userId, io)
      }

      // Broadcast join event
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, image: true },
      })

      io.to(corpseId).emit('user-joined', {
        userId,
        user: user || { id: userId },
      })

      console.log(`User ${userId} joined corpse ${corpseId}`)

      return { success: true }
    } catch (error) {
      console.error('Error joining corpse:', error)
      return { success: false, error: 'Error al unirse a la micronarrativa' }
    }
  }

  /**
   * Handle voting to end the corpse
   */
  async voteToEnd(
    corpseId: string,
    userId: string
  ): Promise<{
    success: boolean
    error?: string
    votesToEnd?: number
    totalAuthors?: number
    threshold?: number
    ended?: boolean
  }> {
    try {
      // Verify user is part of the corpse
      const author = await prisma.corpseAuthor.findFirst({
        where: { corpseId, userId },
      })
      if (!author) {
        return { success: false, error: 'Not authorized for this corpse' }
      }

      // Check if already voted
      if (author.voteToEnd) {
        return { success: false, error: 'Already voted to end' }
      }

      // Update vote
      await prisma.corpseAuthor.updateMany({
        where: { corpseId, userId },
        data: { voteToEnd: true },
      })

      // Check voting status
      const votingResult = await this.checkVotingThreshold(corpseId)

      return {
        success: true,
        votesToEnd: votingResult.votesToEnd,
        totalAuthors: votingResult.totalAuthors,
        threshold: votingResult.threshold,
        ended: votingResult.ended,
      }
    } catch (error) {
      console.error('Error voting to end:', error)
      return { success: false, error: 'Error al votar' }
    }
  }

  /**
   * Check if voting threshold is reached and handle completion
   */
  private async checkVotingThreshold(corpseId: string): Promise<{
    votesToEnd: number
    totalAuthors: number
    threshold: number
    ended: boolean
  }> {
    const corpse = await prisma.exquisiteCorpse.findUnique({
      where: { id: corpseId },
      include: { authors: true },
    })

    if (!corpse) {
      throw new Error('Corpse not found')
    }

    const totalAuthors = corpse.authors.length
    const votesToEnd = corpse.authors.filter((author) => author.voteToEnd).length
    const threshold = Math.ceil(totalAuthors * 0.6)

    if (votesToEnd >= threshold) {
      // End the corpse
      await this.endCorpse(corpseId)
      return { votesToEnd, totalAuthors, threshold, ended: true }
    }

    return { votesToEnd, totalAuthors, threshold, ended: false }
  }

  /**
   * End a corpse and prepare for moderation
   */
  private async endCorpse(corpseId: string): Promise<void> {
    await prisma.exquisiteCorpse.update({
      where: { id: corpseId },
      data: {
        status: 'ended',
        endedAt: new Date(),
      },
    })

    // Clean up workflow resources
    this.cleanupCorpse(corpseId)

    console.log(`Corpse ${corpseId} ended by majority vote`)
  }

  /**
   * Check if corpse should be completed (all authors contributed)
   */
  async checkCompletion(corpseId: string): Promise<boolean> {
    const corpse = await prisma.exquisiteCorpse.findUnique({
      where: { id: corpseId },
      include: {
        authors: true,
        segments: true,
      },
    })

    if (!corpse || corpse.status !== 'active') {
      return false
    }

    // Check if all authors have contributed (or skipped)
    const totalSegments = corpse.segments.length
    const expectedSegments = corpse.authors.length

    if (totalSegments >= expectedSegments) {
      // Mark as completed and prepare for moderation
      await this.completeCorpse(corpseId)
      return true
    }

    return false
  }

  /**
   * Complete a corpse and trigger moderation workflow
   */
  private async completeCorpse(corpseId: string): Promise<void> {
    await prisma.exquisiteCorpse.update({
      where: { id: corpseId },
      data: {
        status: 'pending_moderation',
        endedAt: new Date(),
      },
    })

    // Clean up workflow resources
    this.cleanupCorpse(corpseId)

    console.log(`Corpse ${corpseId} completed - marked as pending_moderation`)
    // TODO: Trigger notification to moderators
  }

  /**
   * Get voting status for a corpse
   */
  async getVotingStatus(
    corpseId: string,
    userId?: string
  ): Promise<{
    votesToEnd: number
    totalAuthors: number
    threshold: number
    userVoted: boolean
    status: 'active' | 'ended' | 'completed' | 'pending_moderation'
  }> {
    const corpse = await prisma.exquisiteCorpse.findUnique({
      where: { id: corpseId },
      include: { authors: true },
    })

    if (!corpse) {
      throw new Error('Corpse not found')
    }

    const totalAuthors = corpse.authors.length
    const votesToEnd = corpse.authors.filter((author) => author.voteToEnd).length
    const threshold = Math.ceil(totalAuthors * 0.6)

    // Check if specific user has voted
    let userVoted = false
    if (userId) {
      const author = corpse.authors.find((a) => a.userId === userId)
      userVoted = author?.voteToEnd ?? false
    }

    return {
      votesToEnd,
      totalAuthors,
      threshold,
      userVoted,
      status: corpse.status,
    }
  }

  /**
   * Clean up resources when a corpse ends
   */
  cleanupCorpse(corpseId: string): void {
    // Clear all timers for this corpse
    for (const [key, timerData] of activeTimers.entries()) {
      if (key.startsWith(`${corpseId}:`)) {
        clearTimeout(timerData.timeoutId)
        activeTimers.delete(key)
      }
    }

    // Clear all drafts for this corpse
    for (const key of draftStorage.keys()) {
      if (key.startsWith(`${corpseId}:`)) {
        draftStorage.delete(key)
      }
    }

    console.log(`Cleaned up resources for corpse ${corpseId}`)
  }
}

export const corpseWorkflow = CorpseWorkflow.getInstance()
