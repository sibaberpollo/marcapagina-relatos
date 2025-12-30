import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'
import { createAdapter } from '@socket.io/redis-adapter'
import { getRedisClient } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { corpseWorkflow } from '@/lib/corpseWorkflow'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if Socket.IO server is already initialized
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverSocket = res.socket as any
  if (serverSocket.server.io) {
    return res.end()
  }

  const httpServer: NetServer = serverSocket.server
  const io = new ServerIO(httpServer, {
    path: '/api/socket/io',
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  // Set up Redis adapter for multi-server scaling
  const pubClient = getRedisClient()
  const subClient = pubClient.duplicate()

  io.adapter(createAdapter(pubClient, subClient))

  // Store io instance on server
  serverSocket.server.io = io

  // Recover active timers on startup
  corpseWorkflow.recoverTimers(io)

  io.on('connection', (socket) => {
    wsMonitor.recordConnection(socket.id)
    console.log('User connected:', socket.id)

    // Join room for specific corpse
    socket.on('join-corpse', async (corpseId: string) => {
      const eventId = `join-corpse-${socket.id}-${Date.now()}`
      wsMonitor.startEventTimer(eventId)

      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
          socket.emit('error', 'Authentication required')
          wsMonitor.endEventTimer(eventId, 'join-corpse', false)
          return
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (!user) {
          socket.emit('error', 'User not found')
          wsMonitor.endEventTimer(eventId, 'join-corpse', false)
          return
        }

        // Use workflow to join corpse
        const result = await corpseWorkflow.joinCorpse(corpseId, user.id, io)
        if (!result.success) {
          socket.emit('error', result.error)
          wsMonitor.endEventTimer(eventId, 'join-corpse', false)
          return
        }

        // Join the room
        socket.join(corpseId)
        wsMonitor.recordRoomJoin(corpseId, socket.id)
        console.log(`User ${user.id} joined corpse room: ${corpseId}`)

        // Get current state and send to user
        const state = await corpseWorkflow.getCorpseState(corpseId)
        if (state) {
          socket.emit('room-state', state)
        }

        wsMonitor.endEventTimer(eventId, 'join-corpse', true)
      } catch (error) {
        console.error('Error joining corpse room:', error)
        socket.emit('error', 'Failed to join room')
        wsMonitor.recordEventError('join-corpse', error as Error)
        wsMonitor.endEventTimer(eventId, 'join-corpse', false)
      }
    })

    // Leave room
    socket.on('leave-corpse', (corpseId: string) => {
      socket.leave(corpseId)
      wsMonitor.recordRoomLeave(corpseId, socket.id)
      socket.to(corpseId).emit('user-left', socket.id)
      console.log(`User ${socket.id} left corpse room: ${corpseId}`)
    })

    // Handle segment submission
    socket.on('submit-segment', async (data: { corpseId: string; content: string }) => {
      const eventId = `submit-segment-${socket.id}-${Date.now()}`
      wsMonitor.startEventTimer(eventId)

      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
          socket.emit('error', 'Authentication required')
          wsMonitor.endEventTimer(eventId, 'submit-segment', false)
          return
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (!user) {
          socket.emit('error', 'User not found')
          wsMonitor.endEventTimer(eventId, 'submit-segment', false)
          return
        }

        const { corpseId, content } = data

        // Use workflow to submit segment
        const result = await corpseWorkflow.submitSegment(corpseId, user.id, content, io)
        if (!result.success) {
          socket.emit('error', result.error)
          wsMonitor.endEventTimer(eventId, 'submit-segment', false)
          return
        }

        // Check if corpse was completed by this submission
        const wasCompleted = await corpseWorkflow.checkCompletion(corpseId)
        if (wasCompleted) {
          io.to(corpseId).emit('status-updated', { status: 'completed' })
          console.log(`Corpse ${corpseId} completed by user ${user.id}`)
        }

        console.log(`Segment submitted for corpse ${corpseId} by user ${user.id}`)
        wsMonitor.endEventTimer(eventId, 'submit-segment', true)
      } catch (error) {
        console.error('Error submitting segment:', error)
        socket.emit('error', 'Failed to submit segment')
        wsMonitor.recordEventError('submit-segment', error as Error)
        wsMonitor.endEventTimer(eventId, 'submit-segment', false)
      }
    })

    // Handle skipping turn
    socket.on('skip-turn', async (corpseId: string) => {
      const eventId = `skip-turn-${socket.id}-${Date.now()}`
      wsMonitor.startEventTimer(eventId)

      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
          socket.emit('error', 'Authentication required')
          wsMonitor.endEventTimer(eventId, 'skip-turn', false)
          return
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (!user) {
          socket.emit('error', 'User not found')
          wsMonitor.endEventTimer(eventId, 'skip-turn', false)
          return
        }

        // Use workflow to skip turn
        const result = await corpseWorkflow.skipTurn(corpseId, user.id, io)
        if (!result.success) {
          socket.emit('error', result.error)
          wsMonitor.endEventTimer(eventId, 'skip-turn', false)
          return
        }

        console.log(`Turn skipped for user ${user.id} on corpse ${corpseId}`)
        wsMonitor.endEventTimer(eventId, 'skip-turn', true)
      } catch (error) {
        console.error('Error skipping turn:', error)
        socket.emit('error', 'Failed to skip turn')
        wsMonitor.recordEventError('skip-turn', error as Error)
        wsMonitor.endEventTimer(eventId, 'skip-turn', false)
      }
    })

    // Handle voting to end corpse
    socket.on('vote-to-end', async (corpseId: string) => {
      const eventId = `vote-to-end-${socket.id}-${Date.now()}`
      wsMonitor.startEventTimer(eventId)

      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
          socket.emit('error', 'Authentication required')
          wsMonitor.endEventTimer(eventId, 'vote-to-end', false)
          return
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (!user) {
          socket.emit('error', 'User not found')
          wsMonitor.endEventTimer(eventId, 'vote-to-end', false)
          return
        }

        // Use workflow to handle voting
        const result = await corpseWorkflow.voteToEnd(corpseId, user.id)
        if (!result.success) {
          socket.emit('error', result.error)
          wsMonitor.endEventTimer(eventId, 'vote-to-end', false)
          return
        }

        if (result.ended) {
          io.to(corpseId).emit('status-updated', { status: 'ended' })
        } else {
          io.to(corpseId).emit('queue-updated', {
            votesToEnd: result.votesToEnd!,
            totalAuthors: result.totalAuthors!,
            threshold: result.threshold!,
          })
        }

        console.log(`Vote submitted for corpse ${corpseId} by user ${user.id}`)
        wsMonitor.endEventTimer(eventId, 'vote-to-end', true)
      } catch (error) {
        console.error('Error voting to end:', error)
        socket.emit('error', 'Failed to vote')
        wsMonitor.recordEventError('vote-to-end', error as Error)
        wsMonitor.endEventTimer(eventId, 'vote-to-end', false)
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      wsMonitor.recordDisconnection(socket.id)
      console.log('User disconnected:', socket.id)
    })

    // Handle connection errors
    socket.on('error', (error) => {
      wsMonitor.recordConnectionError(socket.id, error)
    })
  })

  res.end()
}
