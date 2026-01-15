import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"
import { ProtectedRoute } from "@/components/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-muted">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-auto">
            <DashboardContent />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
