"use client"

export const dynamic = "force-dynamic"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ArrowLeft, Save, RefreshCw, ImageIcon, Palette } from "lucide-react"

type ProductName = {
  pt?: string
  es?: string
  en?: string
}

type Product = {
  id: string | number
  // compatibilidade com seu backend (pode vir name string ou name objeto)
  name?: ProductName | string
  name_pt?: string
  name_es?: string
  name_en?: string

  base_price?: number
  basePrice?: number
  price?: number

  image_url?: string
  image?: string

  // cores (se existir)
  colors?: Array<{ name?: string; hex?: string; image?: string; image_url?: string }>
}

function isValidHex(hex: string) {
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex.trim())
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { locale } = useLanguage()
  const { isAdmin, isLoading } = useAuth()

  const id = String((params as any)?.id ?? "")

  const ui = useMemo(() => {
    return {
      title: locale === "pt" ? "Editar produto" : locale === "es" ? "Editar producto" : "Edit product",
      back: locale === "pt" ? "Voltar" : locale === "es" ? "Volver" : "Back",
      saving: locale === "pt" ? "Salvando..." : locale === "es" ? "Guardando..." : "Saving...",
      save: locale === "pt" ? "Salvar" : locale === "es" ? "Guardar" : "Save",
      reload: locale === "pt" ? "Recarregar" : locale === "es" ? "Recargar" : "Reload",
      sectionBasics: locale === "pt" ? "Dados do produto" : locale === "es" ? "Datos del producto" : "Product details",
      sectionPricing: locale === "pt" ? "Preço" : locale === "es" ? "Precio" : "Pricing",
      sectionMainImage: locale === "pt" ? "Imagem principal" : locale === "es" ? "Imagen principal" : "Main image",
      sectionColors: locale === "pt" ? "Cores (HEX)" : locale === "es" ? "Colores (HEX)" : "Colors (HEX)",
      namePt: locale === "pt" ? "Nome (PT)" : "Name (PT)",
      nameEs: locale === "es" ? "Nombre (ES)" : "Name (ES)",
      nameEn: locale === "en" ? "Name (EN)" : "Name (EN)",
      price: locale === "pt" ? "Preço base (EUR)" : locale === "es" ? "Precio base (EUR)" : "Base price (EUR)",
      imageUrl: locale === "pt" ? "URL da imagem principal" : locale === "es" ? "URL de la imagen principal" : "Main image URL",
      colorsHelper:
        locale === "pt"
          ? "Cadastre aqui os HEX. As imagens por cor podem ser geradas depois pelo workflow do GitHub."
          : locale === "es"
            ? "Registra aquí los HEX. Las imágenes por color se generan luego con el workflow de GitHub."
            : "Register HEX here. Color images can be generated later via GitHub workflow.",
      addColor: locale === "pt" ? "Adicionar cor" : locale === "es" ? "Añadir color" : "Add color",
      colorName: locale === "pt" ? "Nome" : locale === "es" ? "Nombre" : "Name",
      colorHex: "HEX",
      invalidHex:
        locale === "pt"
          ? "HEX inválido. Use formato #RRGGBB (ex: #212121)."
          : locale === "es"
            ? "HEX inválido. Usa formato #RRGGBB (ej: #212121)."
            : "Invalid HEX. Use #RRGGBB (e.g., #212121).",
      failedToLoad:
        locale === "pt"
          ? "Não foi possível carregar o produto."
          : locale === "es"
            ? "No se pudo cargar el producto."
            : "Failed to load product.",
      networkError:
        locale === "pt"
          ? "Erro de rede."
          : locale === "es"
            ? "Error de red."
            : "Network error.",
      unauthorized:
        locale === "pt"
          ? "Sem permissão. Faça login novamente."
          : locale === "es"
            ? "Sin permisos. Inicia sesión de nuevo."
            : "Unauthorized. Please login again.",
      saved:
        locale === "pt"
          ? "Salvo com sucesso."
          : locale === "es"
            ? "Guardado con éxito."
            : "Saved successfully.",
    }
  }, [locale])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // form state (profissional e compatível)
  const [namePt, setNamePt] = useState("")
  const [nameEs, setNameEs] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [imageUrl, setImageUrl] = useState("")
  const [colors, setColors] = useState<Array<{ name: string; hex: string }>>([])

  useEffect(() => {
    if (isLoading) return
    if (!isAdmin) router.replace(`/login?next=/admin/products/${id}/edit`)
  }, [isAdmin, isLoading, router, id])

  const loadProduct = async () => {
    if (typeof window === "undefined") return
    setError(null)
    setNotice(null)
    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`/api/products/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      })

      if (res.status === 401 || res.status === 403) {
        setError(ui.unauthorized)
        setLoading(false)
        router.replace(`/login?next=/admin/products/${id}/edit`)
        return
      }

      if (!res.ok) {
        setError(`${ui.failedToLoad} (HTTP ${res.status})`)
        setLoading(false)
        return
      }

      const data: Product = await res.json()

      // nome (aceita vários formatos)
      const nameObj = typeof data.name === "object" && data.name ? (data.name as ProductName) : null
      const nameStr = typeof data.name === "string" ? data.name : ""

      setNamePt(nameObj?.pt ?? data.name_pt ?? (locale === "pt" ? nameStr : ""))
      setNameEs(nameObj?.es ?? data.name_es ?? (locale === "es" ? nameStr : ""))
      setNameEn(nameObj?.en ?? data.name_en ?? (locale === "en" ? nameStr : ""))

      const p = data.base_price ?? data.basePrice ?? data.price ?? 0
      setPrice(Number(p || 0))

      setImageUrl((data.image_url ?? data.image ?? "") as string)

      const list = Array.isArray(data.colors) ? data.colors : []
      setColors(
        list
          .map((c) => ({
            name: String(c?.name ?? ""),
            hex: String(c?.hex ?? "").toUpperCase(),
          }))
          .filter((c) => c.name || c.hex)
      )
    } catch {
      setError(ui.networkError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) return
    if (!id) return
    loadProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, id])

  const addColor = () => setColors((prev) => [...prev, { name: "", hex: "" }])

  const updateColor = (idx: number, key: "name" | "hex", value: string) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === idx
          ? {
              ...c,
              [key]: key === "hex" ? value.toUpperCase() : value,
            }
          : c
      )
    )
  }

  const removeColor = (idx: number) => setColors((prev) => prev.filter((_, i) => i !== idx))

  const handleSave = async () => {
    setError(null)
    setNotice(null)

    // valida hexes
    const bad = colors.find((c) => c.hex && !isValidHex(c.hex))
    if (bad) {
      setError(ui.invalidHex)
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem("auth_token")

      // Payload compatível (envia várias chaves pra não quebrar o backend atual)
      const payload = {
        id,
        name: { pt: namePt, es: nameEs, en: nameEn },
        name_pt: namePt,
        name_es: nameEs,
        name_en: nameEn,
        base_price: price,
        basePrice: price,
        price,
        image_url: imageUrl,
        image: imageUrl,
        colors: colors
          .filter((c) => c.name || c.hex)
          .map((c) => ({ name: c.name.trim(), hex: c.hex.trim() })),
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (res.status === 401 || res.status === 403) {
        setError(ui.unauthorized)
        setSaving(false)
        router.replace(`/login?next=/admin/products/${id}/edit`)
        return
      }

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || `HTTP ${res.status}`)
        setSaving(false)
        return
      }

      setNotice(ui.saved)
      setSaving(false)
    } catch (e: any) {
      setError(e?.message || ui.networkError)
      setSaving(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* header */}
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold">{ui.title}</h1>
              <p className="text-muted-foreground mt-1">ID: {id}</p>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/admin/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {ui.back}
                </Link>
              </Button>

              <Button variant="outline" className="bg-transparent" onClick={loadProduct}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {ui.reload}
              </Button>

              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? ui.saving : ui.save}
              </Button>
            </div>
          </div>

          {error ? (
            <Card className="mb-6 border-destructive/40 bg-destructive/10">
              <CardHeader>
                <CardTitle className="text-lg">Error</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {notice ? (
            <Card className="mb-6 border-emerald-500/30 bg-emerald-500/10">
              <CardHeader>
                <CardTitle className="text-lg">{notice}</CardTitle>
              </CardHeader>
            </Card>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{ui.sectionBasics}</CardTitle>
                  <CardDescription>
                    {locale === "pt"
                      ? "Nomes por idioma para o site ficar correto."
                      : locale === "es"
                        ? "Nombres por idioma para que el sitio se vea correcto."
                        : "Names per language for correct storefront."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="namePt">{ui.namePt}</Label>
                      <Input id="namePt" value={namePt} onChange={(e) => setNamePt(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameEs">{ui.nameEs}</Label>
                      <Input id="nameEs" value={nameEs} onChange={(e) => setNameEs(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameEn">{ui.nameEn}</Label>
                      <Input id="nameEn" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {ui.sectionColors}
                  </CardTitle>
                  <CardDescription>{ui.colorsHelper}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {colors.length ? (
                    colors.map((c, idx) => (
                      <div key={idx} className="grid gap-3 md:grid-cols-[1fr_180px_120px] items-end">
                        <div className="space-y-2">
                          <Label>{ui.colorName}</Label>
                          <Input
                            value={c.name}
                            onChange={(e) => updateColor(idx, "name", e.target.value)}
                            placeholder={locale === "pt" ? "Ex: Preto" : locale === "es" ? "Ej: Negro" : "e.g., Black"}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>{ui.colorHex}</Label>
                          <Input
                            value={c.hex}
                            onChange={(e) => updateColor(idx, "hex", e.target.value)}
                            placeholder="#212121"
                          />
                          {c.hex && !isValidHex(c.hex) ? (
                            <p className="text-xs text-destructive">{ui.invalidHex}</p>
                          ) : null}
                        </div>

                        <div className="flex gap-2">
                          <div
                            className="h-10 w-10 rounded-md border border-border/60"
                            style={{ background: isValidHex(c.hex) ? c.hex : "transparent" }}
                            title={c.hex}
                          />
                          <Button variant="destructive" onClick={() => removeColor(idx)}>
                            {locale === "pt" ? "Remover" : locale === "es" ? "Quitar" : "Remove"}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {locale === "pt"
                        ? "Nenhuma cor cadastrada."
                        : locale === "es"
                          ? "No hay colores."
                          : "No colors yet."}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button variant="outline" className="bg-transparent" onClick={addColor}>
                      + {ui.addColor}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna lateral */}
            <div className="space-y-6">
              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    {ui.sectionMainImage}
                  </CardTitle>
                  <CardDescription>
                    {locale === "pt"
                      ? "Cole a URL da imagem principal."
                      : locale === "es"
                        ? "Pega la URL de la imagen principal."
                        : "Paste the main image URL."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">{ui.imageUrl}</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="rounded-lg overflow-hidden border border-border/60 bg-muted">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="Main" className="w-full h-auto object-cover" loading="lazy" />
                    ) : (
                      <div className="p-6 text-sm text-muted-foreground">
                        {locale === "pt"
                          ? "Sem imagem. Cole uma URL acima."
                          : locale === "es"
                            ? "Sin imagen. Pega una URL arriba."
                            : "No image. Paste an URL above."}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{ui.sectionPricing}</CardTitle>
                  <CardDescription>
                    {locale === "pt"
                      ? "Preço base em EUR."
                      : locale === "es"
                        ? "Precio base en EUR."
                        : "Base price in EUR."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="price">{ui.price}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={Number.isFinite(price) ? price : 0}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {locale === "pt"
                      ? `Preview: ${formatCurrency(price || 0, locale)}`
                      : locale === "es"
                        ? `Vista previa: ${formatCurrency(price || 0, locale)}`
                        : `Preview: ${formatCurrency(price || 0, locale)}`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ações finais */}
          <div className="mt-8 flex justify-end gap-2">
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/admin/products">{ui.back}</Link>
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? ui.saving : ui.save}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
