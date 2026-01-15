"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface SiteDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export function SiteDialog({ isOpen, onClose, onSave, initialData }: SiteDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    clientName: "",
    interventionType: "permanent" as const,
    schedule: "",
    requirements: "",
    contactPerson: "",
    contactPhone: "",
    status: "actif" as const,
    lastIntervention: "",
    nextIntervention: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      clientName: "",
      interventionType: "permanent",
      schedule: "",
      requirements: "",
      contactPerson: "",
      contactPhone: "",
      status: "actif",
      lastIntervention: "",
      nextIntervention: "",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? "Modifier Site" : "Ajouter Nouveau Site"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nom du Site</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du site"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Client</label>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Nom du client"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Adresse</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Adresse complète"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Ville</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ville"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Code Postal</label>
              <Input
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="Code postal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type d'Intervention</label>
              <select
                value={formData.interventionType}
                onChange={(e) => setFormData({ ...formData, interventionType: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="permanent">Permanent</option>
                <option value="ponctuel">Ponctuel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Horaire/Planning</label>
            <Input
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="Ex: Lundi-Vendredi, 18h-20h"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Exigences/Spécifications</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Détails des exigences de nettoyage"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Personne de Contact</label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Nom du contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Téléphone Contact</label>
              <Input
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+212 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="submit" className="flex-1">
              {initialData ? "Mettre à jour" : "Ajouter"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
