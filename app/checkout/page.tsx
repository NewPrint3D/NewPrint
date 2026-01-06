"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { t, locale } = useLanguage()
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const shipping = 5.99
  const tax = totalPrice * 0.1
  const orderTotal = totalPrice + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckout = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/checkout/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
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
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: t.errors?.paymentFailed || "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }
const handlePayPalCheckout = async () => {
  setIsProcessing(true)

  try {
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
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
try {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || "Failed to create PayPal order")
  }

  if (!data?.approveUrl) {
    console.log("PayPal response:", data)
    throw new Error("approveUrl não veio do backend")
  }

  // Redirect to PayPal
  window.location.href = data.approveUrl
} catch (error) {
  console.error("PayPal checkout error:", error)
  toast({
    title: t.errors?.paymentFailed || "Payment Failed",
    description: error instanceof Error ? error.message : "Please try again",
    variant: "destructive",
  })
}

    console.error("PayPal checkout error:", error)
    toast({
      title: t.errors?.paymentFailed || "Payment Failed",
      description: error instanceof Error ? error.message : "Please try again",
      variant: "destructive",
    })
  } finally {
    setIsProcessing(false)
  }
}

  useEffect(() => {
    if (typeof window === "undefined") return
    if (items.length === 0) router.replace("/cart")
  }, [items, router])

  if (items.length === 0) return null

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t.checkout.title}</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
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
                        <Label htmlFor="lastName">{t.checkout.lastName}</Label>
                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">{t.checkout.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t.placeholders.email}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t.checkout.phone}</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="address">{t.checkout.address}</Label>
                      <Input id="address" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t.checkout.city}</Label>
                        <Input id="city" value={formData.city} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="state">{t.checkout.state}</Label>
                        <Input id="state" value={formData.state} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">{t.checkout.zipCode}</Label>
                        <Input id="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="country">{t.checkout.country}</Label>
                        <Input id="country" value={formData.country} onChange={handleInputChange} required />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>{t.checkout.orderSummary}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                          className="flex items-center gap-3 pb-3 border-b border-border last:border-0"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name[locale]}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.product.name[locale]}</p>
                            <p className="text-xs text-muted-foreground">
                              {t.cart.qtyLabel}: {item.quantity} × {formatCurrency(item.price, locale)}
                            </p>
                          </div>
                          <p className="font-bold text-sm">{formatCurrency(item.price * item.quantity, locale)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.subtotal}</span>
                        <span className="font-medium">{formatCurrency(totalPrice, locale)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.shipping}</span>
                        <span className="font-medium">{formatCurrency(shipping, locale)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.tax}</span>
                        <span className="font-medium">{formatCurrency(tax, locale)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-lg font-bold">{t.cart.total}</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(orderTotal, locale)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                     <Button
                    type="button"
                onClick={handleCheckout}
               size="lg"
              className="w-full group relative overflow-hidden"
              disabled={isProcessing}
              >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {t.checkout.processing}
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                              </svg>
                              {t.checkout.placeOrder}
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                      <Button
                    type="button"
               onClick={handlePayPalCheckout}
               size="lg"
              className="w-full group relative overflow-hidden"
              disabled={isProcessing}
              >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {t.checkout.processing}
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                              </svg>
                             Pay with PayPal 
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button> 
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}
