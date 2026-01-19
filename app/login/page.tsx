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

export default function LoginPage() {
  const { t, locale } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const texts = {
    welcome: (t as any).auth?.welcome || (locale === "pt" ? "Bem-vindo de volta" : "Bienvenido de nuevo"),
    login: (t as any).auth?.login || (locale === "pt" ? "Entrar" : "Iniciar sesión"),
    email: (t as any).auth?.email || (locale === "pt" ? "E-mail" : "Correo"),
    password: (t as any).auth?.password || (locale === "pt" ? "Senha" : "Contraseña"),
    noAccount: locale === "pt" ? "Não tem uma conta?" : locale === "es" ? "¿No tienes una cuenta?" : "Don't have an account?",
    signUp: locale === "pt" ? "Cadastre-se" : locale === "es" ? "Regístrate" : "Sign Up"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de autenticação futura
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-12 container mx-auto px-4 flex justify-center">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">{texts.welcome}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{texts.email}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{texts.password}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full mt-2" size="lg">
                {texts.login}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {texts.noAccount}{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                {texts.signUp}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}
