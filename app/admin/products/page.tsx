"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react"
import { formatCurrency } from "@/lib/intl"

interface AdminProduct {
  id: string | number
  name?: {
    en?: string
    pt?: string
    es?: string
  }
  name_en?: string
  name_pt?: string
  name_es?: string
  base_price?: number
  basePrice?: number
  image_url?: string
  image?: string
  featured?: boolean
}

export default function AdminProductsPage() {
  const { isAdmin, isLoading } = useAuth()
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/")
      setLoading(false)
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const fetchProducts = async () => {
      if (typeof window === "undefined") return
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products ?? [])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchProducts()
    }
  }, [isAdmin])

  const handleDelete = async (id: string | number) => {
    if (!confirm(t.admin.deleteConfirm)) return
    try {
      if (typeof window === "undefined") return
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setProducts((prev) => prev.filter((product) => String(product.id) !== String(id)))
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const getProductName = (product: AdminProduct) => {
    if (product.name) {
      if (locale === "pt") return product.name.pt ?? product.name.en ?? product.name.es ?? ""
      if (locale === "es") return product.name.es ?? product.name.en ?? product.name.pt ?? ""
      return product.name.en ?? product.name.pt ?? product.name.es ?? ""
    }
    if (locale === "pt") return product.name_pt ?? product.name_en ?? ""
    if (locale === "es") return product.name_es ?? product.name_en ?? ""
    return product.name_en ?? product.name_pt ?? product.name_es ?? ""
  }

  const getPrice = (product: AdminProduct) => product.base_price ?? product.basePrice ?? 0

  const getImage = (product: AdminProduct) => product.image_url ?? product.image ?? "/placeholder.svg"

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t.admin.products}</h1>
              <p className="text-muted-foreground">{t.admin.manageCatalog}</p>
            </div>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                {t.admin.addProduct}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={getImage(product)}
                      alt={getProductName(product) || t.admin.noImage}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardTitle className="line-clamp-2">{getProductName(product) || t.admin.unnamedProduct}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-primary">{formatCurrency(getPrice(product), locale)}</span>
                    {product.featured && (
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                        {t.common.featured}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/products/${product.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        {t.cta.view}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t.cta.edit}
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.admin.noProducts}</h3>
                <p className="text-muted-foreground mb-4">{t.admin.noProductsHelper}</p>
                <Button asChild>
                  <Link href="/admin/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    {t.admin.addProduct}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
