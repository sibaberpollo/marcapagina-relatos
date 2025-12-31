'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCorpseSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100, 'El título es demasiado largo'),
  promptId: z.string().optional(),
  maxContributors: z.coerce
    .number()
    .min(7, 'Mínimo 7 colaboradores')
    .max(10, 'Máximo 10 colaboradores'),
})

export async function createExquisiteCorpse(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return {
        success: false,
        errors: { general: 'Debes iniciar sesión para crear una micronarrativa' },
      }
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return {
        success: false,
        errors: { general: 'Usuario no encontrado' },
      }
    }

    const rawData = {
      title: formData.get('title')?.toString() || '',
      promptId: formData.get('promptId')?.toString() || undefined,
      maxContributors: formData.get('maxContributors')?.toString() || '7',
    }

    // Validate input
    const validationResult = createCorpseSchema.safeParse(rawData)

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.errors.forEach((error) => {
        const field = error.path[0] as string
        errors[field] = error.message
      })
      return { success: false, errors }
    }

    const { title, promptId, maxContributors } = validationResult.data

    // Create the exquisite corpse
    const corpse = await prisma.exquisiteCorpse.create({
      data: {
        title,
        prompt: promptId || null,
        maxContributors,
      },
    })

    // Add the creator as the first author
    await prisma.corpseAuthor.create({
      data: {
        corpseId: corpse.id,
        userId: user.id,
        hasContributed: false, // Creator hasn't contributed yet
      },
    })

    // Revalidate the relevant paths
    revalidatePath('/micronarrativas')
    revalidatePath(`/micronarrativas/${corpse.id}`)

    return {
      success: true,
      corpseId: corpse.id,
    }
  } catch (error) {
    console.error('Error creating exquisite corpse:', error)
    return {
      success: false,
      errors: { general: 'Error interno del servidor. Inténtalo de nuevo.' },
    }
  }
}
