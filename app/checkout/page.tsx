"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import {
  AlertCircle,
  CreditCard,
  Wallet,
  Lock,
  ShieldCheck,
} from "lucide-react"

type FormData = {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  zipCode: string
}

type CheckoutResponse = {
  url?: string
  redirectUrl?: string
  error?: string
}

function normalizeErrorMessage(raw: unknown) {
  const msg = typeof raw === "string" ? raw : ""
  const lower = msg.toLowerCase()

  if (lower.includes("failed")) {
    return "No se pudo iniciar el pago. Intenta de nuevo en unos segundos."
  }

  if (lower.includes("stripe")) {
    return "Error del proveedor de pago."
  }

  return "Error al iniciar el pago."
}

export default function CheckoutPage() {
  const router = useRouter()
  const { locale } = useLanguage()
  const { items, totalPrice } = useCart()

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittingMethod, setSubmittingMethod] = useState<
    "card" | "paypal" | null
  >(null)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const freeShippingThreshold = 50
  const shipping = totalPrice >= freeShippingThreshold ? 0 : 5.99
  const total = totalPrice + shipping

  const isCartEmpty = items.length === 0

  const canPay = useMemo(() => {
    if (isCartEmpty) return false
    return Boolean(
      formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.address &&
        formData.city &&
        formData.zipCode
    )
  }, [formData, isCartEmpty])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  async function handlePay(method: "card" | "paypal") {
    setErrorMsg(null)

    if (!canPay) {
      setErrorMsg("Completa los datos para continuar.")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmittingMethod(method)

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: method,
          customer: formData,
          locale,
          items,
          totals: {
            subtotal: totalPrice,
            shipping,
            total,
            currency: "EUR",
          },
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.error || "Pago no disponible")
      }

      const url = data.url || data.redirectUrl
      if (!url) throw new Error("Sin URL de pago")

      window.location.href = url
    } catch (err: any) {
      setErrorMsg(normalizeErrorMessage(err.message))
    } finally {
      setIsSubmitting(false)
      setSubmittingMethod(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-14 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ENVIO */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de envío</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input id="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleInputChange} />
              <Input id="lastName" placeholder="Apellidos" value={formData.lastName} onChange={handleInputChange} />
              <Input id="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
              <Input id="address" placeholder="Dirección" value={formData.address} onChange={handleInputChange} />
              <Input id="city" placeholder="Ciudad" value={formData.city} onChange={handleInputChange} />
              <Input id="zipCode" placeholder="Código postal" value={formData.zipCode} onChange={handleInputChange} />

              {errorMsg && (
                <div className="flex gap-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errorMsg}
                </div>
              )}
            </CardContent>
          </Card>

          {/* RESUMO */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {i.quantity}x {(i.product.name as any)?.[locale] || "Producto"}
                  </span>
                  <span>{formatCurrency(i.price * i.quantity, locale)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold">{formatCurrency(total, locale)}</span>
              </div>

              <Button
                className="w-full"
                onClick={() => handlePay("card")}
                disabled={isSubmitting}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {submittingMethod === "card" ? "Procesando..." : "Pagar con tarjeta"}
              </Button>

              <Button
                className="w-full"
                variant="secondary"
                onClick={() => handlePay("paypal")}
                disabled={isSubmitting}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {submittingMethod === "paypal" ? "Procesando..." : "Pagar con PayPal"}
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" />
                Pago seguro
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
