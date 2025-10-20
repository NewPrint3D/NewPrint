"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Check, CheckCircle } from "lucide-react"
import type { Product } from "@/lib/products"

interface ProductCustomizerProps {
  product: Product
  onVariantChange?: (v: { color: string; size: string; material: string; price: number }) => void
}

const getColorName = (hex: string): string => {
  const colorMap: Record<string, string> = {
    "#8B5CF6": "Purple",
    "#06B6D4": "Cyan",
    "#10B981": "Green",
    "#F59E0B": "Orange",
    "#EF4444": "Red",
    "#3B82F6": "Blue",
    "#EC4899": "Pink",
    "#F97316": "Orange",
  }
  return colorMap[hex] || hex
}

export function ProductCustomizer({ product, onVariantChange }: ProductCustomizerProps) {
  const { t, locale } = useLanguage()
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials[0])
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const materialPrices: Record<string, number> = {
    PLA: 0,
    ABS: 5,
    PETG: 8,
  }

  const sizePrices: Record<string, number> = {
    Small: 0,
    Medium: 5,
    Large: 10,
    Standard: 0,
  }

  const totalPrice = product.basePrice + materialPrices[selectedMaterial] + sizePrices[selectedSize]

  const notifyVariantChange = (color: string, size: string, material: string) => {
    const price = product.basePrice + materialPrices[material] + sizePrices[size]
    onVariantChange?.({ color, size, material, price })
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    notifyVariantChange(color, selectedSize, selectedMaterial)
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    notifyVariantChange(selectedColor, size, selectedMaterial)
  }

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material)
    notifyVariantChange(selectedColor, selectedSize, material)
  }

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedColor,
      selectedSize,
      selectedMaterial,
      price: totalPrice,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.color}</Label>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={t.customizer.color}>
            {product.colors.map((color) => {
              const colorName = getColorName(color)
              const isSelected = selectedColor === color
              return (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={t.aria.selectColor.replace("{color}", colorName)}
                  onClick={() => handleColorChange(color)}
                  className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isSelected ? "border-primary ring-4 ring-primary/20" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.size}</Label>
          <RadioGroup value={selectedSize} onValueChange={handleSizeChange} className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <div key={size} className="relative">
                <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-border cursor-pointer transition-all duration-200 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                >
                  {size}
                  {sizePrices[size] > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      +{formatCurrency(sizePrices[size], locale)}
                    </Badge>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.material}</Label>
          <RadioGroup value={selectedMaterial} onValueChange={handleMaterialChange} className="space-y-3">
            {product.materials.map((material) => (
              <div key={material} className="relative">
                <RadioGroupItem value={material} id={`material-${material}`} className="peer sr-only" />
                <Label
                  htmlFor={`material-${material}`}
                  className="flex items-center justify-between p-4 rounded-lg border-2 border-border cursor-pointer transition-all duration-200 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <span className="font-medium">{material}</span>
                  {materialPrices[material] > 0 && (
                    <Badge variant="secondary">+{formatCurrency(materialPrices[material], locale)}</Badge>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.quantity}</Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-10 w-10"
            >
              -
            </Button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold">{quantity}</span>
            </div>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="h-10 w-10">
              +
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-medium text-muted-foreground">{t.customizer.totalPrice}</span>
            <span className="text-3xl font-bold text-primary">{formatCurrency(totalPrice * quantity, locale)}</span>
          </div>

          <Button
            size="lg"
            className="w-full group relative overflow-hidden"
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isAdded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t.customizer.addedToCart}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {t.products.addToCart}
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
