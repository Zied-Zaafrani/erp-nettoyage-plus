import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PreventionContent } from "@/components/prevention/prevention-content"

export default function PreventionPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Plan De Prévention" breadcrumbs={["Tableau De Bord", "Plan De Prévention"]} />
        <main className="flex-1 overflow-auto">
          <PreventionContent />
        </main>
      </div>
    </div>
  )
}
