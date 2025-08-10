import MiAreaHeader from './MiAreaHeader'
import MiAreaSidebar from './MiAreaSidebar'
import { ReactNode } from 'react'

export default function MiAreaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <MiAreaHeader />
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 py-4">
          <aside className="md:sticky md:top-0 self-start">
            <MiAreaSidebar />
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}


