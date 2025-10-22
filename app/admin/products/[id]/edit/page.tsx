"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: PageProps) {
  const { isAdmin } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [productId, setProductId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name_en: "",
    name_pt: "",
    name_es: "",
    description_en: "",
    description_pt: "",
    description_es: "",
    category: "accessories",
    base_price: "",
    image_url: "",
    colors: "",
    sizes: "",
    materials: "",
    featured: false,
    stock_quantity: "0",
    active: true,
  })

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    async function fetchProduct() {
      if (!productId || !isAdmin) return

      try {
        if (typeof window === "undefined") return
        const token = localStorage.getItem("auth_token")
        const res = await fetch(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          const product = data.product

          setFormData({
            name_en: product.name_en || product.name?.en || "",
            name_pt: product.name_pt || product.name?.pt || "",
            name_es: product.name_es || product.name?.es || "",
            description_en: product.description_en || product.description?.en || "",
            description_pt: product.description_pt || product.description?.pt || "",
            description_es: product.description_es || product.description?.es || "",
            category: product.category || "accessories",
            base_price: String(product.base_price || product.basePrice || 0),
            image_url: product.image_url || product.image || "",
            colors: Array.isArray(product.colors)
              ? product.colors.join(",")
              : product.colors || "#8B5CF6,#06B6D4,#10B981",
            sizes: Array.isArray(product.sizes)
              ? product.sizes.join(",")
              : product.sizes || "Small,Medium,Large",
            materials: Array.isArray(product.materials)
              ? product.materials.join(",")
              : product.materials || "PLA,ABS,PETG",
            featured: product.featured || false,
            stock_quantity: String(product.stock_quantity || product.stock || 0),
            active: product.active !== false,
          })
        } else {
          setError("Failed to load product")
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setIsFetching(false)
      }
    }

    fetchProduct()
  }, [productId, isAdmin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (typeof window === "undefined") {
        setError(t.admin.demoAuthWarning)
        setIsLoading(false)
        return
      }
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          base_price: Number.parseFloat(formData.base_price),
          stock_quantity: Number.parseInt(formData.stock_quantity),
          colors: formData.colors.split(",").map((c) => c.trim()),
          sizes: formData.sizes.split(",").map((s) => s.trim()),
          materials: formData.materials.split(",").map((m) => m.trim()),
        }),
      })

      if (res.ok) {
        router.push("/admin/products")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to update product")
      }
    } catch (error) {
      setError("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) return null

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.admin.backToProducts}
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-2">{t.admin.editProduct}</h1>
            <p className="text-muted-foreground">{t.admin.editProductHelper}</p>
          </div>

          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardHeader>
              <CardTitle>{t.admin.productInformation}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold">Names (Required in all languages)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name_en">English</Label>
                      <Input
                        id="name_en"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_pt">Português</Label>
                      <Input
                        id="name_pt"
                        value={formData.name_pt}
                        onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_es">Español</Label>
                      <Input
                        id="name_es"
                        value={formData.name_es}
                        onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Descriptions (Required in all languages)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description_en">English</Label>
                      <Textarea
                        id="description_en"
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description_pt">Português</Label>
                      <Textarea
                        id="description_pt"
                        value={formData.description_pt}
                        onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description_es">Español</Label>
                      <Textarea
                        id="description_es"
                        value={formData.description_es}
                        onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      required
                    >
                      <option value="accessories">Accessories</option>
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                      <option value="toys">Toys</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="base_price">Base Price ($)</Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <ImageUpload
                  label="Product Image"
                  value={formData.image_url}
                  onChange={(imageData) => setFormData({ ...formData, image_url: imageData })}
                  disabled={isLoading}
                />

                <div className="space-y-2">
                  <Label htmlFor="colors">Colors (comma separated hex codes)</Label>
                  <Input
                    id="colors"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="#8B5CF6,#06B6D4,#10B981"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sizes">Sizes (comma separated)</Label>
                    <Input
                      id="sizes"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="Small,Medium,Large"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="materials">Materials (comma separated)</Label>
                    <Input
                      id="materials"
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      placeholder="PLA,ABS,PETG"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col justify-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="active">Active (Visible to customers)</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Product"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
