"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit2, Trash2, Eye, CheckCircle, AlertCircle } from "lucide-react"
import { QualityDialog } from "./quality-dialog"
import { QualityDetailsDialog } from "./quality-details-dialog"

interface QualityReport {
  id: string
  interventionId: string
  siteName: string
  inspectorName: string
  inspectionDate: string
  interventionType: "permanent" | "ponctuel"
  conformityScore: number
  status: "conforme" | "non-conforme" | "conforme-avec-remarques"
  checklist: ChecklistItem[]
  nonConformities: string[]
  correctionPlan: string
  photos: string[]
  comments: string
}

interface ChecklistItem {
  id: string
  item: string
  checked: boolean
}

const mockReports: QualityReport[] = [
  {
    id: "1",
    interventionId: "1",
    siteName: "Bureau Principal ABC",
    inspectorName: "Supervisor Ahmed",
    inspectionDate: "2025-10-16",
    interventionType: "permanent",
    conformityScore: 95,
    status: "conforme",
    checklist: [
      { id: "1", item: "Sols nettoyés et secs", checked: true },
      { id: "2", item: "Sanitaires propres", checked: true },
      { id: "3", item: "Bureaux organisés", checked: true },
      { id: "4", item: "Poubelles vidées", checked: true },
    ],
    nonConformities: [],
    correctionPlan: "",
    photos: [],
    comments: "Intervention réalisée selon les standards",
  },
  {
    id: "2",
    interventionId: "2",
    siteName: "Entrepôt Logistique",
    inspectorName: "Supervisor Fatima",
    inspectionDate: "2025-10-15",
    interventionType: "permanent",
    conformityScore: 85,
    status: "conforme-avec-remarques",
    checklist: [
      { id: "1", item: "Sols nettoyés", checked: true },
      { id: "2", item: "Zones de stockage organisées", checked: true },
      { id: "3", item: "Déchets évacués", checked: true },
      { id: "4", item: "Signalisation en place", checked: false },
    ],
    nonConformities: ["Signalisation manquante dans zone C"],
    correctionPlan: "Installer signalisation dans zone C avant prochaine intervention",
    photos: [],
    comments: "Bon travail global, petite amélioration nécessaire",
  },
]

export function QualityContent() {
  const [reports, setReports] = useState<QualityReport[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<QualityReport | null>(null)
  const [editingReport, setEditingReport] = useState<QualityReport | null>(null)

  const filteredReports = reports.filter(
    (report) =>
      report.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = [
    { label: "Total Inspections", value: reports.length, color: "bg-blue-100 text-blue-700" },
    {
      label: "Conformes",
      value: reports.filter((r) => r.status === "conforme").length,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Non-Conformes",
      value: reports.filter((r) => r.status === "non-conforme").length,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Score Moyen",
      value: `${Math.round(reports.reduce((acc, r) => acc + r.conformityScore, 0) / reports.length)}%`,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  const handleAddReport = (reportData: Omit<QualityReport, "id">) => {
    if (editingReport) {
      setReports(reports.map((r) => (r.id === editingReport.id ? { ...reportData, id: r.id } : r)))
      setEditingReport(null)
    } else {
      setReports([...reports, { ...reportData, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id))
  }

  const handleEditReport = (report: QualityReport) => {
    setEditingReport(report)
    setIsDialogOpen(true)
  }

  const handleViewDetails = (report: QualityReport) => {
    setSelectedReport(report)
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
            placeholder="Rechercher un rapport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            setEditingReport(null)
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter Rapport
        </Button>
      </div>

      {/* Reports Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Site</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Inspecteur</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{report.siteName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{report.inspectorName}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(report.inspectionDate).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        report.interventionType === "permanent"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {report.interventionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{report.conformityScore}%</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${
                        report.status === "conforme"
                          ? "bg-green-100 text-green-700"
                          : report.status === "conforme-avec-remarques"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.status === "conforme" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditReport(report)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
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
      <QualityDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingReport(null)
        }}
        onSave={handleAddReport}
        initialData={editingReport || undefined}
      />
      <QualityDetailsDialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} report={selectedReport} />
    </div>
  )
}
