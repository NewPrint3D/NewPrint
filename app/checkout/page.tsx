"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// shadcn/ui (Adjust if your paths are different.)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Ex: import { useCart } from "@/contexts/cart-context"
import { useCart } from "@/contexts/cart-context"

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

  const { items } = useCart() as { items: CartItem[] } //Adjust if your hook returns more data. 

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
    country: "España",
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

   const shipping = 5.99
  const tax = 1.1
  const total = useMemo(() => subtotal + shipping + tax, [subtotal])

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
  // STRIPE 
  // =========================
  const handleCheckout = async () => {
    if (!canSubmit) {
      toast({
        title: "Fill in the details",
        description: "Complete the form before paying",
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
        throw new Error("The URL did not come from the backend.(Stripe)")
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // =========================
  // PAYPAL
  // =========================
  const handlePayPalCheckout = async () => {
    if (!canSubmit) {
      toast({
        title: "Fill in the details.",
        description: "Complete the form before paying",
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
        throw new Error(data?.error || "Failed to create PayPal order")
      }

           if (!data?.approveUrl) {
        console.log("PayPal response:", data)
       throw new Error("approveUrl did not come from the backend.")
      }

      // Redirect to PayPal
      window.location.href = data.approveUrl
    } catch (error) {
      console.error("PayPal checkout error:", error)
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
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
          <h1 className="text-4xl font-bold mb-8">Complete Purchase</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName">lastName</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">city</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">state</Label>
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
                      <Label htmlFor="zipCode">CEP</Label>
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
                  <CardTitle>summary of the request</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {(items || []).map((it, idx) => {
                      const name =
                        typeof it.product?.name === "object"
                          ? it.product?.name?.en
                          : it.product?.name
                      const qty = safeNumber(it.quantity)
                      const price = safeNumber(it.price)
                      return (
                        <div key={idx} className="flex items-center justify-between gap-3">
                          <div className="text-sm">
                            <div className="font-medium">{name || "Product"}</div>
                            <div className="opacity-70">Qtd.: {qty} × € {to2(price)}</div>
                          </div>
                          <div className="font-medium">€ {to2(price * qty)}</div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>€ {to2(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envio</span>
                      <span>€ {to2(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impostos</span>
                      <span>€ {to2(tax)}</span>
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
                      Fill in all the fields to enable payment.
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
