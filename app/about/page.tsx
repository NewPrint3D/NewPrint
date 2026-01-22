"use client"

import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Target, Eye, TrendingUp, Award, Leaf, Users } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function AboutPage() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { value: 5000, label: t.about.stats.projects, suffix: "+" },
    { value: 2500, label: t.about.stats.customers, suffix: "+" },
    { value: 50, label: t.about.stats.materials, suffix: "+" },
    { value: 30, label: t.about.stats.countries, suffix: "+" },
  ]

  const values = [
    {
      icon: Lightbulb,
      title: t.about.values.innovation,
      description: t.about.values.innovationDesc,
      color: "from-primary to-primary/50",
    },
    {
      icon: Award,
      title: t.about.values.quality,
      description: t.about.values.qualityDesc,
      color: "from-accent to-accent/50",
    },
    {
      icon: Leaf,
      title: t.about.values.sustainability,
      description: t.about.values.sustainabilityDesc,
      color: "from-chart-3 to-chart-3/50",
    },
    {
      icon: Users,
      title: t.about.values.customer,
      description: t.about.values.customerDesc,
      color: "from-chart-4 to-chart-4/50",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <span className="text-balance">{t.about.title}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {t.about.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-left-8 duration-700">
              <CardContent className="p-8">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary-foreground group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-200">
                  {t.about.story.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{t.about.story.description}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <CardContent className="p-8">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/50 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-accent-foreground group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors duration-200">
                  {t.about.mission.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{t.about.mission.description}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <CardContent className="p-8">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-3 to-chart-3/50 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-3 to-chart-3/50 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-primary-foreground group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-chart-3 transition-colors duration-200">
                  {t.about.vision.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{t.about.vision.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-in fade-in zoom-in-50 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:scale-110 transition-transform duration-300">
                  {isVisible ? <CountUp end={stat.value} suffix={stat.suffix} /> : "0"}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.about.values.title}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 relative inline-block">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                    />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center border border-border mx-auto">
                      <value.icon className="w-8 h-8 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-200">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end])

  return (
    <>
      {count}
      {suffix}
    </>
  )
}
