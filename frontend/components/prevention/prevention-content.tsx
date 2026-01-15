"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit2, Trash2, Eye, AlertTriangle } from "lucide-react"
import { PreventionDialog } from "./prevention-dialog"
import { PreventionDetailsDialog } from "./prevention-details-dialog"

interface PreventionPlan {
  id: string
  siteName: string
  clientName: string
  riskLevel: "basse" | "moyenne" | "haute"
  identifiedRisks: string[]
  preventiveMeasures: string[]
  requiredEPI: string[]
  safetyProtocols: string[]
  createdDate: string
  lastUpdated: string
  status: "actif" | "archivé"
}

const mockPlans: PreventionPlan[] = [
  {
    id: "1",
    siteName: "Bureau Principal ABC",
    clientName: "Entreprise ABC",
    riskLevel: "basse",
    identifiedRisks: ["Glissade sur sol mouillé", "Exposition aux produits chimiques"],
    preventiveMeasures: ["Signalisation sol mouillé", "Ventilation adéquate", "Stockage sécurisé des produits"],
    requiredEPI: ["Gants de protection", "Masque respiratoire", "Chaussures antidérapantes"],
    safetyProtocols: ["Vérifier la ventilation avant utilisation", "Utiliser les produits selon les instructions"],
    createdDate: "2024-01-15",
    lastUpdated: "2025-10-16",
    status: "actif",
  },
  {
    id: "2",
    siteName: "Entrepôt Logistique",
    clientName: "Entreprise ABC",
    riskLevel: "haute",
    identifiedRisks: ["Travail en hauteur", "Manutention de charges lourdes", "Machines en mouvement"],
    preventiveMeasures: ["Harnais de sécurité obligatoire", "Formation à la manutention", "Garde-corps installés"],
    requiredEPI: ["Harnais de sécurité", "Casque de protection", "Gants renforcés", "Chaussures de sécurité"],
    safetyProtocols: ["Inspection quotidienne des équipements", "Respect des zones interdites"],
    createdDate: "2023-06-01",
    lastUpdated: "2025-09-20",
    status: "actif",
  },
]

export function PreventionContent() {
  const [plans, setPlans] = useState<PreventionPlan[]>(mockPlans)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PreventionPlan | null>(null)
  const [editingPlan, setEditingPlan] = useState<PreventionPlan | null>(null)

  const filteredPlans = plans.filter(
    (plan) =>
      plan.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = [
    { label: "Total Plans", value: plans.length, color: "bg-blue-100 text-blue-700" },
    {
      label: "Plans Actifs",
      value: plans.filter((p) => p.status === "actif").length,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Risque Élevé",
      value: plans.filter((p) => p.riskLevel === "haute").length,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Mis à jour",
      value: plans.filter((p) => {
        const lastUpdate = new Date(p.lastUpdated)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        return lastUpdate > thirtyDaysAgo
      }).length,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  const handleAddPlan = (planData: Omit<PreventionPlan, "id">) => {
    if (editingPlan) {
      setPlans(plans.map((p) => (p.id === editingPlan.id ? { ...planData, id: p.id } : p)))
      setEditingPlan(null)
    } else {
      setPlans([...plans, { ...planData, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
  }

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id))
  }

  const handleEditPlan = (plan: PreventionPlan) => {
    setEditingPlan(plan)
    setIsDialogOpen(true)
  }

  const handleViewDetails = (plan: PreventionPlan) => {
    setSelectedPlan(plan)
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
            placeholder="Rechercher un plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            setEditingPlan(null)
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter Plan
        </Button>
      </div>

      {/* Plans Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Site</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Niveau de Risque</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Risques Identifiés</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">EPI Requis</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Mis à jour</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{plan.siteName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{plan.clientName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${
                        plan.riskLevel === "basse"
                          ? "bg-green-100 text-green-700"
                          : plan.riskLevel === "moyenne"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {plan.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{plan.identifiedRisks.length} risques</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{plan.requiredEPI.length} EPI</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(plan.lastUpdated).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(plan)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
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

      {/* Dialogs */}
      <PreventionDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingPlan(null)
        }}
        onSave={handleAddPlan}
        initialData={editingPlan || undefined}
      />
      <PreventionDetailsDialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} plan={selectedPlan} />
    </div>
  )
}
