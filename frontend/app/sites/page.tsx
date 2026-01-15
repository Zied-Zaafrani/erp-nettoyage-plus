import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SitesContent } from "@/components/sites/sites-content"

export default function SitesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Sites D'Intervention" breadcrumbs={["Tableau De Bord", "Sites D'Intervention"]} />
        <main className="flex-1 overflow-auto">
          <SitesContent />
        </main>
      </div>
    </div>
  )
}
