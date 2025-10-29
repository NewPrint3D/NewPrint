"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function OrderSuccessContent() {
  const { locale } = useLanguage()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [orderNumber, setOrderNumber] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const messages = {
    en: {
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. We'll send you a confirmation email shortly.",
      orderNumber: "Order Number",
      backToHome: "Back to Home",
      viewProducts: "View More Products",
      loading: "Processing your order...",
      error: "Error processing order",
    },
    pt: {
      title: "Pedido Realizado com Sucesso!",
      description: "Obrigado pela sua compra. Enviaremos um e-mail de confirmação em breve.",
      orderNumber: "Número do Pedido",
      backToHome: "Voltar ao Início",
      viewProducts: "Ver Mais Produtos",
      loading: "Processando seu pedido...",
      error: "Erro ao processar pedido",
    },
    es: {
      title: "Pedido Realizado con Éxito!",
      description: "Gracias por tu compra. Te enviaremos un correo de confirmación pronto.",
      orderNumber: "Número de Pedido",
      backToHome: "Volver al Inicio",
      viewProducts: "Ver Más Productos",
      loading: "Procesando tu pedido...",
      error: "Error al procesar el pedido",
    },
  }

  const t = messages[locale]

  useEffect(() => {
    async function fulfillOrder() {
      if (!sessionId) {
        setError('No session ID provided')
        setLoading(false)
        return
      }

      try {
        // Buscar informações da sessão do Checkout
        const response = await fetch(`/api/checkout/session?session_id=${sessionId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to retrieve session')
        }

        const data = await response.json()

        if (data.orderNumber) {
          setOrderNumber(data.orderNumber)
        } else {
          setOrderNumber(`CS-${sessionId.slice(-10)}`)
        }
      } catch (err) {
        console.error('Error fulfilling order:', err)
        setError(err instanceof Error ? err.message : t.error)
        // Don't generate fake order numbers in production
      } finally {
        setLoading(false)
      }
    }

    fulfillOrder()
  }, [sessionId, t.error])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-accent" />
        <p className="text-lg text-muted-foreground">{t.loading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-red-600">Payment Error</h1>
        <p className="text-lg text-muted-foreground mb-8">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/checkout'}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
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
  )
}
