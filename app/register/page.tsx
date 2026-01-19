"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  const { t, locale } = useLanguage()
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      // Correção direta do erro apontado pelo Render na linha 38
      setError(locale === "pt" ? "As senhas não coincidem" : "Las contraseñas no coinciden")
      return
    }
    setError("")
    // Lógica de registro futura
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-12 container mx-auto px-4 flex justify-center">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {locale === "pt" ? "Criar Conta" : "Crear Cuenta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{locale === "pt" ? "Nome" : "Nombre"}</Label>
                <Input id="name" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{locale === "pt" ? "Senha" : "Contraseña"}</Label>
                <Input id="password" type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{locale === "pt" ? "Confirmar Senha" : "Confirmar Contraseña"}</Label>
                <Input id="confirmPassword" type="password" required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
              
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <Button type="submit" className="w-full mt-2" size="lg">
                {locale === "pt" ? "Registrar" : "Registrarse"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {locale === "pt" ? "Já tem uma conta?" : "¿Ya tienes una cuenta?"}{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                {locale === "pt" ? "Entrar" : "Iniciar sesión"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}
