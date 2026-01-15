import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ClientsContent } from "@/components/clients/clients-content"

export default function ClientsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Clients & Contrats" breadcrumbs={["Tableau De Bord", "Clients & Contrats"]} />
        <main className="flex-1 overflow-auto">
          <ClientsContent />
        </main>
      </div>
    </div>
  )
}
