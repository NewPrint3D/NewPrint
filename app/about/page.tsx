"use client"

import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Target, Eye, TrendingUp, Award, Leaf, Users } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function AboutPage() {
  const { t, locale } = useLanguage() as any
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  // ✅ Fallbacks seguros (não quebra build se t.about estiver incompleto)
  const text = {
    title: t?.about?.title ?? (locale === "pt" ? "Sobre nós" : locale === "es" ? "Acerca de nosotros" : "About us"),
    subtitle:
      t?.about?.subtitle ??
      (locale === "pt"
        ? "Design moderno, impressão 3D premium e foco total em qualidade."
        : locale === "es"
          ? "Diseño moderno, impresión 3D premium y enfoque total en calidad."
          : "Modern design, premium 3D printing, and a strong focus on quality."),
    story: {
      title: t?.about?.story?.title ?? (locale === "pt" ? "Nossa história" : locale === "es" ? "Nuestra historia" : "Our story"),
      description:
        t?.about?.story?.description ??
        (locale === "pt"
          ? "Criamos peças únicas com acabamento profissional para transformar ambientes."
          : locale === "es"
            ? "Creamos piezas únicas con acabado profesional para transformar espacios."
            : "We create unique pieces with a professional finish to transform spaces."),
    },
    mission: {
      title: t?.about?.mission?.title ?? (locale === "pt" ? "Missão" : locale === "es" ? "Misión" : "Mission"),
      description:
        t?.about?.mission?.description ??
        (locale === "pt"
          ? "Entregar produtos bem-feitos, com bom gosto e experiência de compra segura."
          : locale === "es"
            ? "Entregar productos bien hechos, con buen gusto y una experiencia de compra segura."
            : "Deliver well-made products with great taste and a safe shopping experience."),
    },
    vision: {
      title: t?.about?.vision?.title ?? (locale === "pt" ? "Visão" : locale === "es" ? "Visión" : "Vision"),
      description:
        t?.about?.vision?.description ??
        (locale === "pt"
          ? "Ser referência em decoração impressa em 3D na Europa."
          : locale === "es"
            ? "Ser referencia en decoración impresa en 3D en Europa."
            : "Be a reference for 3D-printed decor in Europe."),
    },
    stats: {
      projects: t?.about?.stats?.projects ?? (locale === "pt" ? "Projetos" : locale === "es" ? "Proyectos" : "Projects"),
      customers: t?.about?.stats?.customers ?? (locale === "pt" ? "Clientes" : locale === "es" ? "Clientes" : "Customers"),
      materials: t?.about?.stats?.materials ?? (locale === "pt" ? "Materiais" : locale === "es" ? "Materiales" : "Materials"),
      countries: t?.about?.stats?.countries ?? (locale === "pt" ? "Países" : locale === "es" ? "Países" : "Countries"),
    },
    values: {
      title: t?.about?.values?.title ?? (locale === "pt" ? "Nossos valores" : locale === "es" ? "Nuestros valores" : "Our values"),
      innovation: t?.about?.values?.innovation ?? (locale === "pt" ? "Inovação" : locale === "es" ? "Innovación" : "Innovation"),
      innovationDesc:
        t?.about?.values?.innovationDesc ??
        (locale === "pt"
          ? "Novas ideias e melhoria contínua em cada peça."
          : locale === "es"
            ? "Nuevas ideas y mejora continua en cada pieza."
            : "New ideas and continuous improvement in every piece."),
      quality: t?.about?.values?.quality ?? (locale === "pt" ? "Qualidade" : locale === "es" ? "Calidad" : "Quality"),
      qualityDesc:
        t?.about?.values?.qualityDesc ??
        (locale === "pt"
          ? "Acabamento premium e controle de qualidade."
          : locale === "es"
            ? "Acabado premium y control de calidad."
            : "Premium finish and quality control."),
      sustainability:
        t?.about?.values?.sustainability ?? (locale === "pt" ? "Sustentabilidade" : locale === "es" ? "Sostenibilidad" : "Sustainability"),
      sustainabilityDesc:
        t?.about?.values?.sustainabilityDesc ??
        (locale === "pt"
          ? "Uso consciente de materiais e produção responsável."
          : locale === "es"
            ? "Uso consciente de materiales y producción responsable."
            : "Responsible production and mindful material use."),
      customer: t?.about?.values?.customer ?? (locale === "pt" ? "Cliente" : locale === "es" ? "Cliente" : "Customer"),
      customerDesc:
        t?.about?.values?.customerDesc ??
        (locale === "pt"
          ? "Atendimento claro e suporte rápido."
          : locale === "es"
            ? "Atención clara y soporte rápido."
            : "Clear support and fast help."),
    },
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { value: 5000, label: text.stats.projects, suffix: "+" },
    { value: 2500, label: text.stats.customers, suffix: "+" },
    { value: 50, label: text.stats.materials, suffix: "+" },
    { value: 30, label: text.stats.countries, suffix: "+" },
  ]

  const values = [
    {
      icon: Lightbulb,
      title: text.values.innovation,
      description: text.values.innovationDesc,
      color: "from-primary to-primary/50",
    },
    {
      icon: Award,
      title: text.values.quality,
      description: text.values.qualityDesc,
      color: "from-accent to-accent/50",
    },
    {
      icon: Leaf,
      title: text.values.sustainability,
      description: text.values.sustainabilityDesc,
      color: "from-chart-3 to-chart-3/50",
    },
    {
      icon: Users,
      title: text.values.customer,
      description: text.values.customerDesc,
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
              <span className="text-balance">{text.title}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {text.subtitle}
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
                  {text.story.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{text.story.description}</p>
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
                  {text.mission.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{text.mission.description}</p>
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
                  {text.vision.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{text.vision.description}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{text.values.title}</h2>
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
