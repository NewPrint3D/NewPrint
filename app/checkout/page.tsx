"use client"

import { useMemo, useState } from "react"
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
import { AlertCircle, CreditCard, Wallet, Lock } from "lucide-react"

type FormData = {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  zipCode: string
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

  const [isSubmitting, setIsSubmitting] = useState<"card" | "paypal" | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Regras de frete
  const freeShippingThreshold = 50
  const shipping = totalPrice >= freeShippingThreshold ? 0 : 5.99
  const total = totalPrice + shipping

  const isCartEmpty = items.length === 0

  const labels = useMemo(() => {
    const isPT = locale === "pt"
    const isES = locale === "es"

    return {
      pageTitle: isPT ? "Checkout" : isES ? "Checkout" : "Checkout",
      shippingTitle: isPT ? "Dados de envio" : isES ? "Datos de envío" : "Shipping details",
      firstName: isPT ? "Nome" : isES ? "Nombre" : "First name",
      lastName: isPT ? "Apelidos" : isES ? "Apellidos" : "Last name",
      email: "Email",
      address: isPT ? "Endereço" : isES ? "Dirección" : "Address",
      city: isPT ? "Cidade" : isES ? "Ciudad" : "City",
      zip: isPT ? "Código postal" : isES ? "Código postal" : "ZIP code",
      emptyCart: isPT ? "Seu carrinho está vazio." : isES ? "Tu carrito está vacío." : "Your cart is empty.",
      viewProducts: isPT ? "Ver produtos" : isES ? "Ver productos" : "View products",
      fillShipping: isPT
        ? "Complete os dados de envio para continuar."
        : isES
          ? "Completa los datos de envío para continuar."
          : "Fill in shipping details to continue.",
      cannotStart: isPT
        ? "Não foi possível iniciar o pagamento. Tente novamente em alguns segundos."
        : isES
          ? "No se pudo iniciar el pago. Intenta de nuevo en unos segundos."
          : "Could not start payment. Try again in a few seconds.",

      summaryTitle: isPT ? "Resumo" : isES ? "Resumen" : "Summary",
      subtotal: isPT ? "Subtotal" : isES ? "Subtotal" : "Subtotal",
      shipping: isPT ? "Envio" : isES ? "Envío" : "Shipping",
      free: isPT ? "Grátis" : isES ? "Gratis" : "Free",
      total: isPT ? "Total" : isES ? "Total" : "Total",

      payCard: isPT ? "Pagar com cartão" : isES ? "Pagar con tarjeta" : "Pay with card",
      payPaypal: isPT ? "Pagar com PayPal" : isES ? "Pagar con PayPal" : "Pay with PayPal",
      secure: isPT ? "Pagamento seguro" : isES ? "Pago seguro" : "Secure payment",
    }
  }, [locale])

  const canPay = useMemo(() => {
    if (isCartEmpty) return false
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.zipCode.trim()
    )
  }, [formData, isCartEmpty])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function startPayment(provider: "card" | "paypal") {
    setErrorMsg(null)

    if (isCartEmpty) {
      setErrorMsg(labels.emptyCart)
      return
    }

    if (!canPay) {
      setErrorMsg(labels.fillShipping)
      return
    }

    try {
      setIsSubmitting(provider)

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider, // ✅ "card" | "paypal"
          customer: formData,
          locale,
          items: items.map((i) => ({
            productId: i.product.id,
            name:
              (i.product.name as any)?.[locale] ??
              (i.product.name as any)?.es ??
              (i.product.name as any)?.en ??
              "Producto",
            quantity: i.quantity,
            unitPrice: i.price,
            selectedColor: i.selectedColor,
            selectedSize: i.selectedSize,
            selectedMaterial: i.selectedMaterial,
            selectedImage: (i as any).selectedImage ?? i.product.image ?? null,
          })),
          totals: {
            subtotal: totalPrice,
            shipping,
            total,
            currency: "EUR",
          },
        }),
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => "")
        throw new Error(txt || labels.cannotStart)
      }

      const data = (await res.json()) as { url?: string; redirectUrl?: string }
      const url = data.url || data.redirectUrl
      if (!url) throw new Error(labels.cannotStart)

      window.location.href = url
    } catch (err: any) {
      setErrorMsg(err?.message || labels.cannotStart)
    } finally {
      setIsSubmitting(null)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{labels.pageTitle}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Envío */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{labels.shippingTitle}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{labels.firstName}</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">{labels.lastName}</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{labels.email}</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{labels.address}</Label>
                  <Input id="address" value={formData.address} onChange={handleInputChange} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{labels.city}</Label>
                    <Input id="city" value={formData.city} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">{labels.zip}</Label>
                    <Input id="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="text-destructive break-words">{errorMsg}</div>
                  </div>
                )}

                {isCartEmpty && (
                  <div className="text-sm text-muted-foreground">
                    {labels.emptyCart}{" "}
                    <Button variant="link" className="px-0" onClick={() => router.push("/products")}>
                      {labels.viewProducts}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumen + Pago */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{labels.summaryTitle}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm gap-4">
                  <span className="line-clamp-2">
                    {item.quantity}x{" "}
                    {(item.product.name as any)?.[locale] || (item.product.name as any)?.es || "Producto"}
                  </span>
                  <span className="shrink-0">{formatCurrency(item.price * item.quantity, locale)}</span>
                </div>
              ))}

              <Separator />

              {/* ✅ Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{labels.subtotal}</span>
                <span>{formatCurrency(totalPrice, locale)}</span>
              </div>

              {/* ✅ Envío (isso estava faltando aparecer) */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{labels.shipping}</span>
                <span>{shipping === 0 ? labels.free : formatCurrency(shipping, locale)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg text-primary">
                <span>{labels.total}</span>
                <span>{formatCurrency(total, locale)}</span>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => startPayment("card")}
                  disabled={!canPay || isSubmitting !== null}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {labels.payCard}
                </Button>

              <Button
               className="w-full bg-[#003087] hover:bg-[#00256e] text-white"
               size="lg"
               onClick={() => startPayment("paypal")}
               disabled={!canPay || isSubmitting !== null}
               >
              <Wallet className="h-5 w-5 mr-2" />
              {labels.payPaypal}
             </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Lock className="h-4 w-4" />
                  <span>{labels.secure}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
