import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StockContent } from "@/components/stock/stock-content"

export default function StockPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Stock & Matériel" breadcrumbs={["Tableau De Bord", "Stock & Matériel"]} />
        <main className="flex-1 overflow-auto">
          <StockContent />
        </main>
      </div>
    </div>
  )
}
