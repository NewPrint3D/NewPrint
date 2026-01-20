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
import { AlertCircle } from "lucide-react"

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const freeShippingThreshold = 50
  const shipping = totalPrice >= freeShippingThreshold ? 0 : 5.99
  const total = totalPrice + shipping

  const isCartEmpty = items.length === 0

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

      // ✅ Cria sessão de checkout no backend (Stripe/PayPal)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          locale,
          items: items.map((i) => ({
            productId: i.product.id,
            name: (i.product.name as any)?.[locale] ?? (i.product.name as any)?.es ?? (i.product.name as any)?.en ?? "Producto",
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
        throw new Error(txt || "No se pudo iniciar el pago.")
      }

      const data = (await res.json()) as { url?: string; redirectUrl?: string }

      const url = data.url || data.redirectUrl
      if (!url) throw new Error("Respuesta inválida del servidor (sin URL).")

      // ✅ Redireciona para o provedor de pagamento (Stripe Checkout / PayPal approval URL)
      window.location.href = url
    } catch (err: any) {
      setErrorMsg(err?.message || "Error al iniciar el pago.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Envío */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datos de envío</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" value={formData.address} onChange={handleInputChange} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" value={formData.city} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Código postal</Label>
                    <Input id="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm">
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
          </div>

          {/* Resumen + Pago */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm gap-4">
                  <span className="line-clamp-2">
                    {item.quantity}x {(item.product.name as any)?.[locale] || (item.product.name as any)?.es || "Producto"}
                  </span>
                  <span className="shrink-0">{formatCurrency(item.price * item.quantity, locale)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice, locale)}</span>
              </div>

              <div className="flex justify-between">
                <span>Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatCurrency(shipping, locale)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg text-primary">
                <span>Total</span>
                <span>{formatCurrency(total, locale)}</span>
              </div>

              {/* ✅ Botão agora faz algo (cria sessão e redireciona) */}
              <Button className="w-full mt-6" size="lg" onClick={handlePay} disabled={!canPay || isSubmitting}>
                {isSubmitting ? "Procesando..." : "Finalizar y pagar"}
              </Button>

              <p className="text-xs text-muted-foreground">
                Al continuar, serás redirigido a la página segura de pago (tarjeta o PayPal).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
