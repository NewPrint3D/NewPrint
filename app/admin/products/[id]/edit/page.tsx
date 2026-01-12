"use client"

export const dynamic = "force-dynamic"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

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

interface PageProps {
  params: Promise<{ id: string }>
}

type VariantForm = {
  name: string
  sku: string
  price: string
  stock: string
}

type ColorImageForm = {
  color: string
  url: string
}

type FormDataState = {
  name_en: string
  name_pt: string
  name_es: string

  description_en: string
  description_pt: string
  description_es: string

  category: string
  base_price: string
  image_url: string

  colors: string
  sizes: string
  materials: string

  featured: boolean
  stock_quantity: string
  active: boolean

  variants: VariantForm[]
  color_images: ColorImageForm[]
}

export default function EditProductPage({ params }: PageProps) {
  const { isAdmin } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [productId, setProductId] = useState<string>("")

  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const [formData, setFormData] = useState<FormDataState>({
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

    variants: [],
    color_images: [],
  })

  // Resolve params.id
  useEffect(() => {
    let mounted = true
    async function loadParams() {
      try {
        const resolvedParams = await params
        if (!mounted) return
        setProductId(resolvedParams.id)
      } catch {
        // ignore
      }
    }
    loadParams()
    return () => {
      mounted = false
    }
  }, [params])

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      if (!productId || !isAdmin) return

      try {
        setIsFetching(true)
        setError("")

        if (typeof window === "undefined") return
        const token = localStorage.getItem("auth_token")

        const res = await fetch(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          setError(t.admin.failedToLoad)
          return
        }

        const data = await res.json()
        const product = data?.product

        setFormData({
          name_en: product?.name_en ?? product?.name?.en ?? "",
          name_pt: product?.name_pt ?? product?.name?.pt ?? "",
          name_es: product?.name_es ?? product?.name?.es ?? "",

          description_en: product?.description_en ?? product?.description?.en ?? "",
          description_pt: product?.description_pt ?? product?.description?.pt ?? "",
          description_es: product?.description_es ?? product?.description?.es ?? "",

          category: product?.category ?? "accessories",
          base_price: String(product?.base_price ?? product?.basePrice ?? 0),
          image_url: product?.image_url ?? product?.image ?? "",

          colors: Array.isArray(product?.colors)
            ? product.colors.join(",")
            : (product?.colors ?? ""),
          sizes: Array.isArray(product?.sizes)
            ? product.sizes.join(",")
            : (product?.sizes ?? ""),
          materials: Array.isArray(product?.materials)
            ? product.materials.join(",")
            : (product?.materials ?? ""),

          featured: Boolean(product?.featured),
          stock_quantity: String(product?.stock_quantity ?? product?.stock ?? 0),
          active: product?.active !== false,

          variants: Array.isArray(product?.variants) ? product.variants : [],
          color_images: Array.isArray(product?.color_images) ? product.color_images : [],
        })
      } catch {
        setError(t.admin.networkError)
      } finally {
        setIsFetching(false)
      }
    }

    fetchProduct()
  }, [productId, isAdmin, t.admin.failedToLoad, t.admin.networkError])

  const addVariant = () => {
    setFormData((fd) => ({
      ...fd,
      variants: [
        ...(fd.variants || []),
        {
         name: "Unit",
          sku: "",
          price: fd.base_price || "0",
          stock: "0",
        },
      ],
    }))
  }

  const updateVariant = (index: number, key: keyof VariantForm, value: string) => {
    setFormData((fd) => {
      const variants = [...(fd.variants || [])]
      variants[index] = { ...variants[index], [key]: value }
      return { ...fd, variants }
    })
  }

  const removeVariant = (index: number) => {
    setFormData((fd) => {
      const variants = [...(fd.variants || [])]
      variants.splice(index, 1)
      return { ...fd, variants }
    })
  }

  const addColorImage = () => {
    const firstColor = (formData.colors.split(",")[0] || "#FFFFFF").trim()
    setFormData((fd) => ({
      ...fd,
      color_images: [...(fd.color_images || []), { color: firstColor, url: "" }],
    }))
  }

  const updateColorImage = (index: number, key: keyof ColorImageForm, value: string) => {
    setFormData((fd) => {
      const color_images = [...(fd.color_images || [])]
      color_images[index] = { ...color_images[index], [key]: value }
      return { ...fd, color_images }
    })
  }

  const removeColorImage = (index: number) => {
    setFormData((fd) => {
      const color_images = [...(fd.color_images || [])]
      color_images.splice(index, 1)
      return { ...fd, color_images }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (typeof window === "undefined") {
        setError(t.admin.demoAuthWarning)
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
          base_price: Number.parseFloat(formData.base_price || "0"),
          stock_quantity: Number.parseInt(formData.stock_quantity || "0", 10),

          colors: formData.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          sizes: formData.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          materials: formData.materials
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),

          variants: (formData.variants || []).map((v) => ({
            ...v,
            price: Number.parseFloat(v.price || "0"),
            stock: Number.parseInt(v.stock || "0", 10),
          })),

          color_images: formData.color_images || [],
        }),
      })

      if (res.ok) {
        router.push("/admin/products")
      } else {
      const data = await res.json().catch(() => ({}));
setError(data?.error || t.admin.failedToUpdate);
}
} catch (error) {
  setError(t.admin.networkError);
} finally {
  setIsLoading(false);
  }
  }

 if (!isAdmin) return null;

