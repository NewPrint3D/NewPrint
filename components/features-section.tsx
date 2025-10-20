"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Palette, Zap, Headphones } from "lucide-react"
import { useState } from "react"

export function FeaturesSection() {
  const { t } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const features = [
    {
      icon: Award,
      title: t.features.quality.title,
      description: t.features.quality.description,
      color: "from-primary to-primary/50",
      gradient: "from-primary/20 via-primary/10 to-transparent",
    },
    {
      icon: Palette,
      title: t.features.customization.title,
      description: t.features.customization.description,
      color: "from-accent to-accent/50",
      gradient: "from-accent/20 via-accent/10 to-transparent",
    },
    {
      icon: Zap,
      title: t.features.fast.title,
      description: t.features.fast.description,
      color: "from-chart-3 to-chart-3/50",
      gradient: "from-chart-3/20 via-chart-3/10 to-transparent",
    },
    {
      icon: Headphones,
      title: t.features.support.title,
      description: t.features.support.description,
      color: "from-chart-4 to-chart-4/50",
      gradient: "from-chart-4/20 via-chart-4/10 to-transparent",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-wave"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance inline-block hover:scale-105 transition-transform duration-300">
            {t.features.title}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary via-accent to-chart-3 mx-auto rounded-full animate-[gradient_3s_linear_infinite] bg-[length:200%_auto]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden perspective-1000"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={`absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent ${hoveredIndex === index ? 'animate-shimmer' : ''}`}
                />
              </div>

              <CardContent className="p-6 relative z-10">
                <div className="mb-4 relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-2xl opacity-20 group-hover:opacity-60 transition-all duration-500 animate-pulse-glow`}
                  />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center border-2 border-border group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                    <feature.icon className="w-8 h-8 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping opacity-0 group-hover:opacity-75" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 group-hover:scale-105 inline-block">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </CardContent>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
