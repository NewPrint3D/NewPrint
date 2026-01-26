"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth()
  const { t } = useLanguage()

  const router = useRouter()
  const [hasAdminKey, setHasAdminKey] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/")
    }
  }, [isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        {t.common.loading}
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Admin
      </h1>

      <p className="text-muted-foreground mb-6">
        Painel administrativo
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => router.push("/admin/products")}
          className="border rounded-lg p-6 text-left hover:bg-muted transition"
        >
          Produtos
        </button>

        <button
          onClick={() => router.push("/admin/orders")}
          className="border rounded-lg p-6 text-left hover:bg-muted transition"
        >
          Pedidos
        </button>
      </div>
    </div>
  )
}
