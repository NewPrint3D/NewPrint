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

import { AlertCircle, Lock, ShieldCheck } from "lucide-react"

type FormData = {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  zipCode: string
}

type CheckoutResponse = { url?: string; redirectUrl?: string; error?: string }

function normalizeErrorMessage(raw: unknown) {
  const msg = typeof raw === "string" ? raw : ""
  const lower = msg.toLowerCase()

  // Mensagens mais amigáveis (sem mostrar JSON cru)
  if (lower.includes("failed to create checkout session")) {
    return "No se pudo iniciar el pago. Intenta de nuevo en unos segundos."
  }
  if (lower.includes("stripe")) {
    return "Error del proveedor de pago. Intenta de nuevo."
  }
  if (lower.includes("missing") || lower.includes("undefined") || lower.includes("secret")) {
    return "Pago no configurado correctamente. Contacta con soporte."
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const freeShippingThreshold = 50
  const shipping = totalPrice >= freeShippingThreshold ? 0 : 5.99
  const total = totalPrice + shipping

  const isCartEmpty = items.length === 0

  const canPay = useMemo(() => {
    if (isCartEmpty) return false
    return Boolean(
      formData.firstName.trim() &&
        formData.lastName.trim() &&
        formData.email.trim() &&
        formData.address.trim() &&
        formData.city.trim() &&
        formData.zipCode.trim()
    )
  }, [formData, isCartEmpty])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  async function handlePay() {
    setErrorMsg(null)

    if (isCartEmpty) {
      setErrorMsg("Tu carrito está vacío.")
      return
    }

    if (!canPay) {
      setErrorMsg("Completa los datos de envío para continuar.")
      return
    }

    try {
      setIsSubmitting(true)

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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

      // tenta ler JSON, mas sem quebrar se vier texto
      let data: CheckoutResponse = {}
      const contentType = res.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        data = (await res.json().catch(() => ({}))) as CheckoutResponse
      } else {
        const txt = await res.text().catch(() => "")
        data = { error: txt }
      }

      if (!res.ok) {
        throw new Error(data.error || "No se pudo iniciar el pago.")
      }

      const url = data.url || data.redirectUrl
      if (!url) throw new Error("Respuesta inválida del servidor (sin URL).") // backend deve retornar {url}

      window.location.href = url
    } catch (err: any) {
      setErrorMsg(normalizeErrorMessage(err?.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-14">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-sm text-muted-foreground">
              Pago seguro. Serás redirigido a la pasarela (tarjeta o PayPal).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Coluna esquerda */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Datos de envío</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      autoComplete="street-address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        autoComplete="address-level2"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Código postal</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        autoComplete="postal-code"
                        required
                      />
                    </div>
                  </div>

                  {/* Mensagem de erro (amigável) */}
                  {errorMsg && (
                    <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                      <div className="text-destructive">{errorMsg}</div>
                    </div>
                  )}

                  {isCartEmpty && (
                    <div className="text-sm text-muted-foreground">
                      Tu carrito está vacío.{" "}
                      <Button variant="link" className="px-0" onClick={() => router.push("/products")}>
                        Ver productos
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Conexión cifrada (HTTPS)
                  </div>
                  <div>El pago se procesa en una página segura del proveedor (Stripe / PayPal).</div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna direita */}
            <div className="lg:col-span-5">
              <Card className="rounded-2xl lg:sticky lg:top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Resumen del pedido</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm gap-4">
                        <span className="line-clamp-2">
                          {item.quantity}x{" "}
                          {(item.product.name as any)?.[locale] || (item.product.name as any)?.es || "Producto"}
                        </span>
                        <span className="shrink-0">{formatCurrency(item.price * item.quantity, locale)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(totalPrice, locale)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>{shipping === 0 ? "Gratis" : formatCurrency(shipping, locale)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total, locale)}</span>
                  </div>

                  <Button
                    className="w-full mt-2 rounded-xl"
                    size="lg"
                    onClick={handlePay}
                    disabled={!canPay || isSubmitting}
                  >
                    {isSubmitting ? "Procesando..." : "Finalizar y pagar"}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Al continuar, serás redirigido a la página segura de pago (tarjeta o PayPal).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
