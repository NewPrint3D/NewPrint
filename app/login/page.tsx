"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const { t, locale } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Fallbacks para chaves que não existem no i18n atual
  const ui = {
    loggingIn: locale === "pt" ? "Entrando..." : locale === "es" ? "Iniciando..." : "Signing in...",
    loginButton: t.auth.login, // já existe
    noAccount: locale === "pt" ? "Não tem uma conta?" : locale === "es" ? "¿No tienes una cuenta?" : "Don’t have an account?",
    signUpHere: t.auth.signUp, // já existe
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || t.auth.loginFailed)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{t.auth.welcome}</CardTitle>
              <CardDescription className="text-center">{t.auth.login}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t.auth.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.placeholders.email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.auth.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.placeholders.password}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {ui.loggingIn}
                    </>
                  ) : (
                    ui.loginButton
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {ui.noAccount}{" "}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    {ui.signUpHere}
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
