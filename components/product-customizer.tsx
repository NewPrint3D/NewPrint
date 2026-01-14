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

type ColorImage = { color?: string; hex?: string; url?: string; imageUrl?: string; image_url?: string }

interface ProductCustomizerProps {
  product: Product
  onVariantChange?: (v: { color: string; size: string; material: string; price: number; image: string }) => void
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
    "#000000": "Black",
    "#F5F5F5": "White",
    "#212121": "Dark Gray",
    "#D32F2F": "Red",
  }
  return colorMap[hex?.toUpperCase()] || hex
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

const normalizeHex = (hex?: string) => (hex || "").trim().toLowerCase()

const toArray = (v: any): string[] => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean)
  return []
}

export function ProductCustomizer({ product, onVariantChange }: ProductCustomizerProps) {
  const { t, locale } = useLanguage()
  const { addItem } = useCart()

  // ---- Normaliza campos que às vezes vêm como string do banco
  const colors = useMemo(() => toArray((product as any).colors), [product])
  const sizes = useMemo(() => toArray((product as any).sizes), [product])
  const materials = useMemo(() => toArray((product as any).materials), [product])

  // ---- base image principal (pode vir como image_url, imageUrl ou image)
  const baseImage =
    (product as any).image_url ||
    (product as any).imageUrl ||
    (product as any).image ||
    "/placeholder.svg"

  // ---- color_images vindo do admin (array de {color, url})
  const colorImages: ColorImage[] = useMemo(() => {
    const raw = (product as any).color_images || (product as any).colorImages || []
    return Array.isArray(raw) ? raw : []
  }, [product])

  const getImageForColor = (hex: string) => {
    const key = normalizeHex(hex)
    const found = colorImages.find((ci) => normalizeHex(ci.color || ci.hex) === key)
    return (
      found?.url ||
      found?.imageUrl ||
      found?.image_url ||
      baseImage
    )
  }

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
    "19cm": 0,
  }

  const basePrice = safeNumber((product as any).basePrice ?? (product as any).base_price ?? (product as any).price)

  const getMaterialExtra = (material: string) => materialPrices[material] ?? 0
  const getSizeExtra = (size: string) => sizePrices[size] ?? 0

  const storageKey = `np3d:product:${(product as any).id}:variant`

  // defaults seguros
  const defaultColor = colors[0] || "#000000"
  const defaultSize = sizes[0] || "Standard"
  const defaultMaterial = materials[0] || "PLA"
  const defaultImage = getImageForColor(defaultColor)

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize)
  const [selectedMaterial, setSelectedMaterial] = useState<string>(defaultMaterial)
  const [selectedImage, setSelectedImage] = useState<string>(defaultImage)

  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const totalPrice = basePrice + getMaterialExtra(selectedMaterial) + getSizeExtra(selectedSize)

  const notifyVariantChange = (color: string, size: string, material: string, image: string) => {
    const price = basePrice + getMaterialExtra(material) + getSizeExtra(size)
    onVariantChange?.({ color, size, material, price, image })
  }

  // carrega localStorage (se existir) e sincroniza com pai
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) {
        // dispara o default pro pai logo ao montar
        notifyVariantChange(defaultColor, defaultSize, defaultMaterial, defaultImage)
        return
      }

      const parsed = JSON.parse(saved) as { color?: string; size?: string; material?: string; image?: string }

      const c = parsed.color && colors.includes(parsed.color) ? parsed.color : defaultColor
      const s = parsed.size && sizes.includes(parsed.size) ? parsed.size : defaultSize
      const m = parsed.material && materials.includes(parsed.material) ? parsed.material : defaultMaterial
      const img = parsed.image || getImageForColor(c)

      setSelectedColor(c)
      setSelectedSize(s)
      setSelectedMaterial(m)
      setSelectedImage(img)

      notifyVariantChange(c, s, m, img)
    } catch {
      notifyVariantChange(defaultColor, defaultSize, defaultMaterial, defaultImage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = (next: { color: string; size: string; material: string; image: string }) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {}
  }

  const handleColorChange = (color: string) => {
    const img = getImageForColor(color)
    setSelectedColor(color)
    setSelectedImage(img)
    persist({ color, size: selectedSize, material: selectedMaterial, image: img })
    notifyVariantChange(color, selectedSize, selectedMaterial, img)
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    persist({ color: selectedColor, size, material: selectedMaterial, image: selectedImage })
    notifyVariantChange(selectedColor, size, selectedMaterial, selectedImage)
  }

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material)
    persist({ color: selectedColor, size: selectedSize, material, image: selectedImage })
    notifyVariantChange(selectedColor, selectedSize, material, selectedImage)
  }

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedColor,
      selectedSize,
      selectedMaterial,
      price: totalPrice,
      // 🔥 ESSENCIAL: mandar a imagem selecionada pro carrinho
      selectedImage,
    } as any)

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.color}</Label>

          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={t.customizer.color}>
            {colors.map((color) => {
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

        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.size}</Label>
          <RadioGroup value={selectedSize} onValueChange={handleSizeChange} className="flex flex-wrap gap-3">
            {sizes.map((size) => (
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

        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.material}</Label>
          <RadioGroup value={selectedMaterial} onValueChange={handleMaterialChange} className="space-y-3">
            {materials.map((material) => (
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
