"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const { locale } = useLanguage()
  const [error, setError] = useState("")
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Correção direta do erro apontado pelo Render na linha 76
      setError(locale === "pt" ? "As senhas não coincidem" : "Las contraseñas no coinciden")
      return
    }
    setError("")
    // Lógica de atualização futura
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {locale === "pt" ? "Meu Perfil" : "Mi Perfil"}
        </h1>
        
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{locale === "pt" ? "Alterar Senha" : "Cambiar Contraseña"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{locale === "pt" ? "Senha Atual" : "Contraseña Actual"}</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{locale === "pt" ? "Nova Senha" : "Nueva Contraseña"}</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{locale === "pt" ? "Confirmar Senha" : "Confirmar Contraseña"}</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                <Button type="submit" className="w-full">
                  {locale === "pt" ? "Atualizar Senha" : "Actualizar Contraseña"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
