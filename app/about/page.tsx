"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  // 🔒 evita erro de TypeScript se o tipo do "t" estiver incompleto
  const about = (t as any)?.about || {
    title: "About",
    subtitle: "Learn more about us",
    story: { title: "Our Story", description: "" },
    mission: { title: "Our Mission", description: "" },
    vision: { title: "Our Vision", description: "" },
    values: {
      title: "Our Values",
      innovation: "Innovation",
      innovationDesc: "",
      quality: "Quality",
      qualityDesc: "",
      sustainability: "Sustainability",
      sustainabilityDesc: "",
      customer: "Customer First",
      customerDesc: "",
    },
    stats: {
      projects: "Projects Completed",
      customers: "Happy Customers",
      materials: "Materials Available",
      countries: "Countries Served",
    },
  }

  const stats = [
    { label: about?.stats?.projects ?? "Projects", value: "500+" },
    { label: about?.stats?.customers ?? "Customers", value: "250+" },
    { label: about?.stats?.materials ?? "Materials", value: "15+" },
    { label: about?.stats?.countries ?? "Countries", value: "10+" },
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
              <span className="text-balance">{about.title}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {about.subtitle}
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
              <h2 className="text-xl font-semibold mb-3">{about?.story?.title ?? "Our Story"}</h2>
              <p className="text-muted-foreground leading-relaxed">{about?.story?.description ?? ""}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">{about?.mission?.title ?? "Our Mission"}</h2>
              <p className="text-muted-foreground leading-relaxed">{about?.mission?.description ?? ""}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">{about?.vision?.title ?? "Our Vision"}</h2>
              <p className="text-muted-foreground leading-relaxed">{about?.vision?.description ?? ""}</p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">{about?.values?.title ?? "Our Values"}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="font-semibold">{about?.values?.innovation ?? "Innovation"}</div>
                <div className="text-sm text-muted-foreground mt-1">{about?.values?.innovationDesc ?? ""}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="font-semibold">{about?.values?.quality ?? "Quality"}</div>
                <div className="text-sm text-muted-foreground mt-1">{about?.values?.qualityDesc ?? ""}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="font-semibold">{about?.values?.sustainability ?? "Sustainability"}</div>
                <div className="text-sm text-muted-foreground mt-1">{about?.values?.sustainabilityDesc ?? ""}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="font-semibold">{about?.values?.customer ?? "Customer First"}</div>
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
