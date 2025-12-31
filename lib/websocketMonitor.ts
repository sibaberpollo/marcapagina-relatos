/**
 * WebSocket monitoring and metrics for corpse system
 */

import { CORPSE_CONFIG } from './corpseConfig'

export interface WebSocketMetrics {
  totalConnections: number
  activeConnections: number
  connectionEvents: {
    connected: number
    disconnected: number
    errors: number
  }
  roomMetrics: {
    totalRooms: number
    activeRooms: number
    roomConnections: Record<string, number>
  }
  eventMetrics: {
    [eventType: string]: {
      count: number
      errors: number
      avgResponseTime: number
    }
  }
  performanceMetrics: {
    uptime: number
    memoryUsage: NodeJS.MemoryUsage
    eventLoopLag: number
  }
}

class WebSocketMonitor {
  private metrics: WebSocketMetrics
  private startTime: number
  private eventTimers: Map<string, number>

  constructor() {
    this.metrics = {
      totalConnections: 0,
      activeConnections: 0,
      connectionEvents: {
        connected: 0,
        disconnected: 0,
        errors: 0,
      },
      roomMetrics: {
        totalRooms: 0,
        activeRooms: 0,
        roomConnections: {},
      },
      eventMetrics: {},
      performanceMetrics: {
        uptime: 0,
        memoryUsage: process.memoryUsage(),
        eventLoopLag: 0,
      },
    }
    this.startTime = Date.now()
    this.eventTimers = new Map()
  }

  /**
   * Record a new connection
   */
  recordConnection(socketId: string): void {
    this.metrics.totalConnections++
    this.metrics.activeConnections++
    this.metrics.connectionEvents.connected++
    console.log(`WebSocket connected: ${socketId}. Total active: ${this.metrics.activeConnections}`)
  }

  /**
   * Record a disconnection
   */
  recordDisconnection(socketId: string): void {
    this.metrics.activeConnections = Math.max(0, this.metrics.activeConnections - 1)
    this.metrics.connectionEvents.disconnected++
    console.log(
      `WebSocket disconnected: ${socketId}. Total active: ${this.metrics.activeConnections}`
    )
  }

  /**
   * Record a connection error
   */
  recordConnectionError(socketId: string, error: Error): void {
    this.metrics.connectionEvents.errors++
    console.error(`WebSocket connection error for ${socketId}:`, error.message)
  }

  /**
   * Record joining a room
   */
  recordRoomJoin(roomId: string, socketId: string): void {
    if (!this.metrics.roomMetrics.roomConnections[roomId]) {
      this.metrics.roomMetrics.roomConnections[roomId] = 0
      this.metrics.roomMetrics.totalRooms++
    }
    this.metrics.roomMetrics.roomConnections[roomId]++
    this.updateActiveRooms()
    console.log(
      `Socket ${socketId} joined room ${roomId}. Room connections: ${this.metrics.roomMetrics.roomConnections[roomId]}`
    )
  }

  /**
   * Record leaving a room
   */
  recordRoomLeave(roomId: string, socketId: string): void {
    if (this.metrics.roomMetrics.roomConnections[roomId]) {
      this.metrics.roomMetrics.roomConnections[roomId] = Math.max(
        0,
        this.metrics.roomMetrics.roomConnections[roomId] - 1
      )
      if (this.metrics.roomMetrics.roomConnections[roomId] === 0) {
        delete this.metrics.roomMetrics.roomConnections[roomId]
        this.metrics.roomMetrics.totalRooms = Math.max(0, this.metrics.roomMetrics.totalRooms - 1)
      }
      this.updateActiveRooms()
      console.log(
        `Socket ${socketId} left room ${roomId}. Room connections: ${this.metrics.roomMetrics.roomConnections[roomId] || 0}`
      )
    }
  }

  /**
   * Start timing an event
   */
  startEventTimer(eventId: string): void {
    this.eventTimers.set(eventId, Date.now())
  }

  /**
   * End timing an event and record metrics
   */
  endEventTimer(eventId: string, eventType: string, success: boolean = true): void {
    const startTime = this.eventTimers.get(eventId)
    if (startTime) {
      const duration = Date.now() - startTime
      this.eventTimers.delete(eventId)

      if (!this.metrics.eventMetrics[eventType]) {
        this.metrics.eventMetrics[eventType] = {
          count: 0,
          errors: 0,
          avgResponseTime: 0,
        }
      }

      const eventMetric = this.metrics.eventMetrics[eventType]
      eventMetric.count++

      if (!success) {
        eventMetric.errors++
      }

      // Update rolling average
      const totalTime = eventMetric.avgResponseTime * (eventMetric.count - 1) + duration
      eventMetric.avgResponseTime = totalTime / eventMetric.count

      console.log(
        `Event ${eventType} completed in ${duration}ms (avg: ${eventMetric.avgResponseTime.toFixed(2)}ms)`
      )
    }
  }

  /**
   * Record an event error
   */
  recordEventError(eventType: string, error: Error): void {
    if (!this.metrics.eventMetrics[eventType]) {
      this.metrics.eventMetrics[eventType] = {
        count: 0,
        errors: 0,
        avgResponseTime: 0,
      }
    }

    this.metrics.eventMetrics[eventType].errors++
    console.error(`Event ${eventType} error:`, error.message)
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(): void {
    this.metrics.performanceMetrics = {
      uptime: Date.now() - this.startTime,
      memoryUsage: process.memoryUsage(),
      eventLoopLag: this.measureEventLoopLag(),
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): WebSocketMetrics {
    this.updatePerformanceMetrics()
    return { ...this.metrics }
  }

  /**
   * Get metrics summary for logging
   */
  getMetricsSummary(): string {
    const metrics = this.getMetrics()
    return `WebSocket Metrics - Active: ${metrics.activeConnections}, Rooms: ${metrics.roomMetrics.activeRooms}, Events: ${Object.keys(metrics.eventMetrics).length}`
  }

  /**
   * Reset metrics (useful for testing or periodic resets)
   */
  resetMetrics(): void {
    this.metrics = {
      totalConnections: 0,
      activeConnections: this.metrics.activeConnections, // Keep active connections
      connectionEvents: {
        connected: 0,
        disconnected: 0,
        errors: 0,
      },
      roomMetrics: {
        totalRooms: this.metrics.roomMetrics.totalRooms,
        activeRooms: this.metrics.roomMetrics.activeRooms,
        roomConnections: { ...this.metrics.roomMetrics.roomConnections },
      },
      eventMetrics: {},
      performanceMetrics: {
        uptime: this.metrics.performanceMetrics.uptime,
        memoryUsage: process.memoryUsage(),
        eventLoopLag: 0,
      },
    }
    this.eventTimers.clear()
  }

  private updateActiveRooms(): void {
    this.metrics.roomMetrics.activeRooms = Object.values(
      this.metrics.roomMetrics.roomConnections
    ).filter((count) => count > 0).length
  }

  private measureEventLoopLag(): number {
    const start = process.hrtime.bigint()
    setImmediate(() => {
      const end = process.hrtime.bigint()
      return Number(end - start) / 1e6 // Convert to milliseconds
    })
    return 0 // Simplified for now
  }
}

// Singleton instance
export const wsMonitor = new WebSocketMonitor()

// Auto-update performance metrics every 30 seconds
if (CORPSE_CONFIG.WEBSOCKET_METRICS.ENABLED) {
  setInterval(() => {
    wsMonitor.updatePerformanceMetrics()
  }, 30000)
}
