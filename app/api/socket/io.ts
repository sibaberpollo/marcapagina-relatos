import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'
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

  // Store io instance on server
  serverSocket.server.io = io

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Join room for specific corpse
    socket.on('join-corpse', async (corpseId: string) => {
      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
          socket.emit('error', 'Authentication required')
          return
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (!user) {
          socket.emit('error', 'User not found')
          return
        }

        // Use workflow to join corpse
        const result = await corpseWorkflow.joinCorpse(corpseId, user.id, io)
        if (!result.success) {
          socket.emit('error', result.error)
          return
        }

        // Join the room
        socket.join(corpseId)
        console.log(`User ${user.id} joined corpse room: ${corpseId}`)

        // Get current state and send to user
        const state = await corpseWorkflow.getCorpseState(corpseId)
        if (state) {
          socket.emit('room-state', state)
        }
      } catch (error) {
        console.error('Error joining corpse room:', error)
        socket.emit('error', 'Failed to join room')
      }
    })

    // Leave room
    socket.on('leave-corpse', (corpseId: string) => {
      socket.leave(corpseId)
      socket.to(corpseId).emit('user-left', socket.id)
      console.log(`User ${socket.id} left corpse room: ${corpseId}`)
    })

    // Handle segment submission
    socket.on('submit-segment', async (data: { corpseId: string; content: string }) => {
      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
          socket.emit('error', 'Authentication required')
          return
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (!user) {
          socket.emit('error', 'User not found')
          return
        }

        const { corpseId, content } = data

        // Use workflow to submit segment
        const result = await corpseWorkflow.submitSegment(corpseId, user.id, content, io)
        if (!result.success) {
          socket.emit('error', result.error)
          return
        }

        // Check if corpse was completed by this submission
        const wasCompleted = await corpseWorkflow.checkCompletion(corpseId)
        if (wasCompleted) {
          io.to(corpseId).emit('status-updated', { status: 'completed' })
          console.log(`Corpse ${corpseId} completed by user ${user.id}`)
        }

        console.log(`Segment submitted for corpse ${corpseId} by user ${user.id}`)
      } catch (error) {
        console.error('Error submitting segment:', error)
        socket.emit('error', 'Failed to submit segment')
      }
    })

    // Handle skipping turn
    socket.on('skip-turn', async (corpseId: string) => {
      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
          socket.emit('error', 'Authentication required')
          return
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (!user) {
          socket.emit('error', 'User not found')
          return
        }

        // Use workflow to skip turn
        const result = await corpseWorkflow.skipTurn(corpseId, user.id, io)
        if (!result.success) {
          socket.emit('error', result.error)
          return
        }

        console.log(`Turn skipped for user ${user.id} on corpse ${corpseId}`)
      } catch (error) {
        console.error('Error skipping turn:', error)
        socket.emit('error', 'Failed to skip turn')
      }
    })

    // Handle voting to end corpse
    socket.on('vote-to-end', async (corpseId: string) => {
      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
          socket.emit('error', 'Authentication required')
          return
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (!user) {
          socket.emit('error', 'User not found')
          return
        }

        // Use workflow to handle voting
        const result = await corpseWorkflow.voteToEnd(corpseId, user.id)
        if (!result.success) {
          socket.emit('error', result.error)
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
      } catch (error) {
        console.error('Error voting to end:', error)
        socket.emit('error', 'Failed to vote')
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  res.end()
}
