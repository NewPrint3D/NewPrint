"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  const stats = [
    { label: t.about.stats.projects, value: "500+" },
    { label: t.about.stats.customers, value: "300+" },
    { label: t.about.stats.materials, value: "20+" },
    { label: t.about.stats.countries, value: "10+" },
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border bg-card/50 backdrop-blur p-5 shadow-sm"
                >
                  <div className="text-2xl md:text-3xl font-bold">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-card/50 backdrop-blur p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{t.about.story.title}</h2>
              <p className="text-muted-foreground">{t.about.story.description}</p>
            </div>

            <div className="rounded-2xl border bg-card/50 backdrop-blur p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{t.about.mission.title}</h2>
              <p className="text-muted-foreground">{t.about.mission.description}</p>
            </div>

            <div className="rounded-2xl border bg-card/50 backdrop-blur p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{t.about.vision.title}</h2>
              <p className="text-muted-foreground">{t.about.vision.description}</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-12 rounded-2xl border bg-card/50 backdrop-blur p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t.about.values.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border bg-background/50 p-4">
                <div className="font-semibold">{t.about.values.innovation}</div>
                <div className="text-sm text-muted-foreground">
                  {t.about.values.innovationDesc}
                </div>
              </div>
              <div className="rounded-xl border bg-background/50 p-4">
                <div className="font-semibold">{t.about.values.quality}</div>
                <div className="text-sm text-muted-foreground">
                  {t.about.values.qualityDesc}
                </div>
              </div>
              <div className="rounded-xl border bg-background/50 p-4">
                <div className="font-semibold">{t.about.values.sustainability}</div>
                <div className="text-sm text-muted-foreground">
                  {t.about.values.sustainabilityDesc}
                </div>
              </div>
              <div className="rounded-xl border bg-background/50 p-4">
                <div className="font-semibold">{t.about.values.customer}</div>
                <div className="text-sm text-muted-foreground">
                  {t.about.values.customerDesc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
