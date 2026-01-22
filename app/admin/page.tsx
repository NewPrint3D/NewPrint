"use client"

export const dynamic = "force-dynamic"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/intl"

type AdminUser = {
  firstName?: string
  email?: string
  role?: string
}

type OrderLike = {
  id?: string | number
  total?: number
  total_amount?: number
  amount_total?: number
  createdAt?: string
  created_at?: string
  status?: string
}

export default function AdminPage() {
  const router = useRouter()
  const { locale } = useLanguage()
  const { isAdmin, isLoading } = useAuth()

  const [user, setUser] = useState<AdminUser | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [totalOrders, setTotalOrders] = useState<number>(0)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [recentOrders, setRecentOrders] = useState<OrderLike[]>([])

  const ui = useMemo(() => {
    return {
      dashboard: locale === "pt" ? "Admin" : locale === "es" ? "Admin" : "Admin",
      welcomeBack:
        locale === "pt"
          ? "Bem-vindo"
          : locale === "es"
            ? "Bienvenido"
            : "Welcome back",
      quickActions: locale === "pt" ? "Ações rápidas" : locale === "es" ? "Acciones rápidas" : "Quick actions",
      manageCatalog:
        locale === "pt"
          ? "Gerenciar catálogo"
          : locale === "es"
            ? "Administrar catálogo"
            : "Manage catalog",
      products: locale === "pt" ? "Produtos" : locale === "es" ? "Productos" : "Products",
      orders: locale === "pt" ? "Pedidos" : locale === "es" ? "Pedidos" : "Orders",
      totalOrders: locale === "pt" ? "Total de pedidos" : locale === "es" ? "Total de pedidos" : "Total orders",
      totalRevenue: locale === "pt" ? "Receita total" : locale === "es" ? "Ingresos totales" : "Total revenue",
      totalProducts: locale === "pt" ? "Total de produtos" : locale === "es" ? "Total de productos" : "Total products",
      recentOrders: locale === "pt" ? "Pedidos recentes" : locale === "es" ? "Pedidos recientes" : "Recent orders",
      pendingOrders: locale === "pt" ? "Em andamento" : locale === "es" ? "Pendientes" : "Pending",
      noRecentOrders:
        locale === "pt"
          ? "Nenhum pedido recente para exibir"
          : locale === "es"
            ? "No hay pedidos recientes"
            : "No recent orders",
      failedToLoad:
        locale === "pt"
          ? "Não foi possível carregar dados do Admin"
          : locale === "es"
            ? "No se pudieron cargar datos del Admin"
            : "Couldn’t load admin data",
      retry: locale === "pt" ? "Tentar de novo" : locale === "es" ? "Reintentar" : "Retry",
      loginAgain:
        locale === "pt"
          ? "Sem permissão. Faça login novamente."
          : locale === "es"
            ? "Sin permisos. Inicia sesión de nuevo."
            : "Unauthorized. Please login again.",
    }
  }, [locale])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user") || localStorage.getItem("user")
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  // 🔒 protege o admin
  useEffect(() => {
    if (isLoading) return
    if (!isAdmin) {
      router.replace("/login?next=/admin")
    }
  }, [isAdmin, isLoading, router])

  const getToken = () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  const getOrderTotal = (o: OrderLike) =>
    o.total ?? o.total_amount ?? o.amount_total ?? 0

  const fetchDashboard = async () => {
    if (typeof window === "undefined") return

    setError(null)
    setLoading(true)

    const token = getToken()

    try {
      // 1) produtos
      const productsRes = await fetch("/api/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      })

      if (productsRes.status === 401 || productsRes.status === 403) {
        setError(ui.loginAgain)
        setLoading(false)
        router.replace("/login?next=/admin")
        return
      }

      const productsData = await productsRes.json().catch(() => null)
      const productsList = (productsData?.products ?? productsData ?? []) as any[]
      const productsCount = Array.isArray(productsList) ? productsList.length : 0
      setTotalProducts(productsCount)

      // 2) pedidos (se existir endpoint)
      // Se o seu projeto não tiver /api/orders, vamos mostrar erro claro.
      const ordersRes = await fetch("/api/orders", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      })

      if (!ordersRes.ok) {
        // não trava tudo, mas mostra aviso
        const txt = `API /api/orders retornou HTTP ${ordersRes.status}`
        setError(txt)
        setTotalOrders(0)
        setTotalRevenue(0)
        setRecentOrders([])
        setLoading(false)
        return
      }

      const ordersData = await ordersRes.json().catch(() => null)
      const ordersList = (ordersData?.orders ?? ordersData ?? []) as OrderLike[]
      const list = Array.isArray(ordersList) ? ordersList : []

      setTotalOrders(list.length)

      const revenue = list.reduce((sum, o) => sum + Number(getOrderTotal(o) || 0), 0)
      setTotalRevenue(revenue)

      setRecentOrders(list.slice(0, 5))
      setLoading(false)
    } catch (e: any) {
      setError(e?.message || "network_error")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) return
    fetchDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold mb-2">{ui.dashboard}</h1>
            <p className="text-muted-foreground">
              {ui.welcomeBack}
              {user?.firstName ? `, ${user.firstName}` : ""}
            </p>
          </div>

          {error ? (
            <Card className="mb-6 border-destructive/40 bg-destructive/10">
              <CardHeader>
                <CardTitle className="text-lg">{ui.failedToLoad}</CardTitle>
                <CardDescription>{String(error)}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button onClick={fetchDashboard}>{ui.retry}</Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/admin/products">{ui.products}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{ui.totalOrders}</CardTitle>
                <CardDescription>{ui.pendingOrders}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{totalOrders}</div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{ui.totalRevenue}</CardTitle>
                <CardDescription>EUR</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {formatCurrency(totalRevenue, locale)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{ui.totalProducts}</CardTitle>
                <CardDescription>{ui.manageCatalog}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{totalProducts}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{ui.quickActions}</CardTitle>
                <CardDescription>{ui.manageCatalog}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3 flex-wrap">
                <Button asChild>
                  <Link href="/admin/products">{ui.products}</Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/admin/orders">{ui.orders}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{ui.recentOrders}</CardTitle>
                <CardDescription>
                  {recentOrders.length ? "" : ui.noRecentOrders}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentOrders.length ? (
                  recentOrders.map((o, idx) => (
                    <div
                      key={String(o.id ?? idx)}
                      className="flex items-center justify-between rounded-md border border-border/50 bg-background/40 px-3 py-2 text-sm"
                    >
                      <span>#{String(o.id ?? "—")}</span>
                      <span className="font-medium">{formatCurrency(getOrderTotal(o), locale)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">—</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
