import { io, Socket } from 'socket.io-client'
import type {
  RoomStatePayload,
  UserJoinedPayload,
  UserLeftPayload,
  SegmentSubmittedPayload,
  StatusUpdatedPayload,
  QueueUpdatedPayload,
  TimerStartedPayload,
  TimerExpiredPayload,
  TurnSkippedPayload,
  ErrorPayload,
  ServerToClientEvents,
  ClientToServerEvents,
  SocketEventHandler,
  ServerEventPayload,
} from '@/types/socketEvents'

// Re-export types for backward compatibility
export type CorpseRoomState = RoomStatePayload
export type SegmentSubmittedEvent = SegmentSubmittedPayload
export type UserJoinedEvent = UserJoinedPayload
export type QueueUpdatedEvent = QueueUpdatedPayload
export type StatusUpdatedEvent = StatusUpdatedPayload

class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor() {
    this.initializeSocket()
  }

  private initializeSocket() {
    if (typeof window === 'undefined') return

    try {
      this.socket = io({
        path: '/api/socket/io',
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      })

      this.setupEventListeners()
    } catch (error) {
      console.error('Failed to initialize socket:', error)
    }
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason)
      this.handleReconnect()
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error)
      this.handleReconnect()
    })

    this.socket.on('error', (message: string) => {
      console.error('Socket.IO error:', message)
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      )

      setTimeout(() => {
        this.socket?.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
      // Emit a custom event for UI to handle disconnection
      this.socket?.emit('max-reconnect-attempts-reached')
    }
  }

  // Room management
  joinCorpse(corpseId: string): Promise<RoomStatePayload> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Join room timeout'))
      }, 10000)

      this.socket.emit('join-corpse', { corpseId })

      this.socket.once('room-state', (data: RoomStatePayload) => {
        clearTimeout(timeout)
        resolve(data)
      })

      this.socket.once('error', (errorPayload: ErrorPayload) => {
        clearTimeout(timeout)
        reject(new Error(errorPayload.message))
      })
    })
  }

  leaveCorpse(corpseId: string) {
    if (this.socket) {
      this.socket.emit('leave-corpse', { corpseId })
    }
  }

  // Event listeners with proper typing
  onUserJoined(callback: SocketEventHandler<UserJoinedPayload>) {
    if (this.socket) {
      this.socket.on('user-joined', callback)
    }
  }

  onUserLeft(callback: SocketEventHandler<UserLeftPayload>) {
    if (this.socket) {
      this.socket.on('user-left', callback)
    }
  }

  onSegmentSubmitted(callback: SocketEventHandler<SegmentSubmittedPayload>) {
    if (this.socket) {
      this.socket.on('segment-submitted', callback)
    }
  }

  onStatusUpdated(callback: SocketEventHandler<StatusUpdatedPayload>) {
    if (this.socket) {
      this.socket.on('status-updated', callback)
    }
  }

  onQueueUpdated(callback: SocketEventHandler<QueueUpdatedPayload>) {
    if (this.socket) {
      this.socket.on('queue-updated', callback)
    }
  }

  // Actions
  submitSegment(corpseId: string, content: string, wordCount: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Submit segment timeout'))
      }, 10000)

      this.socket.emit('submit-segment', { corpseId, content, wordCount })

      // Listen for success (segment-submitted event) or error
      const successHandler = (data: SegmentSubmittedPayload) => {
        if (data.segment.corpseId === corpseId) {
          clearTimeout(timeout)
          this.socket?.off('segment-submitted', successHandler)
          resolve()
        }
      }

      const errorHandler = (errorPayload: ErrorPayload) => {
        clearTimeout(timeout)
        this.socket?.off('error', errorHandler)
        this.socket?.off('segment-submitted', successHandler)
        reject(new Error(errorPayload.message))
      }

      this.socket.on('segment-submitted', successHandler)
      this.socket.on('error', errorHandler)
    })
  }

  voteToEnd(corpseId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Vote timeout'))
      }, 5000)

      this.socket.emit('vote-to-end', { corpseId })

      // Listen for success (status-updated or queue-updated) or error
      const successHandler = () => {
        clearTimeout(timeout)
        this.socket?.off('status-updated', successHandler)
        this.socket?.off('queue-updated', successHandler)
        resolve()
      }

      const errorHandler = (errorPayload: ErrorPayload) => {
        clearTimeout(timeout)
        this.socket?.off('error', errorHandler)
        this.socket?.off('status-updated', successHandler)
        this.socket?.off('queue-updated', successHandler)
        reject(new Error(errorPayload.message))
      }

      this.socket.on('status-updated', successHandler)
      this.socket.on('queue-updated', successHandler)
      this.socket.on('error', errorHandler)
    })
  }

  skipTurn(corpseId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Skip turn timeout'))
      }, 5000)

      this.socket.emit('skip-turn', { corpseId })

      // Listen for success (turn-skipped event) or error
      const successHandler = (payload: TurnSkippedPayload) => {
        clearTimeout(timeout)
        this.socket?.off('turn-skipped', successHandler)
        resolve()
      }

      const errorHandler = (errorPayload: ErrorPayload) => {
        clearTimeout(timeout)
        this.socket?.off('error', errorHandler)
        this.socket?.off('turn-skipped', successHandler)
        reject(new Error(errorPayload.message))
      }

      this.socket.on('turn-skipped', successHandler)
      this.socket.on('error', errorHandler)
    })
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Connection status
  get isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  // Add event listener with proper typing
  on<EventName extends keyof ServerToClientEvents>(
    event: EventName,
    callback: SocketEventHandler<ServerEventPayload<EventName>>
  ) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  // Remove all listeners for a specific event
  off<EventName extends keyof ServerToClientEvents>(
    event: EventName,
    callback?: SocketEventHandler<ServerEventPayload<EventName>>
  ) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback)
      } else {
        this.socket.off(event)
      }
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }
}

// Export singleton instance
export const socketManager = new SocketManager()

// Export types
export type { SocketManager }
