"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { ContractPrintDialog } from "./contract-print-dialog"
import { Printer } from "lucide-react"
import { useLanguage } from "../language-provider"
import { translations } from "@/lib/translations"
import { useState } from "react"

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

interface ClientDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
}

export function ClientDetailsDialog({ isOpen, onClose, client }: ClientDetailsDialogProps) {
  const [isPrintOpen, setIsPrintOpen] = useState(false)
  const { language } = useLanguage()
  const t = translations[language]

  if (!isOpen || !client) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
            <h2 className="text-xl font-bold text-foreground">
              {language === "fr" ? "Détails du Client" : language === "ar" ? "تفاصيل العميل" : "Client Details"}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Client Info */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Informations Générales</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="text-foreground font-medium">{client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-foreground font-medium capitalize">{client.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="text-foreground font-medium">{client.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="text-foreground font-medium">{client.address}</p>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informations de Contrat</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type de Contrat</p>
                  <p className="text-foreground font-medium capitalize">{client.contractType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      client.status === "actif"
                        ? "bg-green-100 text-green-700"
                        : client.status === "suspendu"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date Début</p>
                  <p className="text-foreground font-medium">
                    {new Date(client.contractStartDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                {client.contractEndDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date Fin</p>
                    <p className="text-foreground font-medium">
                      {new Date(client.contractEndDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Interventions</p>
                  <p className="text-2xl font-bold text-blue-700">{client.totalInterventions}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold text-yellow-700">⭐ {client.satisfaction}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button onClick={() => setIsPrintOpen(true)} className="flex-1 gap-2">
                <Printer className="w-4 h-4" />
                {language === "fr" ? "Imprimer le Contrat" : language === "ar" ? "طباعة العقد" : "Print Contract"}
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                {language === "fr" ? "Fermer" : language === "ar" ? "إغلاق" : "Close"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Contract Print Dialog */}
      <ContractPrintDialog isOpen={isPrintOpen} onClose={() => setIsPrintOpen(false)} client={client} />
    </>
  )
}
