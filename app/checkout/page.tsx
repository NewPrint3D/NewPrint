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
import { PayPalButton } from "@/components/paypal-button"

export default function CheckoutPage() {
  const { t, locale } = useLanguage()
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayPal, setShowPayPal] = useState(false)

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

  const shipping = 9.99
  const tax = totalPrice * 0.1
  const orderTotal = totalPrice + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const order = {
      id: `ORDER-${Date.now()}`,
      items: items,
      subtotal: totalPrice,
      shipping: shipping,
      tax: tax,
      total: orderTotal,
      date: new Date().toISOString(),
      status: "Paid",
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]))

    clearCart()

    toast({
      title: t.checkout.success || "Order placed successfully!",
      description: t.checkout.successMessage || "Your order has been confirmed.",
    })

    router.push("/orders")
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (items.length === 0) {
      router.replace("/cart")
    }
  }, [items, router])

  if (items.length === 0) {
    return null
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t.checkout.title}</h1>

          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-center">
              <strong>{t.demo.mode}:</strong> {t.demo.checkoutMessage}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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

                <Card>
                  <CardHeader>
                    <CardTitle>{t.checkout.paymentInfo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!showPayPal ? (
                      <>
                        <div>
                          <Label htmlFor="cardNumber">{t.checkout.cardNumber}</Label>
                          <Input id="cardNumber" placeholder={t.placeholders.cardNumber} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">{t.checkout.expiryDate}</Label>
                            <Input id="expiryDate" placeholder={t.placeholders.expiryDate} required />
                          </div>
                          <div>
                            <Label htmlFor="cvv">{t.checkout.cvv}</Label>
                            <Input id="cvv" placeholder={t.placeholders.cvv} required />
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              {t.checkout.orPayWith}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPayPal(true)}
                          className="w-full"
                        >
                          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.679H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z" />
                            <path d="M2.379 0h5.791c1.666 0 2.983.414 3.832 1.197.405.374.7.817.91 1.325.224.533.354 1.15.39 1.862.004.052.007.104.011.157a5.622 5.622 0 01-.043 1.162 8.669 8.669 0 01-.36 1.537c-.734 2.543-2.574 3.713-5.49 3.713H5.446a.807.807 0 00-.795.68l-.844 5.345a.483.483 0 01-.477.415H.483a.484.484 0 01-.477-.558L2.379 0z" />
                          </svg>
                          PayPal
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowPayPal(false)}
                          className="mb-4"
                        >
                          ← {t.checkout.creditCard}
                        </Button>
                        <PayPalButton orderData={formData} />
                      </>
                    )}
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

                    <Button
                      type="submit"
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
                          t.checkout.placeOrder
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
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