if (isFetching) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}

return (
  <div className="min-h-screen flex-col">
    <Navbar />
    <main className="flex-1 pt-24 pb-16">

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

                {/* Names */}
                <div className="space-y-4">
                <h3 className="font-semibold">Required in all languages</h3>

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
                      <Label htmlFor="name_pt">Portuguese</Label>
                      <Input
                        id="name_pt"
                        value={formData.name_pt}
                        onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name_es">Spanish</Label>
                      <Input
                        id="name_es"
                        value={formData.name_es}
                        onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Descriptions (All Languages)</h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="description_en">English</Label>
                      <Textarea
                        id="description_en"
                        rows={4}
                        value={formData.description_en}
                        onChange={(e) =>
                          setFormData({ ...formData, description_en: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description_pt">Portuguese</Label>
                      <Textarea
                        id="description_pt"
                        rows={4}
                        value={formData.description_pt}
                        onChange={(e) =>
                          setFormData({ ...formData, description_pt: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description_es">Spanish</Label>
                      <Textarea
                        id="description_es"
                        rows={4}
                        value={formData.description_es}
                        onChange={(e) =>
                          setFormData({ ...formData, description_es: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Category + Base Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">{t.admin.category}</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="base_price">{t.admin.basePrice}</Label>
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

                {/* Product Image */}
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                  />
                </div>

                {/* Colors / Sizes / Materials */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="colors">Colors (comma-separated)</Label>
                    <Input
                      id="colors"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="#F4F4F4,#1B1B1B,#1565C0"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                      <Input
                        id="sizes"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        placeholder="Small,Medium,Large"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="materials">Materials (comma-separated)</Label>
                      <Input
                        id="materials"
                        value={formData.materials}
                        onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                        placeholder="PLA,ABS,PETG"
                      />
                    </div>
                  </div>
                </div>

                {/* Variants / SKUs */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold">Variants</h3>
                    {formData.variants.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                     Add variants/SKUs for this product (optional).
                     </p>
                    )}
                  </div>

                  {formData.variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 rounded-lg border border-border"
                    >
                      <div className="space-y-2 md:col-span-2">
                       <Label>Variant Name</Label>
                        <Input
                          value={v.name}
                          onChange={(e) => updateVariant(idx, "name", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Sku</Label>
                        <Input
                          value={v.sku}
                          onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                          placeholder="SKU"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={v.price}
                          onChange={(e) => updateVariant(idx, "price", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={v.stock}
                          onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                        />
                      </div>

                      <div className="flex items-end md:col-span-5">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => removeVariant(idx)}
                        >
                          {t.admin.remove}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button type="button" className="w-full" onClick={addVariant}>
                    + Add Variant
                  </Button>
                </div>

                {/* Images by Color */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Images by Color</h3>

                  {formData.color_images.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                   Add image URLs for each color (hex). The product page will swap image when color is selected.
                   </p>
 
                  )}

                  {formData.color_images.map((img, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg border border-border"
                    >
                      <div className="space-y-2">
                        <Label>color Hex</Label>
                        <Input
                          value={img.color}
                          onChange={(e) => updateColorImage(idx, "color", e.target.value)}
                          placeholder="#FFFFFF"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>image Url</Label>
                        <div className="flex gap-2">
                          <Input
                            value={img.url}
                            onChange={(e) => updateColorImage(idx, "url", e.target.value)}
                            placeholder="https://..."
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeColorImage(idx)}
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick=addColor Image
                    className="w-full"
                    variant="outline"
                  >
                    + add Color Image
                  </Button>
                </div>

                {/* Footer of form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, stock_quantity: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="flex flex-col justify-end space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="featured">featured Product</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="active">active Visible</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.admin.updating}
                      </>
                    ) : (
                      t.admin.updateProduct
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/products")}
                  >
                    {t.admin.cancel}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
