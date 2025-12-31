/**
 * Socket.io event type definitions for the Exquisite Corpse feature
 *
 * This file defines comprehensive TypeScript interfaces for all WebSocket events
 * used in the real-time collaborative writing system.
 */

// =============================================================================
// BASE TYPES AND UTILITIES
// =============================================================================

/**
 * Standard corpse status values
 */
export type CorpseStatus = 'active' | 'ended' | 'completed' | 'pending_moderation'

/**
 * User information included in socket events
 */
export interface SocketUser {
  id: string
  name?: string | null
  image?: string | null
}

/**
 * Corpse segment information
 */
export interface SocketSegment {
  id: string
  corpseId: string
  authorId: string
  content: string
  wordCount: number
  position: number
  createdAt: Date
  isSkipped?: boolean
}

// =============================================================================
// CLIENT-TO-SERVER EVENT PAYLOADS
// =============================================================================

/**
 * Payload for joining a corpse room
 */
export interface JoinCorpsePayload {
  corpseId: string
}

/**
 * Payload for leaving a corpse room
 */
export interface LeaveCorpsePayload {
  corpseId: string
}

/**
 * Payload for submitting a segment
 */
export interface SubmitSegmentPayload {
  corpseId: string
  content: string
  wordCount: number
}

/**
 * Payload for skipping a turn
 */
export interface SkipTurnPayload {
  corpseId: string
}

/**
 * Payload for voting to end a corpse
 */
export interface VoteToEndPayload {
  corpseId: string
}

// =============================================================================
// SERVER-TO-CLIENT EVENT PAYLOADS
// =============================================================================

/**
 * Payload for room state when joining
 */
export interface RoomStatePayload {
  corpse: {
    id: string
    title: string
    prompt?: string
    status: CorpseStatus
    maxContributors: number
    currentContributorId?: string
    createdAt: Date
    endedAt?: Date
  }
  authors: Array<{
    id: string
    userId: string
    joinedAt: Date
    hasContributed: boolean
    voteToEnd: boolean
    user: SocketUser
  }>
}

/**
 * Payload when a user joins the corpse
 */
export interface UserJoinedPayload {
  userId: string
  user: SocketUser
}

/**
 * Payload when a user leaves the corpse
 */
export interface UserLeftPayload {
  userId: string
}

/**
 * Payload when a segment is submitted
 */
export interface SegmentSubmittedPayload {
  segment: SocketSegment
  author: SocketUser
}

/**
 * Payload when corpse status is updated
 */
export interface StatusUpdatedPayload {
  status: CorpseStatus
}

/**
 * Payload when the contribution queue is updated
 */
export interface QueueUpdatedPayload {
  votesToEnd: number
  totalAuthors: number
  threshold: number
  currentContributorId?: string
  queue?: Array<{
    userId: string
    position: number
    hasContributed: boolean
  }>
}

/**
 * Payload when a timer starts for a contributor
 */
export interface TimerStartedPayload {
  userId: string
  endTime: string // ISO string
  duration: number // seconds
}

/**
 * Payload when a timer expires
 */
export interface TimerExpiredPayload {
  userId: string
}

/**
 * Payload when a turn is skipped
 */
export interface TurnSkippedPayload {
  userId: string
}

/**
 * Payload for error messages
 */
export interface ErrorPayload {
  message: string
}

// =============================================================================
// EVENT TYPE MAPPINGS
// =============================================================================

/**
 * Client-to-server event types mapping
 */
export interface ClientToServerEvents {
  'join-corpse': (payload: JoinCorpsePayload) => void
  'leave-corpse': (payload: LeaveCorpsePayload) => void
  'submit-segment': (payload: SubmitSegmentPayload) => void
  'skip-turn': (payload: SkipTurnPayload) => void
  'vote-to-end': (payload: VoteToEndPayload) => void
}

/**
 * Server-to-client event types mapping
 */
