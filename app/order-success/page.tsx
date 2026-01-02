import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OrderSuccessContent } from "@/components/order-success-content"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-accent" />
      <p className="text-lg text-muted-foreground">Loading...</p>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingFallback />}>
            <OrderSuccessContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  )
}
