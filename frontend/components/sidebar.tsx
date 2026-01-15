"use client"

import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  ClipboardCheck,
  Badge,
  ShieldCheck,
  Package,
  UserCog,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useLanguage } from "./language-provider"
import { translations } from "@/lib/translations"

export function Sidebar() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = translations[language]
  const [activeItem, setActiveItem] = useState(pathname.includes("personnel") ? "personnel" : "dashboard")

  const mainMenuItems = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard, href: "/" },
    { id: "clients", label: t.clients, icon: Users, href: "/clients" },
    { id: "sites", label: t.sites, icon: Building2, href: "/sites" },
    { id: "interventions", label: t.interventions, icon: Calendar, href: "/interventions" },
    { id: "prevention", label: t.prevention, icon: ClipboardCheck, href: "/prevention" },
    { id: "personnel", label: t.personnel, icon: Badge, href: "/personnel" },
    { id: "qualite", label: t.qualite, icon: ShieldCheck, href: "/qualite" },
    { id: "stock", label: t.stock, icon: Package, href: "/stock" },
  ]

  const bottomMenuItems = [
    { id: "users", label: t.users, icon: UserCog, href: "/users" },
    { id: "settings", label: t.settings, icon: Settings, href: "/settings" },
  ]

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col items-center gap-2">
          <Image src="/logo.png" alt="Nettoyage Plus" width={60} height={60} className="object-contain" />
          <h1 className="text-lg font-bold text-foreground text-center">Nettoyage Plus</h1>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveItem(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-border p-4 space-y-2">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-foreground hover:bg-muted/50 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
