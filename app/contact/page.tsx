"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { locale } = useLanguage()
  const { toast } = useToast()

  const copy =
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
          sending: "Enviando...",
          sent: "Enviado con éxito ✓",
          ready: "Listo para enviar.",
          successTitle: "Mensaje enviado",
          successDesc: "Gracias. Te responderemos lo antes posible.",
          errorTitle: "Error",
          errorDesc: "No se pudo enviar ahora. Inténtalo de nuevo.",
          required: "Completa los campos obligatorios.",
        }
      : locale === "pt"
        ? {
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
            sending: "Enviando...",
            sent: "Enviado com sucesso ✓",
            ready: "Pronto para enviar.",
            successTitle: "Mensagem enviada",
            successDesc: "Obrigado. Vamos responder o quanto antes.",
            errorTitle: "Erro",
            errorDesc: "Não foi possível enviar agora. Tente novamente.",
            required: "Preencha os campos obrigatórios.",
          }
        : {
            title: "Contact",
            subtitle: "Get in touch",
            description:
              "Do you have any questions about our 3D printing products or need a custom project? We’re here to help.",
            formTitle: "Send a message",
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message",
            send: "Send message",
            sending: "Sending...",
            sent: "Sent successfully ✓",
            ready: "Ready to send.",
            successTitle: "Message sent",
            successDesc: "Thanks. We’ll get back to you as soon as possible.",
            errorTitle: "Error",
            errorDesc: "Could not send right now. Please try again.",
            required: "Please fill the required fields.",
          }

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [inlineError, setInlineError] = useState<string | null>(null)

  const canSubmit =
    form.name.trim() && form.email.trim() && form.subject.trim() && form.message.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setInlineError(null)

    if (!canSubmit) {
      setInlineError(copy.required)
      return
    }

    try {
      setIsSubmitting(true)

      const fd = new FormData()
      fd.append("name", form.name)
      fd.append("email", form.email)
      fd.append("phone", "")
      fd.append("message", `Asunto: ${form.subject}\n\n${form.message}`)

      const res = await fetch("/api/contact", { method: "POST", body: fd })
      if (!res.ok) throw new Error(`Status ${res.status}`)

      toast({
        title: copy.successTitle,
        description: copy.successDesc,
      })

      // ✅ limpa campos
      setForm({ name: "", email: "", subject: "", message: "" })

      // ✅ botão muda para "enviado com sucesso" no idioma
      setIsSent(true)
      setTimeout(() => setIsSent(false), 6000)
    } catch (err) {
      toast({
        variant: "destructive",
        title: copy.errorTitle,
        description: copy.errorDesc,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">{copy.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* LADO ESQUERDO — APENAS EMAIL */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">{copy.subtitle}</h2>
              <p className="text-muted-foreground mb-6">{copy.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Email</p>
                <p className="text-muted-foreground">contacto@newprint3d.com</p>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <Card>
            <CardHeader>
              <CardTitle>{copy.formTitle}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{copy.name}</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder={copy.name}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{copy.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="email@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{copy.subject}</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder={copy.subject}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{copy.message}</Label>
                  <Textarea
                    id="message"
                    className="min-h-[150px]"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder={copy.message}
                    required
                  />
                </div>

                {inlineError && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="text-destructive">{inlineError}</div>
                  </div>
                )}

                <Button className="w-full" size="lg" type="submit" disabled={isSubmitting || isSent}>
                  {isSubmitting ? copy.sending : isSent ? copy.sent : copy.send}
                </Button>

                {/* ✅ mantém a mensagem "pronto para enviar" (você disse que ficou boa) */}
                {!isSubmitting && !isSent && canSubmit && !inlineError && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{copy.ready}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
