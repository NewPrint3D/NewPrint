"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react"
import Link from "next/link"

const COLOR_NAME_MAP: Record<string, string> = {
  "#000000": "Preto",
  "#ffffff": "Branco",
  "#f5f5f5": "Branco",
  "#212121": "Cinza",
  "#808080": "Cinza",
  "#ff0000": "Vermelho",
  "#d32f2f": "Vermelho",
}

function getColorName(color?: string) {
  if (!color) return ""
  return COLOR_NAME_MAP[color.toLowerCase()] ?? color
}

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
        <div className="pt-24 pb-12 text-center container mx-auto px-4">
          <div className="max-w-2xl mx-auto py-16">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">{(t as any).cart?.empty || "Tu carrito está vacío"}</h1>
            <p className="text-muted-foreground mb-6">
              {(t as any).cart?.emptyDescription || "Agrega productos para comenzar"}
            </p>
            <Button asChild>
              <Link href="/products">{(t as any).cart?.continueShopping || "Seguir comprando"}</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">{(t as any).cart?.title || "Carrito"}</h1>
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <Link href="/products">
              {(t as any).cart?.continueShopping || "Seguir comprando"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Itens */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${item.selectedMaterial}`}>
                <CardContent className="p-6 flex gap-6">
                  <img
                    src={(item as any).selectedImage || item.product.image || "/placeholder.svg"}
                    className="w-32 h-32 object-cover rounded-lg"
                    alt={(item.product.name as any)?.[locale] || "Producto"}
                    loading="lazy"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold">{(item.product.name as any)?.[locale] || "Producto"}</h3>

                    <div className="text-sm text-muted-foreground mt-1">
                      {getColorName(item.selectedColor)}
                      {item.selectedSize ? ` | ${item.selectedSize}` : ""}
                      {item.selectedMaterial ? ` | ${item.selectedMaterial}` : ""}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
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
                        <span className="min-w-6 text-center">{item.quantity}</span>
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

                      <span className="font-bold">{formatCurrency(item.price * item.quantity, locale)}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize, item.selectedMaterial)}
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo */}
          <Card className="h-fit">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">{(t as any).cart?.summary || "Resumen"}</h2>

              {/* Mensagem frete grátis */}
              <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                <ShoppingCart className="h-4 w-4" />
                {shipping === 0 ? (
                  <span>{(t as any).cart?.freeShippingReached || "¡Envío gratis aplicado!"}</span>
                ) : (
                  <span>
                    {(t as any).cart?.missingForFreeShipping || "Te faltan"}{" "}
                    <b>{formatCurrency(missingForFreeShipping, locale)}</b>{" "}
                    {(t as any).cart?.toGetFreeShipping || "para envío gratis"}
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <span>{(t as any).cart?.subtotal || "Subtotal"}</span>
                <span>{formatCurrency(totalPrice, locale)}</span>
              </div>

              <div className="flex justify-between">
                <span>{(t as any).cart?.shipping || "Envío"}</span>
                <span>{shipping === 0 ? ((t as any).cart?.free || "Gratis") : formatCurrency(shipping, locale)}</span>
              </div>

              <div className="flex justify-between border-t pt-2 font-bold">
                <span>{(t as any).cart?.total || "Total"}</span>
                <span>{formatCurrency(orderTotal, locale)}</span>
              </div>

              <Button asChild className="w-full mt-4">
                <Link href="/checkout">{(t as any).cart?.checkout || "Finalizar compra"}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
