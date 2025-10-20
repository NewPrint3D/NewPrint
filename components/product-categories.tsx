"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Home, Gamepad2, Brain, Leaf } from "lucide-react"
import Link from "next/link"

export function ProductCategories() {
  const categories = [
    {
      icon: Home,
      title: "Decoração para o Lar",
      description: "Vasos, luminárias, porta-objetos e muito mais",
      color: "from-primary to-primary/50",
      gradient: "from-primary/20 via-primary/10 to-transparent",
      href: "/products?category=home",
    },
    {
      icon: Gamepad2,
      title: "Brinquedos",
      description: "Diversão criativa e educativa para todas as idades",
      color: "from-accent to-accent/50",
      gradient: "from-accent/20 via-accent/10 to-transparent",
      href: "/products?category=toys",
    },
    {
      icon: Brain,
      title: "Objetos Sensoriais",
      description: "Estímulo tátil e desenvolvimento cognitivo",
      color: "from-chart-3 to-chart-3/50",
      gradient: "from-chart-3/20 via-chart-3/10 to-transparent",
      href: "/products?category=sensory",
    },
    {
      icon: Leaf,
      title: "Materiais Biodegradáveis",
      description: "Sustentabilidade em cada impressão",
      color: "from-chart-5 to-chart-5/50",
      gradient: "from-chart-5/20 via-chart-5/10 to-transparent",
      href: "/about#sustainability",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Nossas Categorias</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Produtos sustentáveis feitos com materiais biodegradáveis
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary via-accent to-chart-3 mx-auto rounded-full animate-[gradient_3s_linear_infinite] bg-[length:200%_auto] mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.href}>
              <Card
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden cursor-pointer h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
                </div>

                <CardContent className="p-6 relative z-10">
                  <div className="mb-4 relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} blur-2xl opacity-20 group-hover:opacity-60 transition-all duration-500 animate-pulse-glow`}
                    />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center border-2 border-border group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                      <category.icon className="w-8 h-8 text-primary group-hover:scale-125 transition-all duration-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {category.description}
                  </p>
                </CardContent>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
