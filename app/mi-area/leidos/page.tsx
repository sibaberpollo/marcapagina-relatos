import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../auth'

export default async function Page() {
  redirect('/biblioteca-personal')
}
