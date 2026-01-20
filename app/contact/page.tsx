"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function ContactPage() {
  const { locale } = useLanguage()

  const texts =
    locale === "es"
      ? {
          title: "Contacto",
          subtitle: "Ponte en contacto con nosotros",
          description:
            "¿Tienes alguna duda sobre nuestros productos de impresión 3D o necesitas un proyecto personalizado? Estamos aquí para ayudarte.",
          formTitle: "Enviar un mensaje",
          name: "Nombre",
          email: "Email",
          subject: "Asunto",
          message: "Mensaje",
          send: "Enviar mensaje",
        }
      : {
          title: "Contato",
          subtitle: "Entre em contato conosco",
          description:
            "Tem alguma dúvida sobre nossos produtos de impressão 3D ou precisa de um projeto personalizado? Estamos aqui para ajudar.",
          formTitle: "Enviar mensagem",
          name: "Nome",
          email: "Email",
          subject: "Assunto",
          message: "Mensagem",
          send: "Enviar mensagem",
        }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {texts.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* LADO ESQUERDO — APENAS EMAIL */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {texts.subtitle}
              </h2>
              <p className="text-muted-foreground mb-6">
                {texts.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Email</p>
                <p className="text-muted-foreground">
                  contacto@newprint3d.com
                </p>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <Card>
            <CardHeader>
              <CardTitle>{texts.formTitle}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{texts.name}</Label>
                  <Input placeholder={texts.name} />
                </div>

                <div className="space-y-2">
                  <Label>{texts.email}</Label>
                  <Input type="email" placeholder="email@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{texts.subject}</Label>
                <Input placeholder="..." />
              </div>

              <div className="space-y-2">
                <Label>{texts.message}</Label>
                <Textarea
                  className="min-h-[150px]"
                  placeholder="..."
                />
              </div>

              <Button className="w-full" size="lg">
                {texts.send}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
