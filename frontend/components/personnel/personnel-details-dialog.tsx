"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  status: "active" | "inactive" | "on-leave"
  hireDate: string
  salary: number
  contract: string
}

interface PersonnelDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee
}

export function PersonnelDetailsDialog({ open, onOpenChange, employee }: PersonnelDetailsDialogProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Actif", variant: "default" as const },
      inactive: { label: "Inactif", variant: "secondary" as const },
      "on-leave": { label: "En congé", variant: "outline" as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de l'employé</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-muted-foreground mt-1">{employee.position}</p>
            </div>
            <div>{getStatusBadge(employee.status)}</div>
          </div>

          {/* Contact Information */}
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold text-foreground mb-3">Informations de contact</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground">{employee.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Téléphone:</span>
                <span className="font-medium text-foreground">{employee.phone}</span>
              </div>
            </div>
          </Card>

          {/* Employment Information */}
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold text-foreground mb-3">Informations d'emploi</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Département</p>
                <p className="font-medium text-foreground mt-1">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type de contrat</p>
                <p className="font-medium text-foreground mt-1">{employee.contract}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'embauche</p>
                <p className="font-medium text-foreground mt-1">
                  {new Date(employee.hireDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salaire annuel</p>
                <p className="font-medium text-foreground mt-1">{employee.salary.toLocaleString("fr-FR")} €</p>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold text-foreground mb-3">Informations supplémentaires</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Employé:</span>
                <span className="font-medium text-foreground">{employee.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ancienneté:</span>
                <span className="font-medium text-foreground">
                  {Math.floor((Date.now() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} ans
                </span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
