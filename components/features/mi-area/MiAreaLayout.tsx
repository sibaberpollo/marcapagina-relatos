import MiAreaHeader from './MiAreaHeader'
// import MiAreaSidebar from './MiAreaSidebar'
import { ReactNode } from 'react'

export default function MiAreaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <MiAreaHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <main className="py-6">{children}</main>
      </div>
    </div>
  )
}
