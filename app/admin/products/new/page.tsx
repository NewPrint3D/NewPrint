"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

type ProductForm = {
  name: string
  price: number
}

export default function NewProductPage() {
  const router = useRouter()
  const { t } = useLanguage()

  const admin = (t as any)?.admin || {
    demoAuthWarning: "Admin access only.",
    saving: "Saving...",
    save: "Save product",
    newProduct: "New product",
  }

  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: 0,
  })

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
  }, [])

  async function handleSubmit() {
    try {
      setLoading(true)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        setError("Failed to create product")
        return
      }

      router.push("/admin/products")
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-28 pb-20 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{admin.newProduct}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="max-w-md space-y-4">
          <input
            className="w-full border rounded p-2"
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            className="w-full border rounded p-2"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded"
          >
            {loading ? admin.saving : admin.save}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  )
}
