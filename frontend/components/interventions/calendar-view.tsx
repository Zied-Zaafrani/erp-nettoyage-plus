"use client"

import { Card } from "@/components/ui/card"

interface Intervention {
  id: string
  siteName: string
  clientName: string
  type: "permanent" | "ponctuel"
  date: string
  startTime: string
  endTime: string
  agents: string[]
  status: "planifiée" | "en-cours" | "complétée" | "annulée"
  description: string
  priority: "basse" | "normale" | "haute"
  estimatedDuration: number
}

interface CalendarViewProps {
  interventions: Intervention[]
}

export function CalendarView({ interventions }: CalendarViewProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const currentDate = new Date()
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getInterventionsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return interventions.filter((i) => i.date === dateStr)
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div key={day} className="text-center font-semibold text-foreground py-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dayInterventions = day ? getInterventionsForDay(day) : []
          return (
            <div
              key={index}
              className={`min-h-24 p-2 border border-border rounded ${day ? "bg-background" : "bg-muted"}`}
            >
              {day && (
                <>
                  <p className="font-semibold text-foreground mb-1">{day}</p>
                  <div className="space-y-1">
                    {dayInterventions.slice(0, 2).map((intervention) => (
                      <div
                        key={intervention.id}
                        className="text-xs bg-blue-100 text-blue-700 p-1 rounded truncate"
                        title={intervention.siteName}
                      >
                        {intervention.siteName}
                      </div>
                    ))}
                    {dayInterventions.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{dayInterventions.length - 2} plus</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
