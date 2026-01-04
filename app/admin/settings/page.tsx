"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Settings, Save, Palette, Globe, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const { isAdmin, isLoading } = useAuth()
  const { t, locale } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    siteName: "NewPrint3D",
    siteDescription: "Premium 3D printing with full customization",
    contactEmail: "contact@newprint3d.com",
    maintenanceMode: false,
    allowGuestCheckout: true,
    maxOrderValue: 1000,
    currency: "eur",
    timezone: "UTC",
    smtpEnabled: false,
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
  })

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/")
      setLoading(false)
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    const loadSettings = async () => {
      if (typeof window === "undefined") return
      try {
        // Load settings from localStorage or API
        const savedSettings = localStorage.getItem("admin_settings")
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      loadSettings()
    }
  }, [isAdmin])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem("admin_settings", JSON.stringify(settings))

      toast({
        title: "Settings Saved",
        description: "Your site settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-4xl font-bold mb-2">Site Settings</h1>
              <p className="text-muted-foreground">Configure your site appearance and functionality</p>
            </div>
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Store Settings */}
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Store Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable the store</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowGuestCheckout">Allow Guest Checkout</Label>
                    <p className="text-sm text-muted-foreground">Let customers checkout without account</p>
                  </div>
                  <Switch
                    id="allowGuestCheckout"
                    checked={settings.allowGuestCheckout}
                    onCheckedChange={(checked) => handleInputChange("allowGuestCheckout", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxOrderValue">Maximum Order Value ($)</Label>
                  <Input
                    id="maxOrderValue"
                    type="number"
                    value={settings.maxOrderValue}
                    onChange={(e) => handleInputChange("maxOrderValue", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => handleInputChange("timezone", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smtpEnabled">Enable SMTP</Label>
                    <p className="text-sm text-muted-foreground">Send transactional emails</p>
                  </div>
                  <Switch
                    id="smtpEnabled"
                    checked={settings.smtpEnabled}
                    onCheckedChange={(checked) => handleInputChange("smtpEnabled", checked)}
                  />
                </div>
                {settings.smtpEnabled && (
                  <>
                    <div>
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={settings.smtpHost}
                        onChange={(e) => handleInputChange("smtpHost", e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={settings.smtpPort}
                        onChange={(e) => handleInputChange("smtpPort", e.target.value)}
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input
                        id="smtpUser"
                        value={settings.smtpUser}
                        onChange={(e) => handleInputChange("smtpUser", e.target.value)}
                        placeholder="your-email@gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => handleInputChange("smtpPassword", e.target.value)}
                        placeholder="App password"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Theme settings are managed through the theme provider
                  </p>
                  <Button variant="outline" disabled>
                    Light/Dark Mode Toggle
                  </Button>
                </div>
                <div>
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Multi-language support is enabled
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>EN</Button>
                    <Button variant="outline" size="sm" disabled>PT</Button>
                    <Button variant="outline" size="sm" disabled>ES</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
