"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: React.ReactNode) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid credentials")
      }

      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (users.some((u: any) => u.email === email)) {
        throw new Error("Email already used")
      }

      if (password.length < 6) {
        throw new Error("Password too short")
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        firstName,
        lastName,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      const userData = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
