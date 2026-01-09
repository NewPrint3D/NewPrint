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
    name?: { en?: string } | string
    description?: { en?: string } | string
    imageUrl?: string
  }
  price: number | string
  quantity: number | string
  selectedColor?: string
  selectedSize?: string
  selectedMaterial?: string
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
  const { t } = useLanguage()
  const { items } = useCart() as { items: CartItem[] }
  const [isProcessing, setIsProcessing] = useState(false)

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

    setIsProcessing(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: (items || []).map((item) => ({
            product: item.product,
            price: item.price,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            selectedMaterial: item.selectedMaterial,
          })),
          userId: null,
          shippingInfo: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create Stripe checkout.")
      }

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
      setIsProcessing(false)
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

    setIsProcessing(true)
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: (items || []).map((item) => ({
            product: item.product,
            price: item.price,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            selectedMaterial: item.selectedMaterial,
          })),
          userId: null,
          shippingInfo: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create PayPal order.")
      }

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
      setIsProcessing(false)
    }
  }

  if (!items || items.length === 0) return null

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.checkout.shippingInfo}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                     <Label htmlFor="firstName">{t.checkout.firstName}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP / Postal code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t.checkout.orderSummary}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((it, idx) => {
                      const name =
                        typeof it.product?.name === "object"
                          ? it.product?.name?.en
                          : it.product?.name

                      const qty = safeNumber(it.quantity)
                      const price = safeNumber(it.price)

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="text-sm">
                            <div className="font-medium">{name || "Product"}</div>
                            <div className="opacity-70">
                              Qty: {qty} × € {to2(price)}
                            </div>
                          </div>
                          <div className="font-medium">€ {to2(price * qty)}</div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                     <span>{t.cart.subtotal}</span>
                      <span>€ {to2(subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>€ {to2(shipping)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold">€ {to2(total)}</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      className="w-full"
                      disabled={isProcessing || !canSubmit}
                      onClick={handleCheckout}
                    >
                      Place Order
                    </Button>

                    <Button
                      type="button"
                      className="w-full"
                      variant="secondary"
                      disabled={isProcessing || !canSubmit}
                      onClick={handlePayPalCheckout}
                    >
                      Pay with PayPal
                    </Button>
                  </div>

                  {!canSubmit && (
                    <p className="text-xs opacity-70">
                      Fill in all fields to enable payment.
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
