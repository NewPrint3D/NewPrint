"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Send, Wrench, Lightbulb, Package, X, FileImage } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function CustomProjectsSection() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    file: null as File | null,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: t.customProjects.messageSent,
      description: t.customProjects.messageDesc,
    })
    setFormData({ name: "", email: "", phone: "", message: "", file: null })
    setPreview(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setFormData({ ...formData, file })

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const removeFile = () => {
    setFormData({ ...formData, file: null })
    setPreview(null)
  }

  const features = [
    {
      icon: Lightbulb,
      title: t.customProjects.customProjects,
      description: t.customProjects.customProjectsDesc,
    },
    {
      icon: Wrench,
      title: t.customProjects.replacementParts,
      description: t.customProjects.replacementPartsDesc,
    },
    {
      icon: Package,
      title: t.customProjects.prototypes,
      description: t.customProjects.prototypesDesc,
    },
  ]

  return (
    <section id="custom" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{t.customProjects.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.customProjects.subtitle}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary via-accent to-chart-3 mx-auto rounded-full animate-[gradient_3s_linear_infinite] bg-[length:200%_auto] mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 relative inline-block">
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-border group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg mx-auto">
                    <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-all duration-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t.customProjects.requestProject}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t.customProjects.name}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.customProjects.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.customProjects.phone}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t.customProjects.projectDetails}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  placeholder={t.customProjects.projectPlaceholder}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label>{t.customProjects.uploadFile}</Label>

                {!formData.file ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                      isDragging
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-border hover:border-primary/50 hover:bg-accent/5"
                    }`}
                  >
                    <input
                      id="file"
                      type="file"
                      onChange={handleFileInputChange}
                      accept="image/*,.stl,.obj"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">{t.customProjects.dragDropFile}</p>
                        <p className="text-xs text-muted-foreground">{t.customProjects.clickToSelect}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.customProjects.acceptedFiles}</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative border-2 border-border rounded-lg p-4 bg-accent/5">
                    <div className="flex items-start gap-4">
                      {preview ? (
                        <img
                          src={preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileImage className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{formData.file.name}</p>
                        <p className="text-xs text-muted-foreground">{(formData.file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={removeFile} className="shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full group">
                <span className="flex items-center gap-2">
                  {t.customProjects.sendRequest}
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
