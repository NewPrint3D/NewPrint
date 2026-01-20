"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t, locale } = useLanguage()

  const labels = {
    title: locale === "pt" ? "Sobre nós" : locale === "es" ? "Acerca de nosotros" : "About us",
    subtitle:
      locale === "pt"
        ? "Conheça mais sobre nós"
        : locale === "es"
          ? "Conoce más sobre nosotros"
          : "Learn more about us",

    storyTitle: locale === "pt" ? "Nossa história" : locale === "es" ? "Nuestra historia" : "Our Story",
    missionTitle: locale === "pt" ? "Nossa missão" : locale === "es" ? "Nuestra misión" : "Our Mission",
    visionTitle: locale === "pt" ? "Nossa visão" : locale === "es" ? "Nuestra visión" : "Our Vision",

    valuesTitle: locale === "pt" ? "Nossos valores" : locale === "es" ? "Nuestros valores" : "Our Values",
    innovation: locale === "pt" ? "Inovação" : locale === "es" ? "Innovación" : "Innovation",
    quality: locale === "pt" ? "Qualidade" : locale === "es" ? "Calidad" : "Quality",
    sustainability: locale === "pt" ? "Sustentabilidade" : locale === "es" ? "Sostenibilidad" : "Sustainability",
    customer: locale === "pt" ? "Cliente em primeiro lugar" : locale === "es" ? "El cliente primero" : "Customer First",

    projects: locale === "pt" ? "Projetos realizados" : locale === "es" ? "Proyectos completados" : "Projects Completed",
    customers: locale === "pt" ? "Clientes satisfeitos" : locale === "es" ? "Clientes satisfechos" : "Happy Customers",
    materials: locale === "pt" ? "Materiais disponíveis" : locale === "es" ? "Materiales disponibles" : "Materials Available",
    countries: locale === "pt" ? "Países atendidos" : locale === "es" ? "Países atendidos" : "Countries Served",
  }

  // 🔒 modo tolerante: usa t.about se existir, senão cai no labels (ES/PT/EN) — sem inglês aleatório
  const about = (t as any)?.about || {}

  const stats = [
    { label: about?.stats?.projects ?? labels.projects, value: "500+" },
    { label: about?.stats?.customers ?? labels.customers, value: "250+" },
    { label: about?.stats?.materials ?? labels.materials, value: "15+" },
    { label: about?.stats?.countries ?? labels.countries, value: "10+" },
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
              <span className="text-balance">{about?.title ?? labels.title}</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {about?.subtitle ?? labels.subtitle}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/60 bg-background/40 backdrop-blur-sm p-5 shadow-sm"
                >
                  <div className="text-3xl font-semibold">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">{about?.story?.title ?? labels.storyTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{about?.story?.description ?? ""}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">{about?.mission?.title ?? labels.missionTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{about?.mission?.description ?? ""}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">{about?.vision?.title ?? labels.visionTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{about?.vision?.description ?? ""}</p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">{about?.values?.title ?? labels.valuesTitle}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="font-semibold">{about?.values?.innovation ?? labels.innovation}</div>
                <div className="text-sm text-muted-foreground mt-1">{about?.values?.innovationDesc ?? ""}</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="font-semibold">{about?.values?.quality ?? labels.quality}</div>
                <div className="text-sm text-muted-foreground mt-1">{about?.values?.qualityDesc ?? ""}</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="font-semibold">{about?.values?.sustainability ?? labels.sustainability}</div>
                <div className="text-sm text-muted-foreground mt-1">{about?.values?.sustainabilityDesc ?? ""}</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="font-semibold">{about?.values?.customer ?? labels.customer}</div>
                <div className="text-sm text-muted-foreground mt-1">{about?.values?.customerDesc ?? ""}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
