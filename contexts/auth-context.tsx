"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
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

// ✅ chaves únicas e estáveis (evita “sumir” login por diferença de nomes)
const STORAGE_TOKEN_KEY = "auth_token"
const STORAGE_USER_KEY = "auth_user"

// ✅ helper seguro pra ler JSON do localStorage
function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

// ✅ helper: tenta ler um erro do backend sem quebrar se vier vazio/HTML
async function safeReadJson(res: Response): Promise<any> {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // ✅ carrega sessão local primeiro (isso evita o “cliquei e não aconteceu nada”)
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    const localUser = safeJsonParse<User>(localStorage.getItem(STORAGE_USER_KEY))
    if (localUser) setUser(localUser)

    // Se existe token, tenta verificar em segundo plano (mas NÃO derruba a sessão local se o verify falhar)
    const token = localStorage.getItem(STORAGE_TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (res) => {
        const data = await safeReadJson(res)
        if (!res.ok) return null
        return data
      })
      .then((data) => {
        if (cancelled) return
        if (data?.user) {
          setUser(data.user)
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user))
        }
        // se não veio user, mantém o que já tinha local (não apaga aqui)
      })
      .catch(() => {
        // mantém sessão local; não apaga nada aqui
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      })

      const data = await safeReadJson(res)

      if (res.ok && data?.token && data?.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_TOKEN_KEY, data.token)
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user))
        }
        setUser(data.user)

        return { success: true }
      }

      const msg =
        data?.error ||
        data?.message ||
        (res.status === 401 ? "Email ou senha inválidos" : "Erro ao fazer login")

      return { success: false, error: msg }
    } catch {
      return { success: false, error: "Erro de conexão" }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(registerData),
      })

      const data = await safeReadJson(res)

      if (res.ok && data?.token && data?.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_TOKEN_KEY, data.token)
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user))
        }
        setUser(data.user)

        return { success: true }
      }

      const msg = data?.error || data?.message || "Erro ao criar conta"
      return { success: false, error: msg }
    } catch {
      return { success: false, error: "Erro de conexão" }
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_TOKEN_KEY)
      localStorage.removeItem(STORAGE_USER_KEY)
    }
    setUser(null)
    router.push("/")
  }

  const isAdmin = useMemo(() => user?.role === "admin", [user])

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
