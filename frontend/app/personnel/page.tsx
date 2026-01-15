"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PersonnelContent } from "@/components/personnel/personnel-content"

export default function PersonnelPage() {
  return (
    <div className="flex h-screen bg-muted">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto">
          <PersonnelContent />
        </main>
      </div>
    </div>
  )
}
