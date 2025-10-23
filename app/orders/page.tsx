"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency, formatDate } from "@/lib/intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, DollarSign } from "lucide-react"
import type { CartItem } from "@/contexts/cart-context"

interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  date: string
  status: string
}

export default function OrdersPage() {
  const { t, locale } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t.orders?.title || "My Orders"}</h1>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">{t.orders?.noOrders || "No orders yet"}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t.admin?.orderNumber || "Order"} #{order.id}</CardTitle>
                      <Badge variant="default">{order.status}</Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.date, locale)}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(order.total, locale)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name[locale]}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name[locale]}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.selectedColor} • {item.selectedSize} • {item.selectedMaterial}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t.cart.qtyLabel}: {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold">{formatCurrency(item.price * item.quantity, locale)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.subtotal}</span>
                        <span>{formatCurrency(order.subtotal, locale)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.shipping}</span>
                        <span>{formatCurrency(order.shipping, locale)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.tax}</span>
                        <span>{formatCurrency(order.tax, locale)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                        <span>{t.cart.total}</span>
                        <span className="text-primary">{formatCurrency(order.total, locale)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
