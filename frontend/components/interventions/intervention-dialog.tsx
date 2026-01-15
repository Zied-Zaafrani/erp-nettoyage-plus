"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface InterventionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export function InterventionDialog({ isOpen, onClose, onSave, initialData }: InterventionDialogProps) {
  const [formData, setFormData] = useState({
    siteName: "",
    clientName: "",
    type: "permanent" as const,
    date: "",
    startTime: "",
    endTime: "",
    agents: [] as string[],
    status: "planifiée" as const,
    description: "",
    priority: "normale" as const,
    estimatedDuration: 120,
  })

  const [agentInput, setAgentInput] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  if (!isOpen) return null

  const handleAddAgent = () => {
    if (agentInput.trim() && !formData.agents.includes(agentInput)) {
      setFormData({ ...formData, agents: [...formData.agents, agentInput] })
      setAgentInput("")
    }
  }

  const handleRemoveAgent = (agent: string) => {
    setFormData({ ...formData, agents: formData.agents.filter((a) => a !== agent) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      siteName: "",
      clientName: "",
      type: "permanent",
      date: "",
      startTime: "",
      endTime: "",
      agents: [],
      status: "planifiée",
      description: "",
      priority: "normale",
      estimatedDuration: 120,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? "Modifier Intervention" : "Ajouter Nouvelle Intervention"}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="permanent">Permanent</option>
                <option value="ponctuel">Ponctuel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Priorité</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Heure Début</label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Heure Fin</label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Détails de l'intervention"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Agents Assignés</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                placeholder="Nom de l'agent"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAgent())}
              />
              <Button type="button" onClick={handleAddAgent} variant="outline">
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.agents.map((agent) => (
                <div
                  key={agent}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {agent}
                  <button type="button" onClick={() => handleRemoveAgent(agent)} className="hover:text-blue-900">
                    ×
                  </button>
                </div>
              ))}
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
                <option value="planifiée">Planifiée</option>
                <option value="en-cours">En cours</option>
                <option value="complétée">Complétée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Durée Estimée (min)</label>
              <Input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: Number.parseInt(e.target.value) })}
              />
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
