"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit2, Trash2, Eye, MapPin } from "lucide-react"
import { SiteDialog } from "./site-dialog"
import { SiteDetailsDialog } from "./site-details-dialog"

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

const mockSites: Site[] = [
  {
    id: "1",
    name: "Bureau Principal ABC",
    address: "123 Rue de la Paix",
    city: "Casablanca",
    postalCode: "20000",
    clientName: "Entreprise ABC",
    interventionType: "permanent",
    schedule: "Lundi-Vendredi, 18h-20h",
    requirements: "Nettoyage complet, sanitaires, bureaux",
    contactPerson: "Mr. Hassan",
    contactPhone: "+212 6 12 34 56 78",
    status: "actif",
    lastIntervention: "2025-10-16",
    nextIntervention: "2025-10-17",
  },
  {
    id: "2",
    name: "Entrepôt Logistique",
    address: "456 Boulevard Industrial",
    city: "Casablanca",
    postalCode: "20100",
    clientName: "Entreprise ABC",
    interventionType: "permanent",
    schedule: "Samedi-Dimanche, 08h-12h",
    requirements: "Nettoyage sol, déchets, zones de stockage",
    contactPerson: "Mme. Fatima",
    contactPhone: "+212 6 98 76 54 32",
    status: "actif",
    lastIntervention: "2025-10-15",
    nextIntervention: "2025-10-18",
  },
  {
    id: "3",
    name: "Chambre Particulier",
    address: "789 Avenue Hassan II",
    city: "Rabat",
    postalCode: "10000",
    clientName: "Particulier - Ahmed",
    interventionType: "ponctuel",
    schedule: "Sur demande",
    requirements: "Nettoyage complet, vitres, terrasse",
    contactPerson: "Ahmed",
    contactPhone: "+212 6 11 22 33 44",
    status: "actif",
    lastIntervention: "2025-10-10",
    nextIntervention: "2025-10-25",
  },
]

export function SitesContent() {
  const [sites, setSites] = useState<Site[]>(mockSites)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = [
    { label: "Total Sites", value: sites.length, color: "bg-blue-100 text-blue-700" },
    {
      label: "Sites Actifs",
      value: sites.filter((s) => s.status === "actif").length,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Interventions Permanentes",
      value: sites.filter((s) => s.interventionType === "permanent").length,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Interventions Ponctuelles",
      value: sites.filter((s) => s.interventionType === "ponctuel").length,
      color: "bg-orange-100 text-orange-700",
    },
  ]

  const handleAddSite = (siteData: Omit<Site, "id">) => {
    if (editingSite) {
      setSites(sites.map((s) => (s.id === editingSite.id ? { ...siteData, id: s.id } : s)))
      setEditingSite(null)
    } else {
      setSites([...sites, { ...siteData, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteSite = (id: string) => {
    setSites(sites.filter((s) => s.id !== id))
  }

  const handleEditSite = (site: Site) => {
    setEditingSite(site)
    setIsDialogOpen(true)
  }

  const handleViewDetails = (site: Site) => {
    setSelectedSite(site)
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
            placeholder="Rechercher un site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            setEditingSite(null)
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter Site
        </Button>
      </div>

      {/* Sites Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nom du Site</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Adresse</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Horaire</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSites.map((site) => (
                <tr key={site.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {site.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {site.address}, {site.city}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{site.clientName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        site.interventionType === "permanent"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {site.interventionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{site.schedule}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        site.status === "actif"
                          ? "bg-green-100 text-green-700"
                          : site.status === "inactif"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(site)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditSite(site)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
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
      <SiteDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingSite(null)
        }}
        onSave={handleAddSite}
        initialData={editingSite || undefined}
      />
      <SiteDetailsDialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} site={selectedSite} />
    </div>
  )
}
