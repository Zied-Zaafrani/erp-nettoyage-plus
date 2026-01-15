"use client"

import { useState } from "react"
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PersonnelDialog } from "./personnel-dialog"
import { PersonnelDetailsDialog } from "./personnel-details-dialog"
import { useLanguage } from "../language-provider"
import { translations } from "@/lib/translations"

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

const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@nettoyageplus.fr",
    phone: "+33 6 12 34 56 78",
    position: "Agent de Nettoyage",
    department: "Opérations",
    status: "active",
    hireDate: "2022-03-15",
    salary: 24000,
    contract: "CDI",
  },
  {
    id: "2",
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@nettoyageplus.fr",
    phone: "+33 6 23 45 67 89",
    position: "Superviseur",
    department: "Opérations",
    status: "active",
    hireDate: "2021-06-20",
    salary: 28000,
    contract: "CDI",
  },
  {
    id: "3",
    firstName: "Pierre",
    lastName: "Bernard",
    email: "pierre.bernard@nettoyageplus.fr",
    phone: "+33 6 34 56 78 90",
    position: "Agent de Nettoyage",
    department: "Opérations",
    status: "on-leave",
    hireDate: "2023-01-10",
    salary: 24000,
    contract: "CDD",
  },
]

export function PersonnelContent() {
  const { language } = useLanguage()
  const t = translations[language]
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = (data: Omit<Employee, "id">) => {
    if (editingEmployee) {
      setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? { ...data, id: emp.id } : emp)))
      setEditingEmployee(null)
    } else {
      setEmployees([...employees, { ...data, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailsOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: t.employed, variant: "default" as const },
      inactive: { label: t.inactive, variant: "secondary" as const },
      "on-leave": { label: t.onLeave, variant: "outline" as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.personnel}</h1>
          <p className="text-muted-foreground mt-1">
            {language === "fr"
              ? "Gestion des employés et des ressources humaines"
              : language === "ar"
                ? "إدارة الموظفين والموارد البشرية"
                : "Employee and HR management"}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEmployee(null)
            setIsDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.add} {t.personnel}
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={
              language === "fr"
                ? "Rechercher par nom, email ou poste..."
                : language === "ar"
                  ? "البحث بالاسم أو البريد الإلكتروني أو المنصب..."
                  : "Search by name, email or position..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted border-0"
          />
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t.totalEmployees}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{employees.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t.activeEmployees}</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {employees.filter((e) => e.status === "active").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t.onLeaveEmployees}</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {employees.filter((e) => e.status === "on-leave").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t.inactive}</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {employees.filter((e) => e.status === "inactive").length}
          </p>
        </Card>
      </div>

      {/* Employees Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "fr" ? "Nom" : language === "ar" ? "الاسم" : "Name"}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>{t.position}</TableHead>
                <TableHead>{t.department}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.contractType}</TableHead>
                <TableHead>{t.hireDate}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>{employee.contract}</TableCell>
                  <TableCell>
                    {new Date(employee.hireDate).toLocaleDateString(
                      language === "ar" ? "ar-SA" : language === "en" ? "en-US" : "fr-FR",
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(employee)}
                        className="w-8 h-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEmployee(employee)}
                        className="w-8 h-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <PersonnelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddEmployee}
        employee={editingEmployee}
      />

      {/* Details Dialog */}
      {selectedEmployee && (
        <PersonnelDetailsDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen} employee={selectedEmployee} />
      )}
    </div>
  )
}
