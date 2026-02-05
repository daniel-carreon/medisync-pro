import { Sidebar } from '@/shared/components/Sidebar'
import { AppHeader } from '@/shared/components/AppHeader'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:ml-64">
        <AppHeader />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
