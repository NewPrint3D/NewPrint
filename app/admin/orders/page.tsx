"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

type Order = {
  id: string
  total: number
  status: string
  createdAt: string
}

export default function AdminOrdersPage() {
  const { isAdmin, isLoading } = useAuth()
  const { t } = useLanguage()

  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/")
      return
    }

    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders")
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.error("Erro ao carregar pedidos", err)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      loadOrders()
    }
  }, [isAdmin, isLoading, router])

  if (isLoading || loading) {
    return (
      <div className="p-10 text-center">
        {t.common.loading}
      </div>
    )
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        {t.products.title}
      </h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum pedido encontrado
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 flex justify-between"
            >
              <div>
                <p className="font-medium">#{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  € {order.total.toFixed(2)}
                </p>
                <p className="text-sm">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
