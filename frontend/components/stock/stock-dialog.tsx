"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface StockDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export function StockDialog({ isOpen, onClose, onSave, initialData }: StockDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "consommable" as const,
    quantity: 0,
    minimumThreshold: 10,
    unit: "pièce",
    supplier: "",
    unitPrice: 0,
    lastRestockDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    location: "",
    status: "en-stock" as const,
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
      category: "consommable",
      quantity: 0,
      minimumThreshold: 10,
      unit: "pièce",
      supplier: "",
      unitPrice: 0,
      lastRestockDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      location: "",
      status: "en-stock",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? "Modifier Article" : "Ajouter Nouvel Article"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nom de l'Article</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom de l'article"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="consommable">Consommable</option>
                <option value="équipement">Équipement</option>
                <option value="outil">Outil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Unité</label>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Ex: pièce, litre, boîte"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Quantité</label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Seuil Minimum</label>
              <Input
                type="number"
                value={formData.minimumThreshold}
                onChange={(e) => setFormData({ ...formData, minimumThreshold: Number.parseInt(e.target.value) })}
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Prix Unitaire (DH)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: Number.parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Fournisseur</label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Nom du fournisseur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Localisation</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Entrepôt A - Étagère 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Dernier Réapprovisionnement</label>
              <Input
                type="date"
                value={formData.lastRestockDate}
                onChange={(e) => setFormData({ ...formData, lastRestockDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date d'Expiration (optionnel)</label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="en-stock">En stock</option>
              <option value="faible">Stock faible</option>
              <option value="rupture">Rupture</option>
            </select>
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
