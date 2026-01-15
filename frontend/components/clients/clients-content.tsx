"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react"
import { ClientDialog } from "./client-dialog"
import { ClientDetailsDialog } from "./client-details-dialog"
import { useLanguage } from "../language-provider"
import { translations } from "@/lib/translations"

interface Client {
  id: string
  name: string
  type: "particulier" | "entreprise"
  email: string
  phone: string
  address: string
  status: "actif" | "suspendu" | "terminé"
  contractType: "permanent" | "ponctuel" | "mixte"
  contractStartDate: string
  contractEndDate?: string
  totalInterventions: number
  satisfaction: number
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Entreprise ABC",
    type: "entreprise",
    email: "contact@abc.com",
    phone: "+212 6 12 34 56 78",
    address: "123 Rue de la Paix, Casablanca",
    status: "actif",
    contractType: "permanent",
    contractStartDate: "2024-01-15",
    totalInterventions: 24,
    satisfaction: 4.8,
  },
  {
    id: "2",
    name: "Particulier - Ahmed",
    type: "particulier",
    email: "ahmed@email.com",
    phone: "+212 6 98 76 54 32",
    address: "456 Avenue Hassan II, Rabat",
    status: "actif",
    contractType: "ponctuel",
    contractStartDate: "2024-03-20",
    totalInterventions: 5,
    satisfaction: 4.5,
  },
  {
    id: "3",
    name: "Hôtel Royal",
    type: "entreprise",
    email: "admin@hotelroyal.com",
    phone: "+212 5 22 12 34 56",
    address: "789 Boulevard de la Corniche, Casablanca",
    status: "actif",
    contractType: "permanent",
    contractStartDate: "2023-06-01",
    totalInterventions: 52,
    satisfaction: 4.9,
  },
]

export function ClientsContent() {
  const { language } = useLanguage()
  const t = translations[language]
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = [
    { label: t.total + " " + t.clients, value: clients.length, color: "bg-blue-100 text-blue-700" },
    {
      label: t.activeClients,
      value: clients.filter((c) => c.status === "actif").length,
      color: "bg-green-100 text-green-700",
    },
    {
      label: language === "fr" ? "Contrats Permanents" : language === "ar" ? "العقود الدائمة" : "Permanent Contracts",
      value: clients.filter((c) => c.contractType === "permanent").length,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: language === "fr" ? "Satisfaction Moyenne" : language === "ar" ? "متوسط الرضا" : "Average Satisfaction",
      value: "4.7/5",
      color: "bg-yellow-100 text-yellow-700",
    },
  ]

  const handleAddClient = (clientData: Omit<Client, "id">) => {
    if (editingClient) {
      setClients(clients.map((c) => (c.id === editingClient.id ? { ...clientData, id: c.id } : c)))
      setEditingClient(null)
    } else {
      setClients([...clients, { ...clientData, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id))
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client)
    setIsDetailsOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${stat.color}`}>
              {stat.label}
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Search and Add Button */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={
              language === "fr"
                ? "Rechercher un client..."
                : language === "ar"
                  ? "البحث عن عميل..."
                  : "Search for a client..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            setEditingClient(null)
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.add} {t.clients}
        </Button>
      </div>

      {/* Clients Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  {language === "fr" ? "Nom" : language === "ar" ? "الاسم" : "Name"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  {language === "fr" ? "Type" : language === "ar" ? "النوع" : "Type"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t.email}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t.contractType}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t.status}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  {language === "fr" ? "Interventions" : language === "ar" ? "التدخلات" : "Interventions"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  {language === "fr" ? "Satisfaction" : language === "ar" ? "الرضا" : "Satisfaction"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{client.type}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{client.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        client.contractType === "permanent"
                          ? "bg-blue-100 text-blue-700"
                          : client.contractType === "ponctuel"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {client.contractType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        client.status === "actif"
                          ? "bg-green-100 text-green-700"
                          : client.status === "suspendu"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{client.totalInterventions}</td>
                  <td className="px-6 py-4 text-sm text-foreground">⭐ {client.satisfaction}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(client)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title={t.details}
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title={t.edit}
                      >
                        <Edit2 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialogs */}
      <ClientDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingClient(null)
        }}
        onSave={handleAddClient}
        initialData={editingClient || undefined}
      />
      <ClientDetailsDialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} client={selectedClient} />
    </div>
  )
}
