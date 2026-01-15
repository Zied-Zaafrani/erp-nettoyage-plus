"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
}

interface UsersDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function UsersDetailsDialog({ open, onOpenChange, user }: UsersDetailsDialogProps) {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === "fr" ? "Détails de l'Utilisateur" : language === "ar" ? "تفاصيل المستخدم" : "User Details"}
          </DialogTitle>
          <DialogDescription>{user.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground">
              {language === "fr" ? "Nom" : language === "ar" ? "الاسم" : "Name"}
            </label>
            <p className="text-base mt-1">{user.name}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground">{t.email}</label>
            <p className="text-base mt-1">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground">
              {language === "fr" ? "Rôle" : language === "ar" ? "الدور" : "Role"}
            </label>
            <p className="text-base mt-1">{user.role}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground">{t.status}</label>
            <div className="mt-1">
              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                {user.status === "active"
                  ? language === "fr"
                    ? "Actif"
                    : language === "ar"
                      ? "نشط"
                      : "Active"
                  : language === "fr"
                    ? "Inactif"
                    : language === "ar"
                      ? "غير نشط"
                      : "Inactive"}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground">
              {language === "fr" ? "Dernière Connexion" : language === "ar" ? "آخر تسجيل دخول" : "Last Login"}
            </label>
            <p className="text-base mt-1">{user.lastLogin}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
