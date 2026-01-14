"use client"

import { useEffect, useMemo, useState } from "react"
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
  product: any
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

const safeNumber = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : (v as number)
  return Number.isFinite(n) ? n : 0
}

const isLightHex = (hex: string) => {
  const h = (hex || "").replace("#", "")
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.75
}

export function ProductCustomizer({ product, onVariantChange }: ProductCustomizerProps) {
  const { t, locale } = useLanguage()
  const { addItem } = useCart()

  // ✅ garante arrays (evita .map quebrar)
  const colors = useMemo(() => (Array.isArray(product?.colors) ? product.colors : []), [product])
  const sizes = useMemo(() => (Array.isArray(product?.sizes) ? product.sizes : []), [product])
  const materials = useMemo(() => (Array.isArray(product?.materials) ? product.materials : []), [product])

  // ✅ defaults seguros (evita [0] quebrar)
  const defaultColor = colors[0] ?? "#88CFC6"
  const defaultSize = sizes[0] ?? "Standard"
  const defaultMaterial = materials[0] ?? "PLA"

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize)
  const [selectedMaterial, setSelectedMaterial] = useState<string>(defaultMaterial)

  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const storageKey = `np3d:product:${product?.id ?? "unknown"}:variant`

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

const basePrice = safeNumber(product?.basePrice ?? product?.base_price)

  const getMaterialExtra = (material: string) => materialPrices[material] ?? 0
  const getSizeExtra = (size: string) => sizePrices[size] ?? 0

  const totalPrice = basePrice + getMaterialExtra(selectedMaterial) + getSizeExtra(selectedSize)

  const notifyVariantChange = (color: string, size: string, material: string) => {
    const price = basePrice + getMaterialExtra(material) + getSizeExtra(size)
    onVariantChange?.({ color, size, material, price })
  }

  // ✅ quando o produto muda e chegam arrays diferentes, ajusta os selecionados
  useEffect(() => {
    // cor
    if (colors.length > 0 && !colors.includes(selectedColor)) {
      setSelectedColor(colors[0])
      notifyVariantChange(colors[0], selectedSize, selectedMaterial)
    }
    // size
    if (sizes.length > 0 && !sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0])
      notifyVariantChange(selectedColor, sizes[0], selectedMaterial)
    }
    // material
    if (materials.length > 0 && !materials.includes(selectedMaterial)) {
      setSelectedMaterial(materials[0])
      notifyVariantChange(selectedColor, selectedSize, materials[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.join("|"), sizes.join("|"), materials.join("|")])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return

      const parsed = JSON.parse(saved) as { color?: string; size?: string; material?: string }

      const c = parsed.color ?? selectedColor
      const s = parsed.size ?? selectedSize
      const m = parsed.material ?? selectedMaterial

      // aplica só se fizer sentido
      if (c) setSelectedColor(c)
      if (s) setSelectedSize(s)
      if (m) setSelectedMaterial(m)

      notifyVariantChange(c, s, m)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color, size: selectedSize, material: selectedMaterial }))
    } catch {}
    notifyVariantChange(color, selectedSize, selectedMaterial)
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor, size, material: selectedMaterial }))
    } catch {}
    notifyVariantChange(selectedColor, size, selectedMaterial)
  }

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material)
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor, size: selectedSize, material }))
    } catch {}
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
        {/* ✅ COR */}
        {colors.length > 0 && (
          <div>
            <Label className="text-base font-bold mb-3 block">{t.customizer.color}</Label>
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={t.customizer.color}>
              {colors.map((color: string) => {
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
                    className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200
                      hover:scale-110 active:scale-95
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                      ${isSelected ? "border-primary ring-4 ring-primary/25 shadow-lg" : "border-border hover:shadow-md"}
                    `}
                    style={{ backgroundColor: color }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className={`w-6 h-6 drop-shadow-lg ${isLightHex(color) ? "text-black" : "text-white"}`} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ✅ TAMANHO */}
        {sizes.length > 0 && (
          <div>
            <Label className="text-base font-bold mb-3 block">{t.customizer.size}</Label>
            <RadioGroup value={selectedSize} onValueChange={handleSizeChange} className="flex flex-wrap gap-3">
              {sizes.map((size: string) => (
                <div key={size} className="relative">
                  <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-border cursor-pointer transition-all duration-200 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                  >
                    {size}
                    {(sizePrices[size] ?? 0) > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        +{formatCurrency(sizePrices[size], locale)}
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* ✅ MATERIAL */}
        {materials.length > 0 && (
          <div>
            <Label className="text-base font-bold mb-3 block">{t.customizer.material}</Label>
            <RadioGroup value={selectedMaterial} onValueChange={handleMaterialChange} className="space-y-3">
              {materials.map((material: string) => (
                <div key={material} className="relative">
                  <RadioGroupItem value={material} id={`material-${material}`} className="peer sr-only" />
                  <Label
                    htmlFor={`material-${material}`}
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-border cursor-pointer transition-all duration-200 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <span className="font-medium">{material}</span>
                    {(materialPrices[material] ?? 0) > 0 && (
                      <Badge variant="secondary">+{formatCurrency(materialPrices[material], locale)}</Badge>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* ✅ QUANTIDADE */}
        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.quantity}</Label>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10">
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

        {/* ✅ TOTAL + ADD */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-medium text-muted-foreground">{t.customizer.totalPrice}</span>
            <span className="text-3xl font-bold text-primary">{formatCurrency(totalPrice * quantity, locale)}</span>
          </div>

          <Button size="lg" className="w-full group relative overflow-hidden" onClick={handleAddToCart} disabled={isAdded}>
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
