"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function OrdersPage() {
  const { t, locale } = useLanguage()

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {(t as any).orders?.title || (locale === "pt" ? "Meus Pedidos" : "Mis pedidos")}
        </h1>
        
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl font-medium text-muted-foreground">
              {(t as any).orders?.noOrders || "Ainda não há pedidos"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {locale === "pt" 
                ? "Suas encomendas aparecerão aqui após a confirmação." 
                : "Tus pedidos aparecerão aquí después de la confirmación."}
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}
