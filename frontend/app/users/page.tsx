"use client"

import { Header } from "@/components/header"
import { UsersContent } from "@/components/users/users-content"

export default function UsersPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Utilisateurs" breadcrumbs={[{ label: "Utilisateurs", href: "/users" }]} />
      <UsersContent />
    </div>
  )
}
