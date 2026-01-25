"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

type ColorLabel = { pt: string; en: string; es: string }

const COLOR_NAME_MAP: Record<string, ColorLabel> = {
  "000000": { pt: "Preto", en: "Black", es: "Negro" },
  "ffffff": { pt: "Branco", en: "White", es: "Blanco" },
  "f5f5f5": { pt: "Branco", en: "White", es: "Blanco" },
  "d32f2f": { pt: "Vermelho", en: "Red", es: "Rojo" },
  "ff0000": { pt: "Vermelho", en: "Red", es: "Rojo" },
  "212121": { pt: "Cinza", en: "Gray", es: "Gris" },
  "808080": { pt: "Cinza", en: "Gray", es: "Gris" },
  "fbc02d": { pt: "Amarelo", en: "Yellow", es: "Amarillo" },
}

function normalizeHex(color?: string) {
  if (!color) return ""
  return color.trim().toLowerCase().replace("#", "")
}

function getColorName(color: string | undefined, locale: "pt" | "en" | "es") {
  if (!color) return ""
  const key = normalizeHex(color)
  const label = COLOR_NAME_MAP[key]
  if (!label) return color
  return (label[locale] || label.pt || "").trim()
}

export default function CartPage() {
  const { t, locale } = useLanguage()
  const { items, removeItem, updateQuantity, totalPrice } = useCart()

  const cartT = ((t as any)?.cart ?? {}) as Record<string, any>
  const checkoutT = ((t as any)?.checkout ?? {}) as Record<string, any>

  const freeShippingThreshold = 50
  const shipping = totalPrice >= freeShippingThreshold ? 0 : 5.99
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)
  const orderTotal = totalPrice + shipping

  const thresholdText = formatCurrency(freeShippingThreshold, locale)
  const missingText = formatCurrency(missingForFreeShipping, locale)

  const fs = {
    missingTitle:
      locale === "pt"
        ? `Faltam ${missingText} para ganhar frete grátis`
        : locale === "es"
          ? `Te faltan ${missingText} para conseguir envío gratis`
          : `Add ${missingText} more to get free shipping`,
    missingSubtitle:
      locale === "pt"
        ? `Compras acima de ${thresholdText} têm frete grátis.`
        : locale === "es"
          ? `Pedidos superiores a ${thresholdText} tienen envío gratis.`
          : `Orders over ${thresholdText} ship free.`,
    appliedTitle:
      locale === "pt"
        ? "Frete grátis aplicado ✅"
        : locale === "es"
          ? "Envío gratis aplicado ✅"
          : "Free shipping applied ✅",
    appliedSubtitle:
      locale === "pt"
        ? `Você atingiu ${thresholdText} ou mais.`
        : locale === "es"
          ? `Has alcanzado ${thresholdText} o más.`
          : `You reached ${thresholdText} or more.`,
  }

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

                <h1 className="text-3xl font-bold mb-4">{cartT.empty ?? "Cart is empty"}</h1>
                <p className="text-muted-foreground mb-8">
                  {cartT.emptyDescription ?? "Add products to your cart to continue."}
                </p>

                <Button asChild size="lg">
                  <Link href="/products">
                    {cartT.continueShopping ?? "Continue shopping"}
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
          <h1 className="text-4xl font-bold mb-8">{cartT.title ?? "Cart"}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card
                  key={(item as any).cartKey || `${item.product.id}-${item.selectedColor}-${item.selectedSize}-${item.selectedMaterial}`}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={(item as any).selectedImage || item.product.image || "/placeholder.svg"}
                          alt={item.product.name?.[locale] ?? item.product.name?.en ?? "Product"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg mb-1">
                              {item.product.name?.[locale] ?? item.product.name?.en ?? "Product"}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              {item.product.description?.[locale] ?? item.product.description?.en ?? ""}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeItem(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize,
                                item.selectedMaterial,
                                (item as any).selectedImage,
                              )
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{cartT.color ?? "Color"}:</span>{" "}
                            <span className="font-medium">{getColorName(item.selectedColor, locale)}</span>
                          </div>

                          <div>
                            <span className="text-muted-foreground">{cartT.size ?? "Size"}:</span>{" "}
                            <span className="font-medium">{item.selectedSize}</span>
                          </div>

                          <div>
                            <span className="text-muted-foreground">{cartT.material ?? "Material"}:</span>{" "}
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
                                  Math.max(0, (item.quantity || 0) - 1),
                                  item.selectedColor,
                                  item.selectedSize,
                                  item.selectedMaterial,
                                  (item as any).selectedImage,
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
                                  (item.quantity || 0) + 1,
                                  item.selectedColor,
                                  item.selectedSize,
                                  item.selectedMaterial,
                                  (item as any).selectedImage,
                                )
                              }
                            >
                              +
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.price, locale)} {cartT.perItem ?? "per item"}
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
                  <h2 className="text-2xl font-bold mb-6">
                    {cartT.orderSummary ?? checkoutT.orderSummary ?? "Order summary"}
                  </h2>

                  <div className="rounded-2xl border bg-muted/30 p-4">
                    {missingForFreeShipping > 0 ? (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                        <div className="text-sm">
                          <p className="font-medium">{fs.missingTitle}</p>
                          <p className="text-muted-foreground">{fs.missingSubtitle}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <div className="text-sm">
                          <p className="font-medium">{fs.appliedTitle}</p>
                          <p className="text-muted-foreground">{fs.appliedSubtitle}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{cartT.subtotal ?? "Subtotal"}</span>
                      <span className="font-medium">{formatCurrency(totalPrice, locale)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{cartT.shipping ?? "Shipping"}</span>
                      <span className="font-medium">{formatCurrency(shipping, locale)}</span>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{cartT.orderTotal ?? "Total"}</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(orderTotal, locale)}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full mt-6">
                    <Link href="/checkout">{cartT.proceedToCheckout ?? "Proceed to checkout"}</Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                    <Link href="/products">{cartT.continueShopping ?? "Continue shopping"}</Link>
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