export interface ServerToClientEvents {
  'room-state': (payload: RoomStatePayload) => void
  'user-joined': (payload: UserJoinedPayload) => void
  'user-left': (payload: UserLeftPayload) => void
  'segment-submitted': (payload: SegmentSubmittedPayload) => void
  'status-updated': (payload: StatusUpdatedPayload) => void
  'queue-updated': (payload: QueueUpdatedPayload) => void
  'timer-started': (payload: TimerStartedPayload) => void
  'timer-expired': (payload: TimerExpiredPayload) => void
  'turn-skipped': (payload: TurnSkippedPayload) => void
  'error': (payload: ErrorPayload) => void
}

// =============================================================================
// TYPE GUARDS AND VALIDATION
// =============================================================================

/**
 * Type guard to check if a value is a valid corpse status
 */
export function isCorpseStatus(value: unknown): value is CorpseStatus {
  return typeof value === 'string' &&
         ['active', 'ended', 'completed', 'pending_moderation'].includes(value)
}

/**
 * Type guard for UserJoinedPayload
 */
export function isUserJoinedPayload(payload: unknown): payload is UserJoinedPayload {
  return typeof payload === 'object' &&
         payload !== null &&
         typeof (payload as UserJoinedPayload).userId === 'string' &&
         typeof (payload as UserJoinedPayload).user === 'object'
}

/**
 * Type guard for SegmentSubmittedPayload
 */
export function isSegmentSubmittedPayload(payload: unknown): payload is SegmentSubmittedPayload {
  return typeof payload === 'object' &&
         payload !== null &&
         typeof (payload as SegmentSubmittedPayload).segment === 'object' &&
         typeof (payload as SegmentSubmittedPayload).author === 'object'
}

/**
 * Type guard for StatusUpdatedPayload
 */
export function isStatusUpdatedPayload(payload: unknown): payload is StatusUpdatedPayload {
  return typeof payload === 'object' &&
         payload !== null &&
         isCorpseStatus((payload as StatusUpdatedPayload).status)
}

/**
 * Type guard for QueueUpdatedPayload
 */
export function isQueueUpdatedPayload(payload: unknown): payload is QueueUpdatedPayload {
  const p = payload as QueueUpdatedPayload
  return typeof payload === 'object' &&
         payload !== null &&
         typeof p.votesToEnd === 'number' &&
         typeof p.totalAuthors === 'number' &&
         typeof p.threshold === 'number'
}

/**
 * Type guard for TimerStartedPayload
 */
export function isTimerStartedPayload(payload: unknown): payload is TimerStartedPayload {
  const p = payload as TimerStartedPayload
  return typeof payload === 'object' &&
         payload !== null &&
         typeof p.userId === 'string' &&
         typeof p.endTime === 'string' &&
         typeof p.duration === 'number'
}

/**
 * Type guard for ErrorPayload
 */
export function isErrorPayload(payload: unknown): payload is ErrorPayload {
  return typeof payload === 'object' &&
         payload !== null &&
         typeof (payload as ErrorPayload).message === 'string'
}

// =============================================================================
// UTILITY TYPES FOR SOCKET MANAGER
// =============================================================================

/**
 * Generic event handler type for socket events
 */
export type SocketEventHandler<T = unknown> = (payload: T) => void

/**
 * Map of event names to their payload types for server-to-client events
 */
export type ServerEventPayloadMap = {
  [K in keyof ServerToClientEvents]: Parameters<ServerToClientEvents[K]>[0]
}

/**
 * Map of event names to their payload types for client-to-server events
 */
export type ClientEventPayloadMap = {
  [K in keyof ClientToServerEvents]: Parameters<ClientToServerEvents[K]>[0]
}

/**
 * Extract payload type for a specific server event
 */
export type ServerEventPayload<EventName extends keyof ServerToClientEvents> =
  Parameters<ServerToClientEvents[EventName]>[0]

/**
 * Extract payload type for a specific client event
 */
export type ClientEventPayload<EventName extends keyof ClientToServerEvents> =
  Parameters<ClientToServerEvents[EventName]>[0]