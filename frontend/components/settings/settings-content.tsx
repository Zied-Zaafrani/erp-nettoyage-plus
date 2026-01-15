"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"
import { Save, Bell, Lock, Palette } from "lucide-react"

export function SettingsContent() {
  const { language } = useLanguage()
  const t = translations[language]
  const [settings, setSettings] = useState({
    companyName: "Nettoyage Plus",
    email: "contact@nettoyageplus.com",
    phone: "+212 5XX XXX XXX",
    address: "Casablanca, Maroc",
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    darkMode: false,
    autoBackup: true,
  })

  const handleSave = () => {
    console.log("Settings saved:", settings)
  }

  const settingsTitle = language === "fr" ? "Paramètres" : language === "ar" ? "الإعدادات" : "Settings"
  const companyLabel = language === "fr" ? "Nom de l'Entreprise" : language === "ar" ? "اسم الشركة" : "Company Name"
  const phoneLabel = language === "fr" ? "Téléphone" : language === "ar" ? "الهاتف" : "Phone"
  const addressLabel = language === "fr" ? "Adresse" : language === "ar" ? "العنوان" : "Address"
  const notificationsLabel = language === "fr" ? "Notifications" : language === "ar" ? "الإخطارات" : "Notifications"
  const emailAlertsLabel =
    language === "fr" ? "Alertes Email" : language === "ar" ? "تنبيهات البريد الإلكتروني" : "Email Alerts"
  const smsAlertsLabel = language === "fr" ? "Alertes SMS" : language === "ar" ? "تنبيهات SMS" : "SMS Alerts"
  const darkModeLabel = language === "fr" ? "Mode Sombre" : language === "ar" ? "الوضع الداكن" : "Dark Mode"
  const autoBackupLabel =
    language === "fr" ? "Sauvegarde Automatique" : language === "ar" ? "النسخ الاحتياطي التلقائي" : "Auto Backup"

  return (
    <main className="flex-1 p-8 bg-background">
      <div className="space-y-6 max-w-2xl">
        {/* Company Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {language === "fr"
              ? "Paramètres de l'Entreprise"
              : language === "ar"
                ? "إعدادات الشركة"
                : "Company Settings"}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">{companyLabel}</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">{phoneLabel}</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="address">{addressLabel}</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {notificationsLabel}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">{notificationsLabel}</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailAlerts">{emailAlertsLabel}</Label>
              <Switch
                id="emailAlerts"
                checked={settings.emailAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, emailAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="smsAlerts">{smsAlertsLabel}</Label>
              <Switch
                id="smsAlerts"
                checked={settings.smsAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, smsAlerts: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {language === "fr" ? "Affichage" : language === "ar" ? "العرض" : "Display"}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">{darkModeLabel}</Label>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoBackup">{autoBackupLabel}</Label>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {language === "fr" ? "Sécurité" : language === "ar" ? "الأمان" : "Security"}
          </h2>

          <div className="space-y-4">
            <Button variant="outline" className="w-full bg-transparent">
              {language === "fr"
                ? "Changer le Mot de Passe"
                : language === "ar"
                  ? "تغيير كلمة المرور"
                  : "Change Password"}
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              {language === "fr"
                ? "Authentification à Deux Facteurs"
                : language === "ar"
                  ? "المصادقة الثنائية"
                  : "Two-Factor Authentication"}
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="w-4 h-4" />
          {t.save}
        </Button>
      </div>
    </main>
  )
}
