"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AdminUser = {
  firstName?: string
  email?: string
  role?: string
}

export default function AdminPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<AdminUser | null>(null)

  // 🔒 evita erro de TypeScript se o tipo do "t" estiver incompleto
  const admin = (t as any)?.admin || {
    dashboard: "Dashboard",
    welcomeBack: "Welcome back, {name}!",
    quickActions: "Quick Actions",
    createProductHelper: "Add a new product to your catalog",
    editProductHelper: "Update product information and settings",
    manageProducts: "Manage Products",
    manageProductsHelper: "Edit or remove products",
    products: "Products",
    orders: "Orders",
    totalOrders: "Total Orders",
    totalRevenue: "Total Revenue",
    totalProducts: "Total Products",
    recentOrders: "Recent Orders",
    pendingOrders: "Pending Orders",
    viewDetails: "View Details",
    noRecentOrders: "No recent orders to display",
    manageCatalog: "Manage your product catalog",
  }

  const auth = (t as any)?.auth || { welcome: "Welcome back!" }

  // se você tiver autenticação real, mantém.
  // aqui só garante que não quebra build.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user")
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    // se você tiver regra de acesso, pode colocar aqui.
    // se não tiver, não força redirect.
  }, [router])

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold mb-2">{admin.dashboard}</h1>
            <p className="text-muted-foreground">
              {user?.firstName ? String(admin.welcomeBack).replace("{name}", user.firstName) : auth.welcome}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{admin.totalOrders}</CardTitle>
                <CardDescription>{admin.pendingOrders}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">—</div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{admin.totalRevenue}</CardTitle>
                <CardDescription>EUR</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">—</div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{admin.totalProducts}</CardTitle>
                <CardDescription>{admin.manageCatalog}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">—</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{admin.quickActions}</CardTitle>
                <CardDescription>{admin.createProductHelper}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3 flex-wrap">
                <Button asChild>
                  <Link href="/admin/products">{admin.products}</Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/admin/orders">{admin.orders}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{admin.recentOrders}</CardTitle>
                <CardDescription>{admin.noRecentOrders}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">—</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
