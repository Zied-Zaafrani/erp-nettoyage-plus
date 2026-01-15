"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Package, AlertTriangle } from "lucide-react"

interface StockItem {
  id: string
  name: string
  category: "consommable" | "équipement" | "outil"
  quantity: number
  minimumThreshold: number
  unit: string
  supplier: string
  unitPrice: number
  lastRestockDate: string
  expiryDate?: string
  location: string
  status: "en-stock" | "faible" | "rupture"
}

interface StockDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  item: StockItem | null
}

export function StockDetailsDialog({ isOpen, onClose, item }: StockDetailsDialogProps) {
  if (!isOpen || !item) return null

  const totalValue = item.quantity * item.unitPrice
  const isLowStock = item.quantity <= item.minimumThreshold

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5" />
            {item.name}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stock Status */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Quantité Actuelle</p>
                <p className="text-3xl font-bold text-blue-700">
                  {item.quantity} <span className="text-lg">{item.unit}</span>
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isLowStock ? "bg-yellow-50" : "bg-green-50"
                } flex items-center justify-between`}
              >
                <div>
                  <p className="text-sm text-muted-foreground">Seuil Minimum</p>
                  <p className={`text-2xl font-bold ${isLowStock ? "text-yellow-700" : "text-green-700"}`}>
                    {item.minimumThreshold} {item.unit}
                  </p>
                </div>
                {isLowStock && <AlertTriangle className="w-8 h-8 text-yellow-600" />}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations du Produit</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Catégorie</p>
                <p className="text-foreground font-medium capitalize">{item.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Localisation</p>
                <p className="text-foreground font-medium">{item.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    item.status === "en-stock"
                      ? "bg-green-100 text-green-700"
                      : item.status === "faible"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>

          {/* Supplier & Pricing */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Fournisseur & Tarification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fournisseur</p>
                <p className="text-foreground font-medium">{item.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prix Unitaire</p>
                <p className="text-foreground font-medium">{item.unitPrice.toFixed(2)} DH</p>
              </div>
              <div className="col-span-2 bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Valeur Totale du Stock</p>
                <p className="text-2xl font-bold text-purple-700">{totalValue.toFixed(2)} DH</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Historique</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Dernier Réapprovisionnement</p>
                <p className="text-foreground font-medium">
                  {new Date(item.lastRestockDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              {item.expiryDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Date d'Expiration</p>
                  <p className="text-foreground font-medium">{new Date(item.expiryDate).toLocaleDateString("fr-FR")}</p>
                </div>
              )}
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
