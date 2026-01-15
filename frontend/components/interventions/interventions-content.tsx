"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit2, Trash2, Eye, Calendar, Users } from "lucide-react"
import { InterventionDialog } from "./intervention-dialog"
import { InterventionDetailsDialog } from "./intervention-details-dialog"
import { CalendarView } from "./calendar-view"

interface Intervention {
  id: string
  siteName: string
  clientName: string
  type: "permanent" | "ponctuel"
  date: string
  startTime: string
  endTime: string
  agents: string[]
  status: "planifiée" | "en-cours" | "complétée" | "annulée"
  description: string
  priority: "basse" | "normale" | "haute"
  estimatedDuration: number
}

const mockInterventions: Intervention[] = [
  {
    id: "1",
    siteName: "Bureau Principal ABC",
    clientName: "Entreprise ABC",
    type: "permanent",
    date: "2025-10-17",
    startTime: "18:00",
    endTime: "20:00",
    agents: ["Ahmed", "Fatima"],
    status: "planifiée",
    description: "Nettoyage complet des bureaux et sanitaires",
    priority: "normale",
    estimatedDuration: 120,
  },
  {
    id: "2",
    siteName: "Entrepôt Logistique",
    clientName: "Entreprise ABC",
    type: "permanent",
    date: "2025-10-18",
    startTime: "08:00",
    endTime: "12:00",
    agents: ["Hassan", "Maryam"],
    status: "planifiée",
    description: "Nettoyage sol et zones de stockage",
    priority: "normale",
    estimatedDuration: 240,
  },
  {
    id: "3",
    siteName: "Chambre Particulier",
    clientName: "Particulier - Ahmed",
    type: "ponctuel",
    date: "2025-10-20",
    startTime: "10:00",
    endTime: "12:00",
    agents: ["Karim"],
    status: "planifiée",
    description: "Nettoyage complet + vitres + terrasse",
    priority: "haute",
    estimatedDuration: 120,
  },
]

export function InterventionsContent() {
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null)
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null)

  const filteredInterventions = interventions.filter(
    (intervention) =>
      intervention.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = [
    { label: "Total Interventions", value: interventions.length, color: "bg-blue-100 text-blue-700" },
    {
      label: "Planifiées",
      value: interventions.filter((i) => i.status === "planifiée").length,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Complétées",
      value: interventions.filter((i) => i.status === "complétée").length,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Permanentes",
      value: interventions.filter((i) => i.type === "permanent").length,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  const handleAddIntervention = (interventionData: Omit<Intervention, "id">) => {
    if (editingIntervention) {
      setInterventions(
        interventions.map((i) => (i.id === editingIntervention.id ? { ...interventionData, id: i.id } : i)),
      )
      setEditingIntervention(null)
    } else {
      setInterventions([...interventions, { ...interventionData, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteIntervention = (id: string) => {
    setInterventions(interventions.filter((i) => i.id !== id))
  }

  const handleEditIntervention = (intervention: Intervention) => {
    setEditingIntervention(intervention)
    setIsDialogOpen(true)
  }

  const handleViewDetails = (intervention: Intervention) => {
    setSelectedIntervention(intervention)
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

      {/* Search and Controls */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher une intervention..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Liste
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Calendrier
          </Button>
        </div>
        <Button
          onClick={() => {
            setEditingIntervention(null)
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {/* View Mode */}
      {viewMode === "list" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Site</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Horaire</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Agents</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInterventions.map((intervention) => (
                  <tr key={intervention.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{intervention.siteName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{intervention.clientName}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(intervention.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {intervention.startTime} - {intervention.endTime}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          intervention.type === "permanent"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {intervention.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{intervention.agents.join(", ")}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          intervention.status === "planifiée"
                            ? "bg-yellow-100 text-yellow-700"
                            : intervention.status === "en-cours"
                              ? "bg-blue-100 text-blue-700"
                              : intervention.status === "complétée"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {intervention.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(intervention)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleEditIntervention(intervention)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4 text-amber-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteIntervention(intervention.id)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Supprimer"
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
      ) : (
        <CalendarView interventions={filteredInterventions} />
      )}

      {/* Dialogs */}
      <InterventionDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingIntervention(null)
        }}
        onSave={handleAddIntervention}
        initialData={editingIntervention || undefined}
      />
      <InterventionDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        intervention={selectedIntervention}
      />
    </div>
  )
}
