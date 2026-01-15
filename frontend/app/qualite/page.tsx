import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { QualityContent } from "@/components/quality/quality-content"

export default function QualityPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Contrôle Qualité" breadcrumbs={["Tableau De Bord", "Contrôle Qualité"]} />
        <main className="flex-1 overflow-auto">
          <QualityContent />
        </main>
      </div>
    </div>
  )
}
