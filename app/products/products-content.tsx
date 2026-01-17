"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/lib/db-products"

export function ProductsContent() {
  const { t, locale } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filterState] = useState({
    category: searchParams.get("category") || "all",
    priceRange: [
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 100,
    ] as [number, number],
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
    materials: searchParams.get("materials")?.split(",").filter(Boolean) || [],
  })

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products-public?locale=${locale}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [locale])

  useEffect(() => {
    router.replace("/products", { scroll: false })
  }, [router])

  const filteredProducts = products.filter((product) => {
    if (filterState.category !== "all" && product.category !== filterState.category) return false
    if (product.basePrice < filterState.priceRange[0] || product.basePrice > filterState.priceRange[1]) return false

    if (filterState.colors.length > 0) {
      const hasMatchingColor = product.colors.some((color) => filterState.colors.includes(color))
      if (!hasMatchingColor) return false
    }

    if (filterState.materials.length > 0) {
      const hasMatchingMaterial = product.materials.some((material) => filterState.materials.includes(material))
      if (!hasMatchingMaterial) return false
    }

    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredProducts.length === 1
            ? t.productsPage.showingCountSingular
            : t.productsPage.showingCountPlural.replace("{count}", String(filteredProducts.length))}
        </p>
      </div>

      <div
        className={[
          "grid gap-6",
          "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
          filteredProducts.length === 1 ? "justify-items-center" : "",
        ].join(" ")}
      >
        {filteredProducts.map((product) => (
          <div key={product.id} className={filteredProducts.length === 1 ? "w-full max-w-sm" : ""}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t.common.noResults}</p>
        </div>
      )}
    </div>
  )
}
