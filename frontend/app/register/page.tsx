"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"
import Image from "next/image"
import Link from "next/link"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError(t.passwordsNotMatch)
      return
    }

    if (password.length < 6) {
      setError(t.passwordTooShort)
      return
    }

    setIsLoading(true)

    try {
      await register(email, password, firstName, lastName)
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Nettoyage Plus" width={60} height={60} />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Nettoyage Plus</h1>
        <p className="text-center text-muted-foreground mb-6">{t.createAccount}</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.firstName}</label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.lastName}</label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.email}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@nettoyageplus.fr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.password}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.confirmPassword}</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-800 rounded text-sm">{error}</div>}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? t.signUp : t.register}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t.alreadyAccount}{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {t.login}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
