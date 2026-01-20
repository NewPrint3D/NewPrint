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

  const copy = {
    title: locale === "pt" ? "Contato" : locale === "es" ? "Contacto" : "Contact",
    leftTitle:
      locale === "pt"
        ? "Entre em contato conosco"
        : locale === "es"
          ? "Ponte en contacto con nosotros"
          : "Get in touch",
    leftText:
      locale === "pt"
        ? "Tem alguma dúvida sobre nossos produtos de impressão 3D ou precisa de um projeto personalizado? Estamos aqui para ajudar."
        : locale === "es"
          ? "¿Tienes alguna duda sobre nuestros productos de impresión 3D o necesitas un proyecto personalizado? Estamos aquí para ayudarte."
          : "Do you have any questions about our 3D printing products or need a custom project? We’re here to help.",

    emailLabel: locale === "pt" ? "Email" : "Email",

    formTitle:
      locale === "pt" ? "Envie uma mensagem" : locale === "es" ? "Envía un mensaje" : "Send a message",

    name: locale === "pt" ? "Nome" : locale === "es" ? "Nombre" : "Name",
    namePh: locale === "pt" ? "Seu nome" : locale === "es" ? "Tu nombre" : "Your name",

    email: locale === "pt" ? "Email" : "Email",
    emailPh: locale === "pt" ? "seu@email.com" : locale === "es" ? "tu@email.com" : "you@email.com",

    subject: locale === "pt" ? "Assunto" : locale === "es" ? "Asunto" : "Subject",
    subjectPh:
      locale === "pt"
        ? "Como podemos ajudar?"
        : locale === "es"
          ? "¿Cómo podemos ayudarte?"
          : "How can we help?",

    message: locale === "pt" ? "Mensagem" : locale === "es" ? "Mensaje" : "Message",
    messagePh:
      locale === "pt"
        ? "Escreva sua mensagem aqui..."
        : locale === "es"
          ? "Escribe tu mensaje aquí..."
          : "Write your message here...",

    button:
      locale === "pt"
        ? "Enviar Mensagem"
        : locale === "es"
          ? "Enviar mensaje"
          : "Send message",
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">{copy.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Informações de Contato (somente Email) */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">{copy.leftTitle}</h2>
              <p className="text-muted-foreground mb-6">{copy.leftText}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">{copy.emailLabel}</p>
                  <p className="text-muted-foreground">contato@newprint3d.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>{copy.formTitle}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{copy.name}</Label>
                  <Input id="name" placeholder={copy.namePh} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{copy.email}</Label>
                  <Input id="email" type="email" placeholder={copy.emailPh} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">{copy.subject}</Label>
                <Input id="subject" placeholder={copy.subjectPh} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{copy.message}</Label>
                <Textarea id="message" placeholder={copy.messagePh} className="min-h-[150px]" />
              </div>

              <Button className="w-full" size="lg">
                {copy.button}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
