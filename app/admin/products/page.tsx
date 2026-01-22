"use client"

export const dynamic = "force-dynamic"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Plus, Edit, Trash2, Eye, Package, RefreshCw } from "lucide-react"
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
  const router = useRouter()
  const { isAdmin, isLoading } = useAuth()
  const { locale } = useLanguage()

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ui = useMemo(() => {
    return {
      title: locale === "pt" ? "Produtos" : locale === "es" ? "Productos" : "Products",
      subtitle:
        locale === "pt"
          ? "Gerencie seu catálogo"
          : locale === "es"
            ? "Gestiona tu catálogo"
            : "Manage your catalog",
      addProduct: locale === "pt" ? "Adicionar produto" : locale === "es" ? "Añadir producto" : "Add product",
      unnamed: locale === "pt" ? "Produto sem nome" : locale === "es" ? "Producto sin nombre" : "Unnamed product",
      noImage: locale === "pt" ? "Sem imagem" : locale === "es" ? "Sin imagen" : "No image",
      featured: locale === "pt" ? "Destaque" : locale === "es" ? "Destacado" : "Featured",
      view: locale === "pt" ? "Ver" : locale === "es" ? "Ver" : "View",
      edit: locale === "pt" ? "Editar" : locale === "es" ? "Editar" : "Edit",
      noProducts: locale === "pt" ? "Nenhum produto" : locale === "es" ? "Sin productos" : "No products",
      noProductsHelper:
        locale === "pt"
          ? "Crie seu primeiro produto para começar."
          : locale === "es"
            ? "Crea tu primer producto para empezar."
            : "Create your first product to get started.",
      loadErrorTitle: locale === "pt" ? "Não foi possível carregar" : locale === "es" ? "No se pudo cargar" : "Couldn’t load",
      loadErrorHelper:
        locale === "pt"
          ? "O Admin não conseguiu buscar os produtos. Vamos corrigir a API/permite."
          : locale === "es"
            ? "El Admin no pudo obtener los productos. Vamos a corregir la API/permisos."
            : "Admin couldn’t fetch products. We’ll fix API/permissions.",
      retry: locale === "pt" ? "Tentar de novo" : locale === "es" ? "Reintentar" : "Retry",
      confirmDelete:
        locale === "pt"
          ? "Tem certeza que deseja excluir este produto?"
          : locale === "es"
            ? "¿Seguro que deseas eliminar este producto?"
            : "Are you sure you want to delete this product?",
      unauthorized:
        locale === "pt"
          ? "Sem permissão. Faça login novamente."
          : locale === "es"
            ? "Sin permisos. Inicia sesión de nuevo."
            : "Unauthorized. Please login again.",
    }
  }, [locale])

  // ✅ se não for admin, manda pro login (não pra home)
  useEffect(() => {
    if (isLoading) return
    if (!isAdmin) {
      router.replace("/login?next=/admin/products")
      return
    }
  }, [isAdmin, isLoading, router])

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

  const fetchProducts = async () => {
    if (typeof window === "undefined") return
    setError(null)
    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")

      const res = await fetch("/api/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      })

      // 🔒 se a API exigir auth e falhar, força login de novo
      if (res.status === 401 || res.status === 403) {
        setError(ui.unauthorized)
        setLoading(false)
        router.replace("/login?next=/admin/products")
        return
      }

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || `HTTP ${res.status}`)
        setProducts([])
        setLoading(false)
        return
      }

      // aceita formatos diferentes:
      const list = (data?.products ?? data ?? []) as AdminProduct[]
      setProducts(Array.isArray(list) ? list : [])
    } catch (e: any) {
      setError(e?.message || "network_error")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
      return
    }
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  const handleDelete = async (id: string | number) => {
    if (!confirm(ui.confirmDelete)) return

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (res.status === 401 || res.status === 403) {
        setError(ui.unauthorized)
        router.replace("/login?next=/admin/products")
        return
      }

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)))
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error || `HTTP ${res.status}`)
      }
    } catch (e: any) {
      setError(e?.message || "network_error")
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-4xl font-bold mb-2">{ui.title}</h1>
              <p className="text-muted-foreground">{ui.subtitle}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent" onClick={fetchProducts}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {ui.retry}
              </Button>

              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {ui.addProduct}
                </Link>
              </Button>
            </div>
          </div>

          {error ? (
            <Card className="mb-6 border-destructive/40 bg-destructive/10">
              <CardHeader>
                <CardTitle className="text-lg">{ui.loadErrorTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{ui.loadErrorHelper}</p>
                <div className="rounded-md border border-destructive/30 bg-background/40 px-3 py-2 text-sm">
                  {String(error)}
                </div>
                <div className="flex gap-2">
                  <Button onClick={fetchProducts}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {ui.retry}
                  </Button>
                  <Button asChild variant="outline" className="bg-transparent">
                    <Link href="/admin">{locale === "pt" ? "Voltar" : locale === "es" ? "Volver" : "Back"}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

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
                      alt={getProductName(product) || ui.noImage}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  <CardTitle className="line-clamp-2">{getProductName(product) || ui.unnamed}</CardTitle>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-primary">{formatCurrency(getPrice(product), locale)}</span>

                    {product.featured ? (
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">{ui.featured}</span>
                    ) : null}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/products/${product.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        {ui.view}
                      </Link>
                    </Button>

                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        {ui.edit}
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

          {products.length === 0 && !error ? (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{ui.noProducts}</h3>
                <p className="text-muted-foreground mb-4">{ui.noProductsHelper}</p>

                <Button asChild>
                  <Link href="/admin/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    {ui.addProduct}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}
