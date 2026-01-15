"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit2, Trash2, Eye, AlertTriangle, Package } from "lucide-react"
import { StockDialog } from "./stock-dialog"
import { StockDetailsDialog } from "./stock-details-dialog"

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

const mockStock: StockItem[] = [
  {
    id: "1",
    name: "Produit de nettoyage multi-surfaces",
    category: "consommable",
    quantity: 45,
    minimumThreshold: 20,
    unit: "litre",
    supplier: "ChemCorp",
    unitPrice: 12.5,
    lastRestockDate: "2025-10-10",
    expiryDate: "2026-10-10",
    location: "Entrepôt A - Étagère 1",
    status: "en-stock",
  },
  {
    id: "2",
    name: "Gants de protection (boîte 100)",
    category: "consommable",
    quantity: 8,
    minimumThreshold: 10,
    unit: "boîte",
    supplier: "SafetyPlus",
    unitPrice: 8.0,
    lastRestockDate: "2025-09-15",
    location: "Entrepôt A - Étagère 3",
    status: "faible",
  },
  {
    id: "3",
    name: "Balai professionnel",
    category: "équipement",
    quantity: 12,
    minimumThreshold: 5,
    unit: "pièce",
    supplier: "ProTools",
    unitPrice: 25.0,
    lastRestockDate: "2025-08-20",
    location: "Entrepôt B - Étagère 2",
    status: "en-stock",
  },
  {
    id: "4",
    name: "Aspirateur commercial",
    category: "équipement",
    quantity: 2,
    minimumThreshold: 2,
    unit: "pièce",
    supplier: "ProTools",
    unitPrice: 450.0,
    lastRestockDate: "2025-06-01",
    location: "Entrepôt B - Zone équipements",
    status: "faible",
  },
]

export function StockContent() {
  const [items, setItems] = useState<StockItem[]>(mockStock)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = [
    { label: "Total Articles", value: items.length, color: "bg-blue-100 text-blue-700" },
    {
      label: "En Stock",
      value: items.filter((i) => i.status === "en-stock").length,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Stock Faible",
      value: items.filter((i) => i.status === "faible").length,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Valeur Totale",
      value: `${(items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0) / 1000).toFixed(1)}k DH`,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  const handleAddItem = (itemData: Omit<StockItem, "id">) => {
    if (editingItem) {
      setItems(items.map((i) => (i.id === editingItem.id ? { ...itemData, id: i.id } : i)))
      setEditingItem(null)
    } else {
      setItems([...items, { ...itemData, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const handleEditItem = (item: StockItem) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleViewDetails = (item: StockItem) => {
    setSelectedItem(item)
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
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            setEditingItem(null)
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter Article
        </Button>
      </div>

      {/* Stock Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Article</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Catégorie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantité</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Seuil Min</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fournisseur</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Prix Unitaire</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{item.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.minimumThreshold}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{item.supplier}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{item.unitPrice.toFixed(2)} DH</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${
                        item.status === "en-stock"
                          ? "bg-green-100 text-green-700"
                          : item.status === "faible"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status === "rupture" && <AlertTriangle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
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
      <StockDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingItem(null)
        }}
        onSave={handleAddItem}
        initialData={editingItem || undefined}
      />
      <StockDetailsDialog isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} item={selectedItem} />
    </div>
  )
}
