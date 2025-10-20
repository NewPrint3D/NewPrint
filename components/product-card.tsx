"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, locale } = useLanguage()
  const { addItem } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  const handleQuickAdd = () => {
    const color = product.colors?.[0] ?? "#000000"
    const size = product.sizes?.[0] ?? "Standard"
    const material = product.materials?.[0] ?? "PLA"
    const price = product.basePrice

    addItem({
      product,
      quantity: 1,
      selectedColor: color,
      selectedSize: size,
      selectedMaterial: material,
      price,
    })
  }

  return (
    <Card
      className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 perspective-1000 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-shimmer" />
      </div>

      <div className="relative aspect-square overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name[locale]}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent transition-all duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 sm:flex-row transform transition-all duration-500">
            <Button asChild size="sm" className="flex-1 hover:scale-105 transition-transform duration-300 relative overflow-hidden group/btn">
              <Link href={`/products/${product.id}`}>
                <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                {t.cta.view}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </Link>
            </Button>
            <Button size="sm" className="flex-1 hover:scale-105 transition-transform duration-300 relative overflow-hidden group/btn" onClick={handleQuickAdd}>
              <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              {t.cta.addToCart}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </Button>
          </div>
        </div>
        {product.featured && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground animate-bounce-subtle shadow-lg">
            {t.common.featured}
          </Badge>
        )}
        <div className="absolute top-4 left-4 w-3 h-3 bg-primary rounded-full animate-ping opacity-0 group-hover:opacity-75" />
      </div>

      <CardContent className="p-4 relative">
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary group-hover:scale-105 transition-all duration-300 line-clamp-1 inline-block">
          {product.name[locale]}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 group-hover:text-foreground/70 transition-colors duration-300">
          {product.description[locale]}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
            {product.colors.length} {t.common.colors}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
            {product.sizes.length} {t.common.sizes}
          </span>
        </div>

        <div className="flex gap-1 mb-3">
          {product.colors.slice(0, 5).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border-2 border-background shadow-sm hover:scale-125 hover:z-10 transition-all duration-300 cursor-pointer group-hover:animate-bounce-subtle"
              style={{
                backgroundColor: color,
                animationDelay: `${index * 100}ms`,
              }}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-4">
        <div className="group-hover:scale-105 transition-transform duration-300">
          <p className="text-xs text-muted-foreground">{t.products.from}</p>
          <p className="text-2xl font-bold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text group-hover:text-transparent transition-all duration-300">
            {formatCurrency(product.basePrice, locale)}
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleQuickAdd}
          className="flex-1 hover:scale-105 transition-all duration-300 relative overflow-hidden group/footer-btn"
        >
          <ShoppingCart className="w-4 h-4 mr-2 group-hover/footer-btn:scale-110 transition-transform" />
          {t.cta.addToCart}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/footer-btn:translate-x-full transition-transform duration-700" />
        </Button>
      </CardFooter>
    </Card>
  )
}
