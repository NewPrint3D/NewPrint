"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

type Product = {
  id: string
  name: string
  price: number
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useLanguage()

  const admin = (t as any)?.admin || {
    failedToLoad: "Failed to load product.",
    networkError: "Network error.",
    saving: "Saving...",
    save: "Save",
    editProduct: "Edit Product",
  }

  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (!res.ok) {
          setError(admin.failedToLoad)
          return
        }

        const data = await res.json()
        setProduct(data)
      } catch {
        setError(admin.networkError)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (loading) return null

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-28 pb-20 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{admin.editProduct}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {product && (
          <div className="max-w-md space-y-4">
            <input
              className="w-full border rounded p-2"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border rounded p-2"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
            />

            <button className="px-6 py-2 bg-black text-white rounded">
              {admin.save}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
