import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProductCategories } from "@/components/product-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { CustomProjectsSection } from "@/components/custom-projects-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <CustomProjectsSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
