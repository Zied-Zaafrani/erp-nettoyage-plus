"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, AlertTriangle, Shield, CheckCircle } from "lucide-react"

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

interface PreventionDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  plan: PreventionPlan | null
}

export function PreventionDetailsDialog({ isOpen, onClose, plan }: PreventionDetailsDialogProps) {
  if (!isOpen || !plan) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">Plan de Prévention - {plan.siteName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Site</p>
                <p className="text-foreground font-medium">{plan.siteName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="text-foreground font-medium">{plan.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niveau de Risque</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${
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
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                  {plan.status}
                </span>
              </div>
            </div>
          </div>

          {/* Identified Risks */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Risques Identifiés
            </h3>
            <div className="space-y-2">
              {plan.identifiedRisks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{risk}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preventive Measures */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Mesures Préventives
            </h3>
            <div className="space-y-2">
              {plan.preventiveMeasures.map((measure, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{measure}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Required EPI */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">EPI Requis</h3>
            <div className="grid grid-cols-2 gap-2">
              {plan.requiredEPI.map((epi, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-foreground text-sm">{epi}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Protocols */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Protocoles de Sécurité</h3>
            <div className="space-y-2">
              {plan.safetyProtocols.map((protocol, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{protocol}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Créé le</p>
                <p className="text-foreground font-medium">{new Date(plan.createdDate).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mis à jour le</p>
                <p className="text-foreground font-medium">{new Date(plan.lastUpdated).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          </div>

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
