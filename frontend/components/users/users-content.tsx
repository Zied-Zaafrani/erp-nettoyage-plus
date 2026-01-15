"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"
import { UsersDialog } from "./users-dialog"
import { UsersDetailsDialog } from "./users-details-dialog"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Bennani",
    email: "ahmed@nettoyageplus.com",
    role: "Admin",
    status: "active",
    lastLogin: "2025-10-17",
  },
  {
    id: "2",
    name: "Fatima Alaoui",
    email: "fatima@nettoyageplus.com",
    role: "Superviseur",
    status: "active",
    lastLogin: "2025-10-16",
  },
  {
    id: "3",
    name: "Mohammed Idrissi",
    email: "mohammed@nettoyageplus.com",
    role: "Agent",
    status: "active",
    lastLogin: "2025-10-17",
  },
  {
    id: "4",
    name: "Layla Mansouri",
    email: "layla@nettoyageplus.com",
    role: "Comptable",
    status: "inactive",
    lastLogin: "2025-10-10",
  },
]

export function UsersContent() {
  const { language } = useLanguage()
  const t = translations[language]
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = (data: any) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      status: "active",
      lastLogin: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, newUser])
    setIsDialogOpen(false)
  }

  const handleEditUser = (data: any) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)))
      setEditingUser(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const handleEditClick = (user: User) => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  return (
    <main className="flex-1 p-8 bg-background">
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">
              {language === "fr" ? "Total Utilisateurs" : language === "ar" ? "إجمالي المستخدمين" : "Total Users"}
            </div>
            <div className="text-3xl font-bold mt-2">{users.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">
              {language === "fr" ? "Actifs" : language === "ar" ? "نشطون" : "Active"}
            </div>
            <div className="text-3xl font-bold mt-2">{users.filter((u) => u.status === "active").length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">
              {language === "fr" ? "Inactifs" : language === "ar" ? "غير نشطين" : "Inactive"}
            </div>
            <div className="text-3xl font-bold mt-2">{users.filter((u) => u.status === "inactive").length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">
              {language === "fr" ? "Administrateurs" : language === "ar" ? "المسؤولون" : "Administrators"}
            </div>
            <div className="text-3xl font-bold mt-2">{users.filter((u) => u.role === "Admin").length}</div>
          </Card>
        </div>

        {/* Users List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {language === "fr" ? "Liste des Utilisateurs" : language === "ar" ? "قائمة المستخدمين" : "Users List"}
            </h2>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              {t.add}
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t.searchUser}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">
                    {language === "fr" ? "Nom" : language === "ar" ? "الاسم" : "Name"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    {language === "fr" ? "Email" : language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    {language === "fr" ? "Rôle" : language === "ar" ? "الدور" : "Role"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">{t.status}</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    {language === "fr" ? "Dernière Connexion" : language === "ar" ? "آخر تسجيل دخول" : "Last Login"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4">
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
                    </td>
                    <td className="py-3 px-4">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                          title={t.details}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                          title={t.edit}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <UsersDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        initialData={editingUser}
      />

      {selectedUser && <UsersDetailsDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} user={selectedUser} />}
    </main>
  )
}
