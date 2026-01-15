"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"

interface UsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: any
}

export function UsersDialog({ open, onOpenChange, onSubmit, initialData }: UsersDialogProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Agent",
    password: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        password: "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "Agent",
        password: "",
      })
    }
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", email: "", role: "Agent", password: "" })
  }

  const dialogTitle = initialData
    ? language === "fr"
      ? "Modifier l'Utilisateur"
      : language === "ar"
        ? "تعديل المستخدم"
        : "Edit User"
    : language === "fr"
      ? "Ajouter un Utilisateur"
      : language === "ar"
        ? "إضافة مستخدم"
        : "Add User"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {language === "fr"
              ? "Remplissez les informations de l'utilisateur"
              : language === "ar"
                ? "ملء معلومات المستخدم"
                : "Fill in the user information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{language === "fr" ? "Nom" : language === "ar" ? "الاسم" : "Name"}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">{language === "fr" ? "Rôle" : language === "ar" ? "الدور" : "Role"}</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Superviseur">
                  {language === "fr" ? "Superviseur" : language === "ar" ? "المشرف" : "Supervisor"}
                </SelectItem>
                <SelectItem value="Agent">
                  {language === "fr" ? "Agent" : language === "ar" ? "وكيل" : "Agent"}
                </SelectItem>
                <SelectItem value="Comptable">
                  {language === "fr" ? "Comptable" : language === "ar" ? "محاسب" : "Accountant"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!initialData && (
            <div>
              <Label htmlFor="password">
                {language === "fr" ? "Mot de passe" : language === "ar" ? "كلمة المرور" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit">{t.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
