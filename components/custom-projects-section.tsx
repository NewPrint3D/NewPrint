"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Wrench, Lightbulb, Package, X, FileImage } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function CustomProjectsSection() {
  const { toast } = useToast()
  const { t, locale } = useLanguage()

  const labels = {
    sending: locale === "pt" ? "Enviando..." : "Enviando...",
    sent: locale === "pt" ? "Enviado com sucesso ✓" : "Enviado con éxito ✓",

    title: locale === "pt" ? "Projetos Personalizados" : "Proyectos Personalizados",
    subtitle: locale === "pt" ? "Transformamos suas ideias em realidade 3D" : "Convertimos tus ideas en realidad 3D",

    replacementParts: locale === "pt" ? "Peças de Reposição" : "Piezas de Repuesto",
    replacementPartsDesc: locale === "pt" ? "Modelagem de peças técnicas." : "Modelado de piezas técnicas.",

    prototypes: locale === "pt" ? "Protótipos" : "Prototipos",
    prototypesDesc: locale === "pt" ? "Do conceito à peça física." : "Del concepto a la pieza física.",

    request: locale === "pt" ? "Solicitar Projeto" : "Solicitar Proyecto",
    name: locale === "pt" ? "Nome" : "Nombre",
    details: locale === "pt" ? "Detalhes do Projeto" : "Detalles del Proyecto",
    placeholder: locale === "pt" ? "Descreva sua ideia..." : "Describe tu idea...",
    upload: locale === "pt" ? "Upload de Arquivo (Opcional)" : "Subir Archivo (Opcional)",
    drag: locale === "pt" ? "Arraste e solte o arquivo" : "Arrastra y suelta el archivo",
    click: locale === "pt" ? "ou clique para selecionar" : "o haz clic para seleccionar",
    send: locale === "pt" ? "Enviar Solicitação" : "Enviar Solicitud",

    toastSuccessTitle: locale === "pt" ? "Mensagem Enviada" : "Mensaje Enviado",
    toastSuccessDesc:
      locale === "pt"
        ? "Recebemos seu projeto e entraremos em contato em breve."
        : "Hemos recibido tu proyecto y nos pondremos en contacto pronto.",

    toastErrorTitle: locale === "pt" ? "Erro" : "Error",
    toastErrorDesc:
      locale === "pt"
        ? "Não foi possível enviar agora. Tente novamente."
        : "No se pudo enviar ahora. Inténtalo de nuevo.",
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    file: null as File | null,
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      const fd = new FormData()
      fd.append("name", formData.name)
      fd.append("email", formData.email)
      fd.append("phone", formData.phone)
      fd.append("message", formData.message)
      if (formData.file) fd.append("file", formData.file)

      const res = await fetch("/api/contact", { method: "POST", body: fd })
      if (!res.ok) throw new Error(`Erro status ${res.status}`)

      toast({
        title: (t as any).customProjects?.toastSuccessTitle || labels.toastSuccessTitle,
        description: (t as any).customProjects?.toastSuccessDesc || labels.toastSuccessDesc,
      })

      setFormData({ name: "", email: "", phone: "", message: "", file: null })
      setPreview(null)
      setIsSent(true)
      setTimeout(() => setIsSent(false), 4000)
    } catch (err) {
      toast({
        variant: "destructive",
        title: (t as any).customProjects?.toastErrorTitle || labels.toastErrorTitle,
        description: (t as any).customProjects?.toastErrorDesc || labels.toastErrorDesc,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileSelect = (file: File) => {
    setFormData((prev) => ({ ...prev, file }))
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const features = [
    {
      icon: Lightbulb,
      title: (t as any).customProjects?.customProjects || labels.title,
      description: (t as any).customProjects?.customProjectsDesc || labels.subtitle,
    },
    {
      icon: Wrench,
      title: (t as any).customProjects?.replacementParts || labels.replacementParts,
      description: (t as any).customProjects?.replacementPartsDesc || labels.replacementPartsDesc,
    },
    {
      icon: Package,
      title: (t as any).customProjects?.prototypes || labels.prototypes,
      description: (t as any).customProjects?.prototypesDesc || labels.prototypesDesc,
    },
  ]

  return (
    <section id="custom" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {(t as any).customProjects?.title || labels.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {(t as any).customProjects?.subtitle || labels.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <Card
              key={i}
              className="group hover:shadow-2xl transition-all border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 relative inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-border group-hover:scale-110 transition-all mx-auto">
                    <f.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {(t as any).customProjects?.request || labels.request}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{(t as any).customProjects?.name || labels.name}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{locale === "pt" ? "Telefone" : "Teléfono"}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{(t as any).customProjects?.details || labels.details}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  placeholder={(t as any).customProjects?.placeholder || labels.placeholder}
                />
              </div>

              <div className="space-y-2">
                <Label>{(t as any).customProjects?.upload || labels.upload}</Label>

                {!formData.file ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/5 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">{(t as any).customProjects?.drag || labels.drag}</p>
                    <p className="text-xs text-muted-foreground">{(t as any).customProjects?.click || labels.click}</p>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-accent/5 flex items-center gap-4">
                    {preview ? (
                      <img src={preview} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <FileImage className="w-8 h-8" />
                    )}
                    <span className="text-sm flex-1 truncate">{formData.file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setFormData({ ...formData, file: null })
                        setPreview(null)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isSent}>
                {isSubmitting
                  ? (t as any).customProjects?.sending || labels.sending
                  : isSent
                    ? (t as any).customProjects?.sent || labels.sent
                    : (t as any).customProjects?.send || labels.send}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
