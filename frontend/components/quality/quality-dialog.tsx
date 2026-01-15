"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Plus } from "lucide-react"

interface QualityDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export function QualityDialog({ isOpen, onClose, onSave, initialData }: QualityDialogProps) {
  const [formData, setFormData] = useState({
    interventionId: "",
    siteName: "",
    inspectorName: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    interventionType: "permanent" as const,
    conformityScore: 90,
    status: "conforme" as const,
    checklist: [
      { id: "1", item: "Sols nettoyés", checked: true },
      { id: "2", item: "Sanitaires propres", checked: true },
    ],
    nonConformities: [] as string[],
    correctionPlan: "",
    photos: [] as string[],
    comments: "",
  })

  const [nonConformityInput, setNonConformityInput] = useState("")
  const [checklistItemInput, setChecklistItemInput] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  if (!isOpen) return null

  const handleAddNonConformity = () => {
    if (nonConformityInput.trim()) {
      setFormData({
        ...formData,
        nonConformities: [...formData.nonConformities, nonConformityInput],
      })
      setNonConformityInput("")
    }
  }

  const handleRemoveNonConformity = (index: number) => {
    setFormData({
      ...formData,
      nonConformities: formData.nonConformities.filter((_, i) => i !== index),
    })
  }

  const handleAddChecklistItem = () => {
    if (checklistItemInput.trim()) {
      setFormData({
        ...formData,
        checklist: [...formData.checklist, { id: Date.now().toString(), item: checklistItemInput, checked: false }],
      })
      setChecklistItemInput("")
    }
  }

  const handleToggleChecklistItem = (id: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? "Modifier Rapport" : "Créer Nouveau Rapport de Qualité"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Site</label>
              <Input
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="Nom du site"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Inspecteur</label>
              <Input
                value={formData.inspectorName}
                onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                placeholder="Nom de l'inspecteur"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date d'Inspection</label>
              <Input
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Score de Conformité (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.conformityScore}
                onChange={(e) => setFormData({ ...formData, conformityScore: Number.parseInt(e.target.value) })}
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
              <option value="conforme">Conforme</option>
              <option value="conforme-avec-remarques">Conforme avec remarques</option>
              <option value="non-conforme">Non-conforme</option>
            </select>
          </div>

          {/* Checklist */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Checklist</label>
            <div className="space-y-2 mb-3">
              {formData.checklist.map((item) => (
                <label key={item.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleChecklistItem(item.id)}
                    className="w-4 h-4"
                  />
                  <span className={item.checked ? "line-through text-muted-foreground" : "text-foreground"}>
                    {item.item}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={checklistItemInput}
                onChange={(e) => setChecklistItemInput(e.target.value)}
                placeholder="Ajouter un élément"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddChecklistItem())}
              />
              <Button type="button" onClick={handleAddChecklistItem} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Non-Conformities */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Non-Conformités</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={nonConformityInput}
                onChange={(e) => setNonConformityInput(e.target.value)}
                placeholder="Ajouter une non-conformité"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddNonConformity())}
              />
              <Button type="button" onClick={handleAddNonConformity} variant="outline">
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.nonConformities.map((nc, idx) => (
                <div
                  key={idx}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {nc}
                  <button type="button" onClick={() => handleRemoveNonConformity(idx)} className="hover:text-red-900">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Plan de Correction</label>
            <textarea
              value={formData.correctionPlan}
              onChange={(e) => setFormData({ ...formData, correctionPlan: e.target.value })}
              placeholder="Détails du plan de correction"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Commentaires</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Commentaires additionnels"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="submit" className="flex-1">
              {initialData ? "Mettre à jour" : "Créer"}
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
