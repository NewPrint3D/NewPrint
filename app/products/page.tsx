"use client"

import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { ProductsContent } from "./products-content"

export default function ProductsPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{t.products.title}</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">{t.aria.loading}...</p>
              </div>
            }
          >
            <ProductsContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  )
}
