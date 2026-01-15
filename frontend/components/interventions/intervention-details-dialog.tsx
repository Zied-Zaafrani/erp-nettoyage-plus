"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Clock, Users, AlertCircle } from "lucide-react"

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

interface InterventionDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  intervention: Intervention | null
}

export function InterventionDetailsDialog({ isOpen, onClose, intervention }: InterventionDetailsDialogProps) {
  if (!isOpen || !intervention) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">Détails de l'Intervention</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations Générales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Site</p>
                <p className="text-foreground font-medium">{intervention.siteName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="text-foreground font-medium">{intervention.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="text-foreground font-medium capitalize">{intervention.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
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
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Planning
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-foreground font-medium">{new Date(intervention.date).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horaire</p>
                <p className="text-foreground font-medium">
                  {intervention.startTime} - {intervention.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Durée Estimée</p>
                <p className="text-foreground font-medium">{intervention.estimatedDuration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priorité</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    intervention.priority === "basse"
                      ? "bg-green-100 text-green-700"
                      : intervention.priority === "normale"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {intervention.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Agents */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Agents Assignés
            </h3>
            <div className="flex flex-wrap gap-2">
              {intervention.agents.map((agent) => (
                <div key={agent} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {agent}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Description
            </h3>
            <p className="text-foreground">{intervention.description}</p>
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
