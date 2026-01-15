"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, MapPin, Phone, User } from "lucide-react"

interface Site {
  id: string
  name: string
  address: string
  city: string
  postalCode: string
  clientName: string
  interventionType: "permanent" | "ponctuel"
  schedule: string
  requirements: string
  contactPerson: string
  contactPhone: string
  status: "actif" | "inactif" | "maintenance"
  lastIntervention: string
  nextIntervention: string
}

interface SiteDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  site: Site | null
}

export function SiteDetailsDialog({ isOpen, onClose, site }: SiteDetailsDialogProps) {
  if (!isOpen || !site) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">Détails du Site</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Site Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Informations du Site
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="text-foreground font-medium">{site.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="text-foreground font-medium">{site.clientName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="text-foreground font-medium">
                  {site.address}, {site.postalCode} {site.city}
                </p>
              </div>
            </div>
          </div>

          {/* Intervention Info */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations d'Intervention</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type d'Intervention</p>
                <p className="text-foreground font-medium capitalize">{site.interventionType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    site.status === "actif"
                      ? "bg-green-100 text-green-700"
                      : site.status === "inactif"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {site.status}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Horaire/Planning</p>
                <p className="text-foreground font-medium">{site.schedule}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Exigences</p>
                <p className="text-foreground font-medium">{site.requirements}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personne de Contact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="text-foreground font-medium">{site.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="text-foreground font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {site.contactPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Intervention History */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Historique d'Interventions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Dernière Intervention</p>
                <p className="text-foreground font-medium">
                  {new Date(site.lastIntervention).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Prochaine Intervention</p>
                <p className="text-foreground font-medium">
                  {new Date(site.nextIntervention).toLocaleDateString("fr-FR")}
                </p>
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
