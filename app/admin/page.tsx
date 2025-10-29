"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { formatCurrency } from "@/lib/intl"

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth()
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    // Buscar estatísticas
    const fetchStats = async () => {
      if (typeof window === "undefined") return
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setStats({
            totalProducts: data.totalProducts ?? data.total_products ?? 0,
            totalOrders: data.totalOrders ?? data.total_orders ?? 0,
            totalRevenue: data.totalRevenue ?? data.revenue ?? 0,
            pendingOrders: data.pendingOrders ?? data.pending_orders ?? 0,
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    if (isAdmin) {
      fetchStats()
    }
  }, [isAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold mb-2">{t.admin.dashboard}</h1>
            <p className="text-muted-foreground">
              {user?.firstName ? t.admin.welcomeBack.replace("{name}", user.firstName) : t.auth.welcome}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t.admin.totalProducts}</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t.admin.totalOrders}</CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t.admin.totalRevenue}</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue, locale)}</div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t.admin.pendingOrders}</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
              <CardHeader>
                <CardTitle>{t.admin.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => router.push("/admin/products/new")}
                  className="w-full p-4 text-left rounded-lg border border-border hover:bg-accent transition-colors duration-200"
                >
                  <div className="font-medium">{t.admin.addProduct}</div>
                  <div className="text-sm text-muted-foreground">{t.admin.createProductHelper}</div>
                </button>
                <button
                  onClick={() => router.push("/admin/products")}
                  className="w-full p-4 text-left rounded-lg border border-border hover:bg-accent transition-colors duration-200"
                >
                  <div className="font-medium">{t.admin.manageProducts}</div>
                  <div className="text-sm text-muted-foreground">{t.admin.manageProductsHelper}</div>
                </button>
                <button
                  onClick={() => router.push("/admin/orders")}
                  className="w-full p-4 text-left rounded-lg border border-border hover:bg-accent transition-colors duration-200"
                >
                  <div className="font-medium">Manage Orders</div>
                  <div className="text-sm text-muted-foreground">View and process customer orders</div>
                </button>
                <button
                  onClick={() => router.push("/admin/settings")}
                  className="w-full p-4 text-left rounded-lg border border-border hover:bg-accent transition-colors duration-200"
                >
                  <div className="font-medium">Site Settings</div>
                  <div className="text-sm text-muted-foreground">Configure site appearance and settings</div>
                </button>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-600">
              <CardHeader>
                <CardTitle>{t.admin.recentOrders}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">{t.admin.noRecentOrders}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
