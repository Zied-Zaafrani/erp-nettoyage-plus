"use client"

import { Search, Globe, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "./language-provider"
import { translations, type Language } from "@/lib/translations"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const t = translations[language]

  const getBreadcrumbLabel = () => {
    if (pathname.includes("personnel")) return t.personnel
    if (pathname.includes("clients")) return t.clients
    if (pathname.includes("sites")) return t.sites
    if (pathname.includes("interventions")) return t.interventions
    if (pathname.includes("prevention")) return t.prevention
    if (pathname.includes("qualite")) return t.qualite
    if (pathname.includes("stock")) return t.stock
    if (pathname.includes("users")) return t.users
    if (pathname.includes("settings")) return t.settings
    return t.dashboard
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const languageOptions: { code: Language; label: string }[] = [
    { code: "fr", label: "Français" },
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
  ]

  return (
    <header className="bg-white border-b border-border">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold">N+</span>
          <span>›</span>
          <span>{getBreadcrumbLabel()}</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="text" placeholder={t.searchUser} className="pl-10 bg-muted border-0" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Globe className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {language.toUpperCase()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languageOptions.map((option) => (
                <DropdownMenuItem
                  key={option.code}
                  onClick={() => setLanguage(option.code)}
                  className={language === option.code ? "bg-muted" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{user?.firstName || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user?.firstName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
