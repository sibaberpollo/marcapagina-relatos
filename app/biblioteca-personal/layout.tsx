import MiAreaLayout from '@/components/mi-area/MiAreaLayout'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <MiAreaLayout>{children}</MiAreaLayout>
}



