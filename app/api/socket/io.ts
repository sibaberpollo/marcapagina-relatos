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

        // Update vote
        await prisma.corpseAuthor.updateMany({
          where: { corpseId, userId: user.id },
          data: { voteToEnd: true },
        })

        // Check if majority threshold reached (60%)
        const corpse = await prisma.exquisiteCorpse.findUnique({
          where: { id: corpseId },
          include: { authors: true },
        })

        if (!corpse) {
          socket.emit('error', 'Corpse not found')
          return
        }

        const totalAuthors = corpse.authors.length
        const votesToEnd = corpse.authors.filter((author) => author.voteToEnd).length
        const threshold = Math.ceil(totalAuthors * 0.6)

        if (votesToEnd >= threshold) {
          // End the corpse
          await prisma.exquisiteCorpse.update({
            where: { id: corpseId },
            data: {
              status: 'ended',
              endedAt: new Date(),
            },
          })

          // Clean up workflow resources
          corpseWorkflow.cleanupCorpse(corpseId)

          io.to(corpseId).emit('status-updated', { status: 'ended' })
          console.log(`Corpse ${corpseId} ended by majority vote`)
        } else {
          // Update queue
          io.to(corpseId).emit('queue-updated', {
            votesToEnd,
            totalAuthors,
            threshold,
          })
        }
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
