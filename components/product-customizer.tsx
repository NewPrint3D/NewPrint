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
import { ShoppingCart, CheckCircle } from "lucide-react"
import type { Product } from "@/lib/products"

type ColorImage = { color?: string; hex?: string; url?: string; imageUrl?: string; image_url?: string }

interface ProductCustomizerProps {
  product: Product
  onVariantChange?: (v: { color: string; colorName: string; size: string; material: string; price: number; image: string }) => void

  // ✅ vindo da galeria (ProductDetailClient)
  selectedColorHex?: string
  selectedColorName?: string
  selectedImageUrl?: string

  // ✅ para esconder qualquer UI de cor
  hideColorButtons?: boolean
}

const safeNumber = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : (v as number)
  return Number.isFinite(n) ? n : 0
}

const normalizeHex = (hex?: string) => (hex || "").trim()

const toArray = (v: any): string[] => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean)
  return []
}

export function ProductCustomizer({
  product,
  onVariantChange,
  selectedColorHex,
  selectedColorName,
  selectedImageUrl,
  hideColorButtons = true,
}: ProductCustomizerProps) {
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
    const key = normalizeHex(hex).toLowerCase()
    const found = colorImages.find((ci) => normalizeHex(ci.color || ci.hex).toLowerCase() === key)
    return found?.url || found?.imageUrl || found?.image_url || baseImage
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
  const defaultColorName = selectedColorName || ""

  const [selectedColor, setSelectedColor] = useState<string>(selectedColorHex || defaultColor)
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize)
  const [selectedMaterial, setSelectedMaterial] = useState<string>(defaultMaterial)
  const [selectedImage, setSelectedImage] = useState<string>(selectedImageUrl || defaultImage)
  const [colorName, setColorName] = useState<string>(selectedColorName || defaultColorName)

  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const totalPrice = basePrice + getMaterialExtra(selectedMaterial) + getSizeExtra(selectedSize)

  const notifyVariantChange = (color: string, cName: string, size: string, material: string, image: string) => {
    const price = basePrice + getMaterialExtra(material) + getSizeExtra(size)
    onVariantChange?.({ color, colorName: cName, size, material, price, image })
  }

  const persist = (next: { color: string; colorName: string; size: string; material: string; image: string }) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {}
  }

  // ✅ 1) Ao montar: carrega do storage (se existir), mas PRIORIDADE é o que vem da galeria (props)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) {
        const c = selectedColorHex || defaultColor
        const img = selectedImageUrl || getImageForColor(c)
        const cName = selectedColorName || ""
        setSelectedColor(c)
        setSelectedImage(img)
        setColorName(cName)
        notifyVariantChange(c, cName, defaultSize, defaultMaterial, img)
        return
      }

      const parsed = JSON.parse(saved) as { color?: string; colorName?: string; size?: string; material?: string; image?: string }

      const c = selectedColorHex || (parsed.color && colors.includes(parsed.color) ? parsed.color : defaultColor)
      const s = parsed.size && sizes.includes(parsed.size) ? parsed.size : defaultSize
      const m = parsed.material && materials.includes(parsed.material) ? parsed.material : defaultMaterial
      const img = selectedImageUrl || parsed.image || getImageForColor(c)
      const cName = selectedColorName || parsed.colorName || ""

      setSelectedColor(c)
      setSelectedSize(s)
      setSelectedMaterial(m)
      setSelectedImage(img)
      setColorName(cName)

      notifyVariantChange(c, cName, s, m, img)
    } catch {
      const c = selectedColorHex || defaultColor
      const img = selectedImageUrl || getImageForColor(c)
      const cName = selectedColorName || ""
      notifyVariantChange(c, cName, defaultSize, defaultMaterial, img)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ 2) Sempre que a galeria mudar a seleção (props), sincroniza aqui
  useEffect(() => {
    if (!selectedColorHex && !selectedImageUrl && !selectedColorName) return

    const nextColor = selectedColorHex || selectedColor
    const nextImage = selectedImageUrl || selectedImage
    const nextName = selectedColorName || colorName

    setSelectedColor(nextColor)
    setSelectedImage(nextImage)
    setColorName(nextName)

    persist({
      color: nextColor,
      colorName: nextName,
      size: selectedSize,
      material: selectedMaterial,
      image: nextImage,
    })

    notifyVariantChange(nextColor, nextName, selectedSize, selectedMaterial, nextImage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColorHex, selectedImageUrl, selectedColorName])

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    persist({ color: selectedColor, colorName, size, material: selectedMaterial, image: selectedImage })
    notifyVariantChange(selectedColor, colorName, size, selectedMaterial, selectedImage)
  }

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material)
    persist({ color: selectedColor, colorName, size: selectedSize, material, image: selectedImage })
    notifyVariantChange(selectedColor, colorName, selectedSize, material, selectedImage)
  }

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedColor, // HEX
      selectedColorName: colorName, // ✅ NOME (vermelho, preto...)
      selectedSize,
      selectedMaterial,
      price: totalPrice,
      selectedImage, // ✅ IMAGEM DA COR
    } as any)

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        {/* ✅ Sem bolinhas de cor. Só mostramos o nome da cor escolhida (vindo da imagem). */}
        <div>
          <Label className="text-base font-bold mb-2 block">{t.customizer.color}</Label>
          <div className="text-sm text-muted-foreground">
            {colorName ? (
              <span className="font-medium text-foreground">{colorName}</span>
            ) : (
              <span className="italic">{t.product?.selectColorHint ?? "Selecione uma cor pelas imagens."}</span>
            )}
          </div>

          {/* Se você quiser manter “ver” o hex internamente, pode deixar isso escondido */}
          {!hideColorButtons && (
            <div className="mt-3 text-xs text-muted-foreground">
              HEX: <span className="font-mono">{selectedColor}</span>
            </div>
          )}
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
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(totalPrice * quantity, locale)}
            </span>
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
