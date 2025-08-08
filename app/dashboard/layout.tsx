import './dashboard-styles.css'
import { SessionProvider } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-container">
      <SessionProvider>
        {children}
      </SessionProvider>
    </div>
  )
}