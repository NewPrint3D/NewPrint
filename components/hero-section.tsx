"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HeroSection() {
  const { t } = useLanguage()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [
    "/modern-3d-printed-phone-stand.jpg",
    "/geometric-3d-printed-vase.jpg",
    "/modern-3d-printed-desk-lamp.jpg",
    "/geometric-3d-printed-plant-pot.jpg",
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-[gradient_15s_ease_infinite] bg-[length:400%_400%]" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow animate-morph" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slow animate-morph"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-3/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />

        {[...Array(8)].map((_, i) => {
          const randomX = Math.random() * 100
          const randomY = Math.random() * 100
          const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1920
          const windowHeight = typeof window !== "undefined" ? window.innerHeight : 1080
          return (
            <div
              key={i}
              className="absolute animate-float-slow opacity-20"
              style={{
                left: `${randomX}%`,
                top: `${randomY}%`,
                transform: `translate(${(mousePosition.x / windowWidth - 0.5) * 0.1}px, ${(mousePosition.y / windowHeight - 0.5) * 0.1}px)`,
                transition: "transform 40s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {/* Placeholder for dynamic icons */}
            </div>
          )
        })}

        {[...Array(12)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-wave"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--primary), 0.2), transparent 50%)`,
          transition: "background 30s ease",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:scale-105 transition-transform cursor-default relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <ShoppingBag className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary relative z-10">{t.hero.readyForDelivery}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <span className="text-balance inline-block hover:scale-105 transition-transform duration-300">
              {t.hero.printing3d}
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] inline-block hover:scale-110 transition-transform duration-300">
              {t.hero.highQuality}
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {t.hero.exclusiveProducts}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <Link href="/products">
                <span className="relative z-10 flex items-center gap-2">
                  {t.hero.viewProducts}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[gradient_2s_linear_infinite]" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group bg-transparent hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <Link href="#custom">
                <span className="relative z-10 flex items-center gap-2">
                  {t.hero.customProjects}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Button>
          </div>

          <div className="mt-20 relative animate-in fade-in zoom-in-50 duration-1000 delay-500 group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-chart-3/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-all duration-700 animate-pulse-glow" />
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl transform group-hover:scale-[1.05] transition-all duration-700 preserve-3d">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden relative">
                {heroImages.map((image, index) => (
                  <img
                    key={image}
                    src={image || "/placeholder.svg"}
                    alt={`3D Printed Product ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-all duration-1000 ${
                      index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer group">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse group-hover:h-4 transition-all duration-300" />
        </div>
      </div>
    </section>
  )
}
