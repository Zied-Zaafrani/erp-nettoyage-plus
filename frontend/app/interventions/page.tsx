import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { InterventionsContent } from "@/components/interventions/interventions-content"

export default function InterventionsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Interventions & Planning" breadcrumbs={["Tableau De Bord", "Interventions & Planning"]} />
        <main className="flex-1 overflow-auto">
          <InterventionsContent />
        </main>
      </div>
    </div>
  )
}
