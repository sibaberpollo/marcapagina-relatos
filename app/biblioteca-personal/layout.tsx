import MiAreaLayout from '@/components/features/mi-area/MiAreaLayout'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <MiAreaLayout>{children}</MiAreaLayout>
}
