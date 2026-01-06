"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsSubmitting(true)
  setIsSuccess(false)

  try {
    const form = e.currentTarget
    const fd = new FormData(form)

    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      subject: String(fd.get("subject") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    }

    const r = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await r.json().catch(() => null)

    if (!r.ok) {
      const msg =
        (data && (data.error || data.message)) ||
        `Erro ao enviar (status ${r.status})`
      alert(msg)
      return
    }

    setIsSuccess(true)
    form.reset()

    setTimeout(() => setIsSuccess(false), 3000)
  } catch (err: any) {
    alert("Falha ao enviar. Tente novamente.")
  } finally {
    setIsSubmitting(false)
  }
}

  const contactInfo = [
     
    {
      icon: Mail,
      label: t.contact.info.email,
      color: "from-accent to-accent/50",
    },
   
    {
      icon: Clock,
      label: t.contact.info.hours,
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
              <span className="text-balance">{t.contact.title}</span>
            </h1>
            <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {t.contact.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-left-8 duration-700">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 group">
                        <Label
                          htmlFor="name"
                          className="group-focus-within:text-primary transition-colors duration-200"
                        >
                          {t.contact.form.name}
                        </Label>
                        <Input
                          id="name"
                         name="name" 
                          required
                          className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                        />
                      </div>
                      <div className="space-y-2 group">
                        <Label
                          htmlFor="email"
                          className="group-focus-within:text-primary transition-colors duration-200"
                        >
                          {t.contact.form.email}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <Label
                        htmlFor="subject"
                        className="group-focus-within:text-primary transition-colors duration-200"
                      >
                        {t.contact.form.subject}
                      </Label>
                      <Input
                        id="subject"
                        name="subject" 
                        required
                        className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </div>

                    <div className="space-y-2 group">
                      <Label
                        htmlFor="message"
                        className="group-focus-within:text-primary transition-colors duration-200"
                      >
                        {t.contact.form.message}
                      </Label>
                      <Textarea
                        id="message"
                       name="message" 
                        required
                        rows={6}
                        className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting
                          ? t.contact.form.sending
                          : isSuccess
                            ? t.contact.form.success
                            : t.contact.form.send}
                        {!isSubmitting && !isSuccess && (
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-right-8 duration-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">{t.contact.info.title}</h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300"
                      >
                        <div className="relative">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${info.color} blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                          />
                          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-background to-muted flex items-center justify-center border border-border">
                            <info.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-200">
                            {info.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-right-8 duration-700 delay-100 overflow-hidden group">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <h3 className="text-lg font-bold mb-2">{t.contact.quickResponse.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.contact.quickResponse.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
