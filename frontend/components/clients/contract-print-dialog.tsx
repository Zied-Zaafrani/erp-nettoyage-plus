"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Printer, RotateCcw } from "lucide-react"
import { useLanguage } from "../language-provider"
import { translations } from "@/lib/translations"

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

interface ContractPrintDialogProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
}

export function ContractPrintDialog({ isOpen, onClose, client }: ContractPrintDialogProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  if (!isOpen || !client) return null

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800")
    if (!printWindow) return

    const canvas = canvasRef.current
    const signatureImage = canvas ? canvas.toDataURL() : ""

    const contractHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contrat - ${client.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #003366; }
          .header p { margin: 5px 0; color: #666; }
          .content { line-height: 1.8; }
          .section { margin: 20px 0; }
          .section h2 { color: #003366; font-size: 14px; border-bottom: 2px solid #003366; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 10px 0; }
          .info-item { }
          .info-label { font-weight: bold; color: #333; }
          .info-value { color: #666; }
          .signature-section { margin-top: 40px; }
          .signature-box { border: 1px solid #ccc; padding: 10px; width: 300px; height: 150px; }
          .signature-image { max-width: 100%; max-height: 100%; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CONTRAT DE SERVICE</h1>
          <p>Nettoyage Plus</p>
        </div>

        <div class="content">
          <div class="section">
            <h2>INFORMATIONS CLIENT</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nom:</div>
                <div class="info-value">${client.name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Type:</div>
                <div class="info-value">${client.type}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email:</div>
                <div class="info-value">${client.email}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Téléphone:</div>
                <div class="info-value">${client.phone}</div>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Adresse:</div>
              <div class="info-value">${client.address}</div>
            </div>
          </div>

          <div class="section">
            <h2>DÉTAILS DU CONTRAT</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Type de Contrat:</div>
                <div class="info-value">${client.contractType}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Statut:</div>
                <div class="info-value">${client.status}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date Début:</div>
                <div class="info-value">${new Date(client.contractStartDate).toLocaleDateString("fr-FR")}</div>
              </div>
              ${
                client.contractEndDate
                  ? `
              <div class="info-item">
                <div class="info-label">Date Fin:</div>
                <div class="info-value">${new Date(client.contractEndDate).toLocaleDateString("fr-FR")}</div>
              </div>
              `
                  : ""
              }
            </div>
          </div>

          <div class="signature-section">
            <h2>SIGNATURE</h2>
            <div class="signature-box">
              ${signatureImage ? `<img src="${signatureImage}" class="signature-image" />` : "<p style='color: #999;'>Pas de signature</p>"}
            </div>
            <p style="margin-top: 10px; font-size: 12px; color: #666;">
              Signé le: ${new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <div class="footer">
          <p>Nettoyage Plus - Contrat généré automatiquement</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(contractHTML)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-foreground">
            {language === "fr" ? "Imprimer le Contrat" : language === "ar" ? "طباعة العقد" : "Print Contract"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contract Preview */}
          <div className="bg-gray-50 p-6 rounded-lg border border-border">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-blue-900">CONTRAT DE SERVICE</h1>
              <p className="text-gray-600">Nettoyage Plus</p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-blue-900 mb-2">INFORMATIONS CLIENT</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Nom:</p>
                    <p className="font-medium">{client.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type:</p>
                    <p className="font-medium capitalize">{client.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Téléphone:</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-600">Adresse:</p>
                  <p className="font-medium">{client.address}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-blue-900 mb-2">DÉTAILS DU CONTRAT</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Type de Contrat:</p>
                    <p className="font-medium capitalize">{client.contractType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Statut:</p>
                    <p className="font-medium capitalize">{client.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date Début:</p>
                    <p className="font-medium">{new Date(client.contractStartDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                  {client.contractEndDate && (
                    <div>
                      <p className="text-gray-600">Date Fin:</p>
                      <p className="font-medium">{new Date(client.contractEndDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Signature Area */}
          <div>
            <h3 className="font-bold text-foreground mb-3">
              {language === "fr" ? "Signature" : language === "ar" ? "التوقيع" : "Signature"}
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
              <canvas
                ref={canvasRef}
                width={500}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full border border-gray-200 rounded cursor-crosshair bg-white"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={clearSignature} className="gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                {language === "fr" ? "Effacer" : language === "ar" ? "مسح" : "Clear"}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              {language === "fr" ? "Annuler" : language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handlePrint} className="flex-1 gap-2">
              <Printer className="w-4 h-4" />
              {language === "fr" ? "Imprimer" : language === "ar" ? "طباعة" : "Print"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
