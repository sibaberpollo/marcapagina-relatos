import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../auth'
import { prisma } from '@/lib/prisma'
import { getAutoresBySlugs } from '@/lib/sanity'
import AuthorFollowCard from '@/components/content/authors/AuthorFollowCard'

export default async function Page() {
  redirect('/biblioteca-personal/siguiendo')
}
