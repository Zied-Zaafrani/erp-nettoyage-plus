"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, Calendar, CheckCircle, AlertCircle, Package } from "lucide-react"
import { useLanguage } from "./language-provider"
import { translations } from "@/lib/translations"

export function DashboardContent() {
  const { language } = useLanguage()
  const t = translations[language]

  const interventionData = [
    { month: "Jan", [t.permanent]: 45, [t.punctual]: 12 },
    { month: "Fév", [t.permanent]: 52, [t.punctual]: 18 },
    { month: "Mar", [t.permanent]: 48, [t.punctual]: 15 },
    { month: "Avr", [t.permanent]: 61, [t.punctual]: 22 },
    { month: "Mai", [t.permanent]: 55, [t.punctual]: 19 },
    { month: "Jun", [t.permanent]: 67, [t.punctual]: 25 },
  ]

  const qualityData = [
    { name: language === "fr" ? "Conforme" : language === "ar" ? "متوافق" : "Compliant", value: 85, color: "#10b981" },
    {
      name: language === "fr" ? "Avec remarques" : language === "ar" ? "مع ملاحظات" : "With remarks",
      value: 12,
      color: "#f59e0b",
    },
    {
      name: language === "fr" ? "Non-conforme" : language === "ar" ? "غير متوافق" : "Non-compliant",
      value: 3,
      color: "#ef4444",
    },
  ]

  const revenueData = [
    { week: "S1", [t.permanent]: 8500, [t.punctual]: 2100 },
    { week: "S2", [t.permanent]: 9200, [t.punctual]: 2800 },
    { week: "S3", [t.permanent]: 8800, [t.punctual]: 2400 },
    { week: "S4", [t.permanent]: 10100, [t.punctual]: 3200 },
  ]

  const stats = [
    { title: t.activeClients, value: "24", icon: Users, color: "bg-blue-100 text-blue-700" },
    { title: t.todayInterventions, value: "156", icon: Calendar, color: "bg-green-100 text-green-700" },
    { title: t.qualityScore, value: "94%", icon: CheckCircle, color: "bg-purple-100 text-purple-700" },
    { title: t.lowStock, value: "3", icon: AlertCircle, color: "bg-red-100 text-red-700" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Main Stats */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {language === "fr" ? "Vue d'Ensemble" : language === "ar" ? "نظرة عامة" : "Overview"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interventions Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t.interventionsByType}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interventionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
              <Legend />
              <Bar dataKey={t.permanent} fill="#3b82f6" />
              <Bar dataKey={t.punctual} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quality Control Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {language === "fr" ? "Conformité Qualité" : language === "ar" ? "جودة المطابقة" : "Quality Compliance"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {qualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {language === "fr" ? "Revenus Hebdomadaires" : language === "ar" ? "الإيرادات الأسبوعية" : "Weekly Revenue"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
              <Legend />
              <Line type="monotone" dataKey={t.permanent} stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey={t.punctual} stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Key Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {language === "fr" ? "Indicateurs Clés" : language === "ar" ? "المؤشرات الرئيسية" : "Key Indicators"}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-foreground font-medium">
                {language === "fr" ? "Taux d'Achèvement" : language === "ar" ? "معدل الإنجاز" : "Completion Rate"}
              </span>
              <span className="text-2xl font-bold text-blue-700">98%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-foreground font-medium">
                {language === "fr" ? "Satisfaction Client" : language === "ar" ? "رضا العميل" : "Customer Satisfaction"}
              </span>
              <span className="text-2xl font-bold text-green-700">4.7/5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-foreground font-medium">
                {language === "fr" ? "Agents Actifs" : language === "ar" ? "الوكلاء النشطون" : "Active Agents"}
              </span>
              <span className="text-2xl font-bold text-purple-700">18</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-foreground font-medium">
                {language === "fr"
                  ? "Factures en Attente"
                  : language === "ar"
                    ? "الفواتير المعلقة"
                    : "Pending Invoices"}
              </span>
              <span className="text-2xl font-bold text-orange-700">5</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.recentActivity}</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                {language === "fr"
                  ? "Nouvelle intervention planifiée"
                  : language === "ar"
                    ? "تدخل جديد مخطط"
                    : "New intervention planned"}
              </p>
              <p className="text-sm text-muted-foreground">Bureau Principal ABC - 17 Oct 2025</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-3 border-l-4 border-green-500 bg-green-50 rounded">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                {language === "fr"
                  ? "Intervention complétée"
                  : language === "ar"
                    ? "تدخل مكتمل"
                    : "Intervention completed"}
              </p>
              <p className="text-sm text-muted-foreground">Entrepôt Logistique - Score: 95%</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                {language === "fr"
                  ? "Stock faible détecté"
                  : language === "ar"
                    ? "تم اكتشاف مخزون منخفض"
                    : "Low stock detected"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "fr"
                  ? "Gants de protection - 8 boîtes restantes"
                  : language === "ar"
                    ? "قفازات الحماية - 8 صناديق متبقية"
                    : "Protective gloves - 8 boxes remaining"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-3 border-l-4 border-purple-500 bg-purple-50 rounded">
            <Package className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                {language === "fr"
                  ? "Nouveau client ajouté"
                  : language === "ar"
                    ? "تم إضافة عميل جديد"
                    : "New client added"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "fr"
                  ? "Hôtel Royal - Contrat permanent"
                  : language === "ar"
                    ? "فندق رويال - عقد دائم"
                    : "Royal Hotel - Permanent contract"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
