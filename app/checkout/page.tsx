"use client"

import { useState } from "react"
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

export default function CheckoutPage() {
  const { locale } = useLanguage()
  const { items, totalPrice } = useCart()
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", address: "", city: "", zipCode: ""
  })

  const shipping = totalPrice >= 50 ? 0 : 5.99
  const total = totalPrice + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Informações de Envio</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" value={formData.address} onChange={handleInputChange} required />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.quantity}x {(item.product.name as any)?.[locale] || "Produto"}</span>
                  <span>{formatCurrency(item.price * item.quantity, locale)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totalPrice, locale)}</span></div>
              <div className="flex justify-between"><span>Frete</span><span>{formatCurrency(shipping, locale)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg text-primary">
                <span>Total</span><span>{formatCurrency(total, locale)}</span>
              </div>
              <Button className="w-full mt-6" size="lg">Finalizar e Pagar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
