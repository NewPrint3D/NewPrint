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

const COLOR_NAME_MAP: Record<string, string> = {
  "#000000": "Preto", "#ffffff": "Branco", "#f5f5f5": "Branco",
  "#212121": "Cinza", "#808080": "Cinza", "#ff0000": "Vermelho", "#d32f2f": "Vermelho",
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
  const orderTotal = totalPrice + shipping

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 text-center container mx-auto px-4">
          <div className="max-w-2xl mx-auto py-16">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">{(t as any).cart?.empty || "Carrinho Vazio"}</h1>
            <Button asChild><Link href="/products">{(t as any).cart?.continueShopping || "Continuar Comprando"}</Link></Button>
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
        <h1 className="text-4xl font-bold mb-8">{(t as any).cart?.title || "Carrinho"}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}>
                <CardContent className="p-6 flex gap-6">
                  <img src={(item as any).selectedImage || item.product.image || "/placeholder.svg"} className="w-32 h-32 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-bold">{(item.product.name as any)?.[locale] || "Produto"}</h3>
                    <div className="text-sm text-muted-foreground">
                      {getColorName(item.selectedColor)} | {item.selectedSize} | {item.selectedMaterial}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.selectedMaterial, item.quantity - 1)}>-</Button>
                        <span>{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.selectedMaterial, item.quantity + 1)}>+</Button>
                      </div>
                      <span className="font-bold">{formatCurrency(item.price * item.quantity, locale)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize, item.selectedMaterial)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="h-fit">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Resumo</h2>
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totalPrice, locale)}</span></div>
              <div className="flex justify-between border-t pt-2 font-bold"><span>Total</span><span>{formatCurrency(orderTotal, locale)}</span></div>
              <Button asChild className="w-full mt-4"><Link href="/checkout">Finalizar Compra</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
