"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User, Lock, Mail, CheckCircle2, AlertCircle } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Email change state
  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchProfile()
  }, [user, router])

  const fetchProfile = async () => {
    try {
      if (typeof window === "undefined") return
      const token = localStorage.getItem("auth_token")
      const res = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setProfileData(data.user)
        setEmailData({ ...emailData, newEmail: data.user.email })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t.profile.passwordsDoNotMatch)
      return
    }

    if (passwordData.newPassword.length < 12) {
      setError(t.profile.passwordMinLength)
      return
    }

    setIsLoading(true)

    try {
      if (typeof window === "undefined") return
      const token = localStorage.getItem("auth_token")
      const res = await fetch("/api/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(t.profile.passwordUpdated)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setError(data.error || t.profile.updateFailed)
      }
    } catch (error) {
      setError(t.profile.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    setIsLoading(true)

    try {
      if (typeof window === "undefined") return
      const token = localStorage.getItem("auth_token")
      const res = await fetch("/api/user/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newEmail: emailData.newEmail,
          password: emailData.password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(t.profile.emailUpdated)
        setEmailData({ ...emailData, password: "" })
        // Refresh profile data
        setTimeout(() => {
          fetchProfile()
        }, 1000)
      } else {
        setError(data.error || t.profile.updateFailed)
      }
    } catch (error) {
      setError(t.profile.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold mb-2">{t.profile.title}</h1>
            <p className="text-muted-foreground">{t.profile.subtitle}</p>
          </div>

          <Tabs defaultValue="info" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">
                <User className="h-4 w-4 mr-2" />
                {t.profile.accountInfo}
              </TabsTrigger>
              <TabsTrigger value="password">
                <Lock className="h-4 w-4 mr-2" />
                {t.profile.changePassword}
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                {t.profile.changeEmail}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>{t.profile.accountInformation}</CardTitle>
                  <CardDescription>{t.profile.accountDetails}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">{t.profile.firstName}</Label>
                      <p className="font-medium">{profileData.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t.profile.lastName}</Label>
                      <p className="font-medium">{profileData.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t.profile.email}</Label>
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t.profile.role}</Label>
                    <p className="font-medium capitalize">{profileData.role}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t.profile.memberSince}</Label>
                    <p className="font-medium">
                      {new Date(profileData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>{t.profile.passwordTitle}</CardTitle>
                  <CardDescription>
                    {t.profile.passwordDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {message && (
                      <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t.profile.currentPassword}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t.profile.newPassword}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t.profile.confirmNewPassword}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t.profile.updating}
                        </>
                      ) : (
                        t.profile.updatePassword
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>{t.profile.emailTitle}</CardTitle>
                  <CardDescription>
                    {t.profile.emailDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailChange} className="space-y-4">
                    {message && (
                      <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="currentEmail">{t.profile.currentEmail}</Label>
                      <Input
                        id="currentEmail"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newEmail">{t.profile.newEmail}</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={emailData.newEmail}
                        onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordForEmail">{t.profile.confirmPassword}</Label>
                      <Input
                        id="passwordForEmail"
                        type="password"
                        value={emailData.password}
                        onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t.profile.updating}
                        </>
                      ) : (
                        t.profile.updateEmail
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
