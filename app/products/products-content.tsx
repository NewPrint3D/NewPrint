"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductFilterControls, type FilterState } from "@/components/product-filter-controls"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/lib/db-products"

export function ProductsContent() {
 const { t, locale } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filterState, setFilterState] = useState<FilterState>({
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
    const params = new URLSearchParams()
    if (filterState.category !== "all") params.set("category", filterState.category)
    if (filterState.priceRange[0] !== 0) params.set("minPrice", String(filterState.priceRange[0]))
    if (filterState.priceRange[1] !== 100) params.set("maxPrice", String(filterState.priceRange[1]))
    if (filterState.colors.length > 0) params.set("colors", filterState.colors.join(","))
    if (filterState.materials.length > 0) params.set("materials", filterState.materials.join(","))

    const newURL = params.toString() ? `?${params.toString()}` : "/products"
    router.replace(newURL, { scroll: false })
  }, [filterState, router])

  const filteredProducts = products.filter((product) => {
    if (filterState.category !== "all" && product.category !== filterState.category) {
      return false
    }
    if (product.basePrice < filterState.priceRange[0] || product.basePrice > filterState.priceRange[1]) {
      return false
    }
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <ProductFilterControls initialFilterState={filterState} onFilterChange={setFilterState} />
      </div>

      <div className="lg:col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredProducts.length === 1
              ? t.productsPage.showingCountSingular
              : t.productsPage.showingCountPlural.replace("{count}", String(filteredProducts.length))}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t.common.noResults}</p>
          </div>
        )}
      </div>
    </div>
  )
}
