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

type ColorImage = {
  color?: string
  hex?: string
  url?: string
  imageUrl?: string
  image_url?: string
  name?: string
  label?: string
  colorName?: string
}

interface ProductCustomizerProps {
  product: Product
  onVariantChange?: (v: {
    color: string
    colorName: string
    size: string
    material: string
    price: number
    image: string
  }) => void

  selectedColorHex?: string
  selectedColorName?: string
  selectedImageUrl?: string
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

const toLower = (v: string) => (v || "").toLowerCase().trim()

const normalizeForCompare = (hex: string) => {
  const h = normalizeHex(hex).toLowerCase()
  if (/^#[0-9a-f]{3}$/i.test(h)) {
    const r = h[1]
    const g = h[2]
    const b = h[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return h
}

const getLocaleColorName = (locale: string, key: string) => {
  const k = key.toLowerCase()
  const dict: Record<string, Record<string, string>> = {
    es: {
      black: "Negro",
      white: "Blanco",
      gray: "Gris",
      grey: "Gris",
      red: "Rojo",
      blue: "Azul",
      green: "Verde",
      yellow: "Amarillo",
      gold: "Dorado",
      silver: "Plateado",
    },
    pt: {
      black: "Preto",
      white: "Branco",
      gray: "Cinza",
      grey: "Cinza",
      red: "Vermelho",
      blue: "Azul",
      green: "Verde",
      yellow: "Amarelo",
      gold: "Dourado",
      silver: "Prateado",
    },
    en: {
      black: "Black",
      white: "White",
      gray: "Gray",
      grey: "Gray",
      red: "Red",
      blue: "Blue",
      green: "Green",
      yellow: "Yellow",
      gold: "Gold",
      silver: "Silver",
    },
  }

  const base = dict[locale] || dict.es
  return base[k] || ""
}

const guessColorByHex = (hex: string, locale: string) => {
  const h = normalizeForCompare(hex)

  const hexMap: Record<string, string> = {
    "#000000": "black",
    "#ffffff": "white",
    "#ff0000": "red",
    "#00ff00": "green",
    "#0000ff": "blue",
    "#ffff00": "yellow",
    "#ffd700": "gold",
    "#c0c0c0": "silver",
    "#808080": "gray",
    "#212121": "gray",
    "#1f1f1f": "gray",
  }

  if (hexMap[h]) return getLocaleColorName(locale, hexMap[h])

  // amarelos comuns (bom para seu caso)
  if (
    h.startsWith("#") &&
    h.length === 7 &&
    h.slice(1, 3) === "ff" &&
    h.slice(3, 5) === "ff" &&
    Number.parseInt(h.slice(5, 7), 16) <= 60
  ) {
    return getLocaleColorName(locale, "yellow")
  }

  return ""
}

const guessColorByUrl = (url: string, locale: string) => {
  const u = toLower(url)
  if (!u) return ""

  if (u.includes("amarillo") || u.includes("yellow") || u.includes("amarelo")) return getLocaleColorName(locale, "yellow")
  if (u.includes("rojo") || u.includes("red") || u.includes("vermelho")) return getLocaleColorName(locale, "red")
  if (u.includes("negro") || u.includes("black") || u.includes("preto")) return getLocaleColorName(locale, "black")
  if (u.includes("gris") || u.includes("gray") || u.includes("cinza") || u.includes("grey")) return getLocaleColorName(locale, "gray")
  if (u.includes("azul") || u.includes("blue")) return getLocaleColorName(locale, "blue")
  if (u.includes("verde") || u.includes("green")) return getLocaleColorName(locale, "green")

  return ""
}

const isGenericColorName = (name: string) => {
  const n = toLower(name)
  if (!n) return true
  // textos genéricos que NÃO são nome de cor
  if (n.includes("color seleccion")) return true
  if (n.includes("cor selecion")) return true
  if (n.includes("selected color")) return true
  if (n.includes("selected")) return true
  if (n.includes("selecciona el color")) return true
  if (n.includes("select the color")) return true
  // se for um HEX, também não é nome
  if (/^#[0-9a-f]{3,6}$/i.test(n)) return true
  return false
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

  const colors = useMemo(() => toArray((product as any).colors), [product])
  const sizesRaw = useMemo(() => toArray((product as any).sizes), [product])
  const materials = useMemo(() => toArray((product as any).materials), [product])

  const baseImage =
    (product as any).image_url ||
    (product as any).imageUrl ||
    (product as any).image ||
    "/placeholder.svg"

  const colorImages: ColorImage[] = useMemo(() => {
    const raw = (product as any).color_images || (product as any).colorImages || []
    return Array.isArray(raw) ? raw : []
  }, [product])

  const colorNamesFromProduct = useMemo(() => {
    const raw =
      (product as any).color_names ||
      (product as any).colorNames ||
      (product as any).color_labels ||
      (product as any).colorLabels ||
      null
    return raw
  }, [product])

  const getImageForColor = (hex: string) => {
    const key = normalizeForCompare(hex)
    const found = colorImages.find((ci) => normalizeForCompare(ci.color || ci.hex || "") === key)
    return found?.url || found?.imageUrl || found?.image_url || baseImage
  }

  const getNameForColor = (hex: string, urlMaybe?: string) => {
    const key = normalizeForCompare(hex)

    // 1) dict no produto
    if (colorNamesFromProduct && typeof colorNamesFromProduct === "object" && !Array.isArray(colorNamesFromProduct)) {
      const dict = colorNamesFromProduct as Record<string, string>
      const direct = dict[key] || dict[key.toUpperCase()] || dict[key.toLowerCase()]
      if (direct) return direct
    }

    // 2) color_images
    const found = colorImages.find((ci) => normalizeForCompare(ci.color || ci.hex || "") === key)
    const fromCi = found?.name || found?.label || found?.colorName
    if (fromCi) return fromCi

    // 3) HEX
    const guessedHex = guessColorByHex(key, locale)
    if (guessedHex) return guessedHex

    // 4) URL
    if (urlMaybe) {
      const guessedUrl = guessColorByUrl(urlMaybe, locale)
      if (guessedUrl) return guessedUrl
    }

    return ""
  }

  // ✅ remove extras (inclui PETG +8€)
  const materialPrices: Record<string, number> = { PLA: 0, ABS: 0, PETG: 0 }

  // ✅ remove "Standard" da UI
  const sizes = useMemo(() => sizesRaw.filter((s) => toLower(s) !== "standard"), [sizesRaw])
  const sizePrices: Record<string, number> = { Small: 0, Medium: 0, Large: 0, Standard: 0, "19cm": 0 }

  const basePrice = safeNumber((product as any).basePrice ?? (product as any).base_price ?? (product as any).price)
  const getMaterialExtra = (material: string) => materialPrices[material] ?? 0
  const getSizeExtra = (size: string) => sizePrices[size] ?? 0

  const storageKey = `np3d:product:${(product as any).id}:variant`

  const defaultColor = colors[0] || "#000000"
  const internalDefaultSize = sizes.length > 0 ? sizes[0] : (sizesRaw[0] || "Standard")
  const defaultMaterial = materials[0] || "PLA"

  const initialColor = selectedColorHex || defaultColor
  const initialImage = selectedImageUrl || getImageForColor(initialColor)

  const initialName =
    selectedColorName && !isGenericColorName(selectedColorName)
      ? selectedColorName.trim()
      : getNameForColor(initialColor, initialImage)

  const [selectedColor, setSelectedColor] = useState<string>(initialColor)
  const [selectedSize, setSelectedSize] = useState<string>(internalDefaultSize)
  const [selectedMaterial, setSelectedMaterial] = useState<string>(defaultMaterial)
  const [selectedImage, setSelectedImage] = useState<string>(initialImage)
  const [colorName, setColorName] = useState<string>(initialName)

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) {
        const c = selectedColorHex || defaultColor
        const img = selectedImageUrl || getImageForColor(c)

        const cName =
          selectedColorName && !isGenericColorName(selectedColorName)
            ? selectedColorName.trim()
            : getNameForColor(c, img)

        setSelectedColor(c)
        setSelectedImage(img)
        setColorName(cName)

        notifyVariantChange(c, cName, internalDefaultSize, defaultMaterial, img)
        return
      }

      const parsed = JSON.parse(saved) as { color?: string; colorName?: string; size?: string; material?: string; image?: string }

      const c = selectedColorHex || (parsed.color && colors.includes(parsed.color) ? parsed.color : defaultColor)

      const allSizesForValidation = sizesRaw.length > 0 ? sizesRaw : ["Standard"]
      const s = parsed.size && allSizesForValidation.includes(parsed.size) ? parsed.size : internalDefaultSize

      const m = parsed.material && materials.includes(parsed.material) ? parsed.material : defaultMaterial
      const img = selectedImageUrl || parsed.image || getImageForColor(c)

      const parsedName = parsed.colorName || ""
      const cName =
        selectedColorName && !isGenericColorName(selectedColorName)
          ? selectedColorName.trim()
          : (!isGenericColorName(parsedName) ? parsedName.trim() : getNameForColor(c, img))

      setSelectedColor(c)
      setSelectedSize(s)
      setSelectedMaterial(m)
      setSelectedImage(img)
      setColorName(cName)

      notifyVariantChange(c, cName, s, m, img)
    } catch {
      const c = selectedColorHex || defaultColor
      const img = selectedImageUrl || getImageForColor(c)
      const cName =
        selectedColorName && !isGenericColorName(selectedColorName)
          ? selectedColorName.trim()
          : getNameForColor(c, img)

      notifyVariantChange(c, cName, internalDefaultSize, defaultMaterial, img)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedColorHex && !selectedImageUrl && !selectedColorName) return

    const nextColor = selectedColorHex || selectedColor
    const nextImage = selectedImageUrl || selectedImage

    const nextName =
      selectedColorName && !isGenericColorName(selectedColorName)
        ? selectedColorName.trim()
        : getNameForColor(nextColor, nextImage)

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
      selectedColor,
      selectedColorName: colorName,
      selectedSize,
      selectedMaterial,
      price: totalPrice,
      selectedImage,
    } as any)

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const showSizeSection = sizes.length > 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div>
          <Label className="text-base font-bold mb-2 block">{t.customizer.color}</Label>
          <div className="text-sm text-muted-foreground">
            {colorName ? (
              <span className="font-medium text-foreground">{colorName}</span>
            ) : (
              <span className="italic">{t.products.selectColorHint}</span>
            )}
          </div>

          {!hideColorButtons && (
            <div className="mt-3 text-xs text-muted-foreground">
              HEX: <span className="font-mono">{selectedColor}</span>
            </div>
          )}
        </div>

        {showSizeSection && (
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
        )}

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
