"use client"

import { Header } from "@/components/header"
import { SettingsContent } from "@/components/settings/settings-content"

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Paramètres" breadcrumbs={[{ label: "Paramètres", href: "/settings" }]} />
      <SettingsContent />
    </div>
  )
}
