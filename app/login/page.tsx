"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { t, locale } = useLanguage()
  const { login, isLoading, user, isAdmin } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const texts = useMemo(() => {
    return {
      welcome: (t as any).auth?.welcome || (locale === "pt" ? "Bem-vindo de volta" : "Bienvenido de nuevo"),
      login: (t as any).auth?.login || (locale === "pt" ? "Entrar" : "Iniciar sesión"),
      email: (t as any).auth?.email || (locale === "pt" ? "E-mail" : "Correo"),
      password: (t as any).auth?.password || (locale === "pt" ? "Senha" : "Contraseña"),
      noAccount:
        locale === "pt"
          ? "Não tem uma conta?"
          : locale === "es"
            ? "¿No tienes una cuenta?"
            : "Don't have an account?",
      signUp: locale === "pt" ? "Cadastre-se" : locale === "es" ? "Regístrate" : "Sign Up",
      adminOnly:
        locale === "pt"
          ? "Acesso permitido apenas para administrador."
          : locale === "es"
            ? "Acceso permitido solo para administrador."
            : "Admin access only.",
      connectionError:
        locale === "pt"
          ? "Não foi possível conectar. Tente novamente."
          : locale === "es"
            ? "No se pudo conectar. Inténtalo de nuevo."
            : "Couldn't connect. Please try again.",
    }
  }, [t, locale])

  // ✅ se já estiver logado, redireciona (e evita ficar “preso” no login)
  useEffect(() => {
    if (isLoading) return
    if (!user) return

    const next = searchParams.get("next")
    if (isAdmin) {
      router.replace(next || "/admin")
    } else {
      // usuário comum: manda pra home (ou perfil, se você tiver)
      router.replace("/")
    }
  }, [isLoading, user, isAdmin, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (submitting) return

    setSubmitting(true)
    const result = await login(email.trim(), password)

    if (!result.success) {
      setError(result.error || texts.connectionError)
      setSubmitting(false)
      return
    }

    // ✅ login ok: valida admin e redireciona
    // (isAdmin vem do context e atualiza após setUser)
    // Pequena espera microtask pra garantir estado atualizado
    setTimeout(() => {
      const next = searchParams.get("next")
      // Se não for admin, não deixa entrar no /admin
      // (isso evita “logou mas admin não abre”)
      if ((user && user.role === "admin") || isAdmin) {
        router.replace(next || "/admin")
      } else {
        setError(texts.adminOnly)
        setSubmitting(false)
      }
    }, 0)
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
                  autoComplete="email"
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
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full mt-2" size="lg" disabled={submitting}>
                {submitting ? "..." : texts.login}
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
