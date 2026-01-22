"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: "customer" | "admin"
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

  // Verificar se há token salvo ao carregar
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }
    const token = localStorage.getItem("auth_token")
    if (token) {
      // Verificar token com a API
      fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user)
          } else {
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth_token")
            }
          }
        })
        .catch(() => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token")
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", data.token)
        }
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Erro ao fazer login" }
      }
    } catch (error) {
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

      const data = await res.json()

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", data.token)
        }
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Erro ao criar conta" }
      }
    } catch (error) {
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

  const isAdmin = user?.role === "admin"

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
