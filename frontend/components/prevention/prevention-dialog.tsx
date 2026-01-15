"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface PreventionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export function PreventionDialog({ isOpen, onClose, onSave, initialData }: PreventionDialogProps) {
  const [formData, setFormData] = useState({
    siteName: "",
    clientName: "",
    riskLevel: "moyenne" as const,
    identifiedRisks: [] as string[],
    preventiveMeasures: [] as string[],
    requiredEPI: [] as string[],
    safetyProtocols: [] as string[],
    createdDate: new Date().toISOString().split("T")[0],
    lastUpdated: new Date().toISOString().split("T")[0],
    status: "actif" as const,
  })

  const [riskInput, setRiskInput] = useState("")
  const [measureInput, setMeasureInput] = useState("")
  const [epiInput, setEpiInput] = useState("")
  const [protocolInput, setProtocolInput] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  if (!isOpen) return null

  const addItem = (input: string, field: string, setter: (val: string) => void) => {
    if (input.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field as keyof typeof formData] as string[]), input],
      })
      setter("")
    }
  }

  const removeItem = (field: string, index: number) => {
    setFormData({
      ...formData,
      [field]: (formData[field as keyof typeof formData] as string[]).filter((_, i) => i !== index),
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
            {initialData ? "Modifier Plan" : "Créer Nouveau Plan de Prévention"}
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
            <label className="block text-sm font-medium text-foreground mb-1">Niveau de Risque</label>
            <select
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>
          </div>

          {/* Identified Risks */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Risques Identifiés</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={riskInput}
                onChange={(e) => setRiskInput(e.target.value)}
                placeholder="Ajouter un risque"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addItem(riskInput, "identifiedRisks", setRiskInput))
                }
              />
              <Button
                type="button"
                onClick={() => addItem(riskInput, "identifiedRisks", setRiskInput)}
                variant="outline"
              >
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.identifiedRisks.map((risk, idx) => (
                <div
                  key={idx}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {risk}
                  <button
                    type="button"
                    onClick={() => removeItem("identifiedRisks", idx)}
                    className="hover:text-red-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preventive Measures */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Mesures Préventives</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={measureInput}
                onChange={(e) => setMeasureInput(e.target.value)}
                placeholder="Ajouter une mesure"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addItem(measureInput, "preventiveMeasures", setMeasureInput))
                }
              />
              <Button
                type="button"
                onClick={() => addItem(measureInput, "preventiveMeasures", setMeasureInput)}
                variant="outline"
              >
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.preventiveMeasures.map((measure, idx) => (
                <div
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {measure}
                  <button
                    type="button"
                    onClick={() => removeItem("preventiveMeasures", idx)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Required EPI */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">EPI Requis</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={epiInput}
                onChange={(e) => setEpiInput(e.target.value)}
                placeholder="Ajouter un EPI"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addItem(epiInput, "requiredEPI", setEpiInput))
                }
              />
              <Button type="button" onClick={() => addItem(epiInput, "requiredEPI", setEpiInput)} variant="outline">
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requiredEPI.map((epi, idx) => (
                <div
                  key={idx}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {epi}
                  <button
                    type="button"
                    onClick={() => removeItem("requiredEPI", idx)}
                    className="hover:text-yellow-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Protocols */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Protocoles de Sécurité</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={protocolInput}
                onChange={(e) => setProtocolInput(e.target.value)}
                placeholder="Ajouter un protocole"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addItem(protocolInput, "safetyProtocols", setProtocolInput))
                }
              />
              <Button
                type="button"
                onClick={() => addItem(protocolInput, "safetyProtocols", setProtocolInput)}
                variant="outline"
              >
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.safetyProtocols.map((protocol, idx) => (
                <div
                  key={idx}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {protocol}
                  <button
                    type="button"
                    onClick={() => removeItem("safetyProtocols", idx)}
                    className="hover:text-green-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
