"use client"

export const dynamic = "force-dynamic"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { t, locale } = useLanguage()
  const { items, removeItem, updateQuantity, totalPrice } = useCart()

 const freeShippingThreshold = 50
const shipping = totalPrice >= freeShippingThreshold ? 0 : 5.99
const missingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)
const orderTotal = totalPrice + shipping

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="mb-8">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4">{t.cart.empty}</h1>
                <p className="text-muted-foreground mb-8">{t.cart.emptyDescription}</p>
                <Button asChild size="lg">
                  <Link href="/products">
                    {t.cart.continueShopping}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t.cart.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${item.selectedMaterial}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name[locale]}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{item.product.name[locale]}</h3>
                            <p className="text-sm text-muted-foreground">{item.product.description[locale]}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeItem(item.product.id, item.selectedColor, item.selectedSize, item.selectedMaterial)
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{t.cart.color}:</span>
                            <div
                              className="w-5 h-5 rounded-full border-2 border-border"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t.cart.size}:</span>{" "}
                            <span className="font-medium">{item.selectedSize}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t.cart.material}:</span>{" "}
                            <span className="font-medium">{item.selectedMaterial}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedColor,
                                  item.selectedSize,
                                  item.selectedMaterial,
                                  item.quantity - 1,
                                )
                              }
                            >
                              -
                            </Button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedColor,
                                  item.selectedSize,
                                  item.selectedMaterial,
                                  item.quantity + 1,
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.price, locale)} {t.cart.perItem}
                            </p>
                            <p className="text-xl font-bold text-primary">
                              {formatCurrency(item.price * item.quantity, locale)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold mb-6">{t.cart.orderSummary ?? t.checkout.orderSummary}</h2>
                  <div className="mb-4 rounded-lg border p-3 text-sm">
                  <div className="font-medium">
                 🚚 {t.cart.freeShippingAbove50}
            </div>
             {missingForFreeShipping > 0 ? (
            <div className="text-muted-foreground mt-1">
          💡 {t.cart.missingForFreeShipping} {formatCurrency(missingForFreeShipping, locale)}
          </div>
          ) : (
         <div className="text-muted-foreground mt-1">
         ✅ {t.cart.freeShippingApplied}
          </div>
            )}
            </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.cart.subtotal}</span>
                      <span className="font-medium">{formatCurrency(totalPrice, locale)}</span>
                    </div>
                    {shipping > 0 && (
                      <div className="flex items-center justify-between">
                       <span className="text-muted-foreground">{t.cart.shipping}</span>
                       <span className="font-medium">{formatCurrency(shipping, locale)}</span>
                      </div>
                     )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.cart.tax}</span>                      
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{t.cart.orderTotal}</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(orderTotal, locale)}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full group relative overflow-hidden mt-6">
                    <Link href="/checkout">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {t.cart.proceedToCheckout}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                    <Link href="/products">{t.cart.continueShopping}</Link>
                  </Button>
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
