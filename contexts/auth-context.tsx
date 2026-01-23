"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string

  // Pode vir em formatos diferentes dependendo da API
  role?: string
  isAdmin?: boolean
  is_admin?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAdmin: boolean
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    const token = localStorage.getItem("auth_token")
    if (!token) {
      setIsLoading(false)
      return
    }

    fetch("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        // Se a API respondeu erro, não confia no body como user
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return null
        return data
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
        } else {
          localStorage.removeItem("auth_token")
          setUser(null)
        }
      })
      .catch(() => {
        localStorage.removeItem("auth_token")
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        if (typeof window !== "undefined" && data?.token) {
          localStorage.setItem("auth_token", data.token)
        }
        setUser(data?.user ?? null)
        return { success: true }
      } else {
        return { success: false, error: data?.error || "Erro ao fazer login" }
      }
    } catch {
      return { success: false, error: "Erro de conexão" }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        if (typeof window !== "undefined" && data?.token) {
          localStorage.setItem("auth_token", data.token)
        }
        setUser(data?.user ?? null)
        return { success: true }
      } else {
        return { success: false, error: data?.error || "Erro ao criar conta" }
      }
    } catch {
      return { success: false, error: "Erro de conexão" }
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
    setUser(null)
    router.push("/")
  }

  // Admin robusto (aceita role, role em maiúsculo, ou flags)
  const isAdmin = (() => {
    if (!user) return false
    const anyUser = user as any
    if (anyUser.isAdmin === true) return true
    if (anyUser.is_admin === true) return true

    const role = String(anyUser.role ?? "").toLowerCase().trim()
    return role === "admin"
  })()

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
