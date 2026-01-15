"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, CheckCircle, AlertCircle } from "lucide-react"

interface ChecklistItem {
  id: string
  item: string
  checked: boolean
}

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

interface QualityDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  report: QualityReport | null
}

export function QualityDetailsDialog({ isOpen, onClose, report }: QualityDetailsDialogProps) {
  if (!isOpen || !report) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">Rapport de Qualité - {report.siteName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Site</p>
                <p className="text-foreground font-medium">{report.siteName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inspecteur</p>
                <p className="text-foreground font-medium">{report.inspectorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'Inspection</p>
                <p className="text-foreground font-medium">
                  {new Date(report.inspectionDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type d'Intervention</p>
                <p className="text-foreground font-medium capitalize">{report.interventionType}</p>
              </div>
            </div>
          </div>

          {/* Score and Status */}
          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Score de Conformité</p>
                <p className="text-3xl font-bold text-blue-700">{report.conformityScore}%</p>
              </div>
              <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  report.status === "conforme"
                    ? "bg-green-50"
                    : report.status === "conforme-avec-remarques"
                      ? "bg-yellow-50"
                      : "bg-red-50"
                }`}
              >
                {report.status === "conforme" ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p
                    className={`font-bold ${
                      report.status === "conforme"
                        ? "text-green-700"
                        : report.status === "conforme-avec-remarques"
                          ? "text-yellow-700"
                          : "text-red-700"
                    }`}
                  >
                    {report.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Checklist</h3>
            <div className="space-y-2">
              {report.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {item.checked ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={item.checked ? "line-through text-muted-foreground" : "text-foreground"}>
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Conformities */}
          {report.nonConformities.length > 0 && (
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Non-Conformités
              </h3>
              <div className="space-y-2">
                {report.nonConformities.map((nc, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-foreground">{nc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correction Plan */}
          {report.correctionPlan && (
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Plan de Correction</h3>
              <p className="text-foreground bg-blue-50 p-4 rounded-lg">{report.correctionPlan}</p>
            </div>
          )}

          {/* Comments */}
          {report.comments && (
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Commentaires</h3>
              <p className="text-foreground">{report.comments}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={onClose} className="flex-1">
              Fermer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
