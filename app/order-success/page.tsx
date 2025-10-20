"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  const { locale } = useLanguage()

  const messages = {
    en: {
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. We'll send you a confirmation email shortly.",
      orderNumber: "Order Number",
      backToHome: "Back to Home",
      viewProducts: "View More Products",
    },
    pt: {
      title: "Pedido Realizado com Sucesso!",
      description: "Obrigado pela sua compra. Enviaremos um e-mail de confirmação em breve.",
      orderNumber: "Número do Pedido",
      backToHome: "Voltar ao Início",
      viewProducts: "Ver Mais Produtos",
    },
    es: {
      title: "Pedido Realizado con Éxito!",
      description: "Gracias por tu compra. Te enviaremos un correo de confirmación pronto.",
      orderNumber: "Número de Pedido",
      backToHome: "Volver al Inicio",
      viewProducts: "Ver Más Productos",
    },
  }

  const t = messages[locale]
  const orderNumber = `NP3D-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-500">
                <CheckCircle className="w-16 h-16 text-accent" />
              </div>
              <h1 className="text-4xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {t.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                {t.description}
              </p>
              <div className="inline-block p-4 rounded-lg bg-muted animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <p className="text-sm text-muted-foreground mb-1">{t.orderNumber}</p>
                <p className="text-2xl font-bold font-mono">{orderNumber}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button asChild size="lg">
                <Link href="/">{t.backToHome}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent">
                <Link href="/products">{t.viewProducts}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
