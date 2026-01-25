"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"

type CartItem = {
  product?: {
    name?: { en?: string; pt?: string; es?: string } | string
    description?: { en?: string; pt?: string; es?: string } | string
    imageUrl?: string
  }
  price: number | string
  quantity: number | string
  selectedColor?: string
  selectedSize?: string
  selectedMaterial?: string
  selectedImage?: string
  cartKey?: string
}

type ShippingInfo = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

function safeNumber(v: unknown) {
  const n = typeof v === "string" ? Number(v) : (v as number)
  return Number.isFinite(n) ? n : 0
}

function to2(n: number) {
  return n.toFixed(2)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t, locale } = useLanguage()

  const cartT = ((t as any)?.cart ?? {}) as Record<string, any>
  const checkoutT = ((t as any)?.checkout ?? {}) as Record<string, any>

  const payCardLabel =
    locale === "pt"
      ? "Pagar com Cartão (Crédito/Débito)"
      : locale === "es"
        ? "Pagar con Tarjeta (Crédito/Débito)"
        : "Pay by Card (Credit/Debit)"

  const payPalLabel =
    locale === "pt" ? "Pagar com PayPal" : locale === "es" ? "Pagar con PayPal" : "Pay with PayPal"

  const processingLabel =
    locale === "pt" ? "Processando..." : locale === "es" ? "Procesando..." : "Processing..."

  const { items } = useCart() as { items: CartItem[] }

  // ✅ loading separado (corrige o “carregando” no botão errado)
  const [isStripeProcessing, setIsStripeProcessing] = useState(false)
  const [isPaypalProcessing, setIsPaypalProcessing] = useState(false)

  const isProcessing = isStripeProcessing || isPaypalProcessing

  const [formData, setFormData] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Spain",
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!items || items.length === 0) router.replace("/cart")
  }, [items, router])

  const subtotal = useMemo(() => {
    return (items || []).reduce((sum, it) => {
      const price = safeNumber(it.price)
      const qty = safeNumber(it.quantity)
      return sum + price * qty
    }, 0)
  }, [items])

  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping])

  const canSubmit = useMemo(() => {
    return (
      (items?.length ?? 0) > 0 &&
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.zipCode.trim() &&
      formData.country.trim()
    )
  }, [items, formData])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const buildItemsPayload = () => {
    return (items || []).map((item) => ({
      product: item.product,
      price: item.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      selectedMaterial: item.selectedMaterial,
      selectedImage: (item as any).selectedImage,
      cartKey: (item as any).cartKey,
    }))
  }

  // =========================
  // STRIPE (DO NOT TOUCH API)
  // =========================
  const handleCheckout = async () => {
    if (!canSubmit) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before paying.",
        variant: "destructive",
      })
      return
    }

    setIsStripeProcessing(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: buildItemsPayload(),
          userId: null,
          shippingInfo: formData,
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data?.error || "Failed to create Stripe checkout.")
      if (!data?.url) {
        console.log("Stripe response:", data)
        throw new Error("Stripe checkout URL is missing.")
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStripeProcessing(false)
    }
  }

  // =========================
  // PAYPAL (DO NOT TOUCH API)
  // =========================
  const handlePayPalCheckout = async () => {
    if (!canSubmit) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before paying.",
        variant: "destructive",
      })
      return
    }

    setIsPaypalProcessing(true)
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: buildItemsPayload(),
          userId: null,
          shippingInfo: formData,
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data?.error || "Failed to create PayPal order.")
      if (!data?.approveUrl) {
        console.log("PayPal response:", data)
        throw new Error("PayPal approval URL is missing.")
      }

      window.location.href = data.approveUrl
    } catch (error) {
      console.error("PayPal checkout error:", error)
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPaypalProcessing(false)
    }
  }

  if (!items || items.length === 0) return null

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{checkoutT.title ?? "Checkout"}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{checkoutT.shippingInfo ?? "Shipping information"}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{checkoutT.firstName ?? "First name"}</Label>
                      <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    </div>

                    <div>
                      <Label htmlFor="lastName">{checkoutT.lastName ?? "Last name"}</Label>
                      <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{checkoutT.email ?? "Email"}</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>

                  <div>
                    <Label htmlFor="phone">{checkoutT.phone ?? "Phone"}</Label>
                    <Input id="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>

                  <div>
                    <Label htmlFor="address">{checkoutT.address ?? "Address"}</Label>
                    <Input id="address" value={formData.address} onChange={handleInputChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">{checkoutT.city ?? "City"}</Label>
                      <Input id="city" value={formData.city} onChange={handleInputChange} required />
                    </div>

                    <div>
                      <Label htmlFor="state">{checkoutT.state ?? "State"}</Label>
                      <Input id="state" value={formData.state} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">{checkoutT.zipCode ?? "ZIP code"}</Label>
                      <Input id="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                    </div>

                    <div>
                      <Label htmlFor="country">{checkoutT.country ?? "Country"}</Label>
                      <Input id="country" value={formData.country} onChange={handleInputChange} required />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{checkoutT.orderSummary ?? "Order summary"}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((it, idx) => {
                      type NameObj = { en?: string; pt?: string; es?: string }
                      const loc = (locale === "pt" || locale === "es" || locale === "en" ? locale : "en") as keyof NameObj

                      const name =
                        typeof it.product?.name === "object"
                          ? ((it.product?.name as NameObj)[loc] ?? (it.product?.name as NameObj).en ?? "")
                          : (it.product?.name ?? "")

                      const qty = safeNumber(it.quantity)
                      const price = safeNumber(it.price)

                      return (
                        <div key={(it as any).cartKey || idx} className="flex items-center justify-between gap-3">
                          <div className="text-sm">
                            <div className="font-medium">{name || "Product"}</div>
                            <div className="opacity-70">
                              {checkoutT.qtyLabel ?? "Qty"}: {qty} × € {to2(price)}
                            </div>
                          </div>
                          <div className="font-medium">€ {to2(price * qty)}</div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{cartT.subtotal ?? "Subtotal"}</span>
                      <span>€ {to2(subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>{cartT.shipping ?? "Shipping"}</span>
                      <span>€ {to2(shipping)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold">{checkoutT.total ?? "Total"}</span>
                    <span className="text-xl font-bold">€ {to2(total)}</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
                      disabled={isProcessing || !canSubmit}
                      onClick={handleCheckout}
                    >
                      {isStripeProcessing ? processingLabel : payCardLabel}
                    </Button>

                    <Button
                      type="button"
                      className="w-full h-12 bg-[#0070ba] hover:bg-[#003087] text-white font-semibold transition-all"
                      disabled={isProcessing || !canSubmit}
                      onClick={handlePayPalCheckout}
                    >
                      {isPaypalProcessing ? processingLabel : payPalLabel}
                    </Button>
                  </div>

                  {!canSubmit ? (
                    <p className="text-xs opacity-70">{checkoutT.fillAllFields ?? "Fill in all fields to enable payment."}</p>
                  ) : (
                    <p className="text-xs text-center text-muted-foreground">
                      🔒 {checkoutT.securePayment ?? "Secure payment • Encrypted checkout • No card data stored"}
                    </p>
                  )}
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
